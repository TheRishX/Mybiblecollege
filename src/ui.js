import React, { useState } from "react";
import { View, Text, Pressable, Linking, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { serif } from "./theme";
import { TASK_GUIDE } from "./guide";
import { bibleLink } from "./plan";

export const open = (url) => Linking.openURL(url).catch(() => {});

export function Card({ t, children, style }) {
  return <View style={[{ backgroundColor: t.surface, borderColor: t.line, borderWidth: 1, borderRadius: 16, padding: 16 }, style]}>{children}</View>;
}
export function H({ t, children, size = 22, style }) {
  return <Text style={[serif, { color: t.fg, fontSize: size, fontWeight: "700", lineHeight: size * 1.25 }, style]}>{children}</Text>;
}
export function P({ t, children, muted, size = 15, style }) {
  return <Text style={[{ color: muted ? t.muted : t.fg, fontSize: size, lineHeight: size * 1.5 }, style]}>{children}</Text>;
}
export function Label({ t, children, style }) {
  return <Text style={[{ color: t.muted, fontSize: 12, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" }, style]}>{children}</Text>;
}
export function Chip({ t, children, tone }) {
  const bg = tone === "accent" ? t.accentSoft : tone === "gold" ? t.goldSoft : t.sunk;
  const fg = tone === "accent" ? t.accent : tone === "gold" ? t.gold : t.muted;
  return <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: fg, fontSize: 12, fontWeight: "600" }}>{children}</Text></View>;
}
export function Btn({ t, label, onPress, kind = "primary", small, style, accessibilityLabel }) {
  const primary = kind === "primary", danger = kind === "danger";
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [{ backgroundColor: primary ? t.accent : "transparent", borderColor: danger ? t.danger : primary ? t.accent : t.line, borderWidth: 1, borderRadius: 10,
        paddingHorizontal: small ? 10 : 14, paddingVertical: small ? 6 : 10, opacity: pressed ? 0.7 : 1, alignItems: "center", justifyContent: "center" }, style]}>
      <Text style={{ color: primary ? t.onAccent : danger ? t.danger : t.fg, fontWeight: "600", fontSize: small ? 13 : 15 }}>{label}</Text>
    </Pressable>
  );
}
export function Ring({ t, value, size = 84, stroke = 9, children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={t.sunk} strokeWidth={stroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={t.accent} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={`${c} ${c}`} strokeDashoffset={c * (1 - Math.min(1, value))} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      {children}
    </View>
  );
}
export function Bar({ t, value, height = 8, color }) {
  return <View style={{ height, borderRadius: 99, backgroundColor: t.sunk, overflow: "hidden" }}><View style={{ width: `${Math.round(Math.min(1, value) * 100)}%`, height: "100%", backgroundColor: color || t.accent, borderRadius: 99 }} /></View>;
}
export function Check({ t, checked, onPress, label, color }) {
  const col = color || t.accent;
  return (
    <Pressable onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={label} hitSlop={10}
      style={{ width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: checked ? col : t.line, backgroundColor: checked ? col : t.surface, alignItems: "center", justifyContent: "center", marginTop: 1 }}>
      {checked ? <Svg width={14} height={14} viewBox="0 0 24 24"><Path d="M4 12.5l5 5L20 6.5" stroke="#FFFFFF" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg> : null}
    </Pressable>
  );
}
export function Toggle({ t, value, onChange, label }) {
  return (
    <Pressable onPress={() => onChange(!value)} accessibilityRole="switch" accessibilityState={{ checked: value }} accessibilityLabel={label}
      style={{ width: 46, height: 28, borderRadius: 14, backgroundColor: value ? t.accent : t.sunk, padding: 3, justifyContent: "center" }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: value ? t.onAccent : t.surface, transform: [{ translateX: value ? 18 : 0 }], borderWidth: value ? 0 : 1, borderColor: t.line }} />
    </Pressable>
  );
}

/* A single task with its "Why it matters" teaching underneath. */
export function TaskRow({ t, task, done, onToggle, color, last }) {
  const [openWhy, setOpenWhy] = useState(false);
  const g = TASK_GUIDE[task.id];
  return (
    <View style={{ flexDirection: "row", gap: 12, paddingVertical: 14, borderBottomWidth: last ? 0 : 1, borderBottomColor: t.line }}>
      <Check t={t} checked={done} onPress={onToggle} label={task.title} color={color} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Pressable onPress={onToggle}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: 8 }}>
            {task.special ? <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: t.gold }} /> : null}
            <Text style={{ color: done ? t.done : t.fg, fontWeight: "600", fontSize: 16, textDecorationLine: done ? "line-through" : "none", flexShrink: 1 }}>{task.title}</Text>
            {task.mins ? <Text style={{ color: t.muted, fontSize: 12 }}>{task.mins} min</Text> : null}
          </View>
        </Pressable>
        {task.id === "read" ? (
          <View style={{ marginTop: 4, gap: 4 }}>
            <Text style={[serif, { color: t.fg, fontSize: 18 }]}>{task.refs.join("  ·  ")}</Text>
            <Pressable onPress={() => open(bibleLink(task.refs))} style={{ alignSelf: "flex-start", backgroundColor: t.accentSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, marginTop: 2 }}><Text style={{ color: t.accent, fontWeight: "700", fontSize: 13 }}>Open in NKJV ↗</Text></Pressable>
          </View>
        ) : (
          <P t={t} muted size={14} style={{ marginTop: 3 }}>{task.detail}{task.id === "memory" ? "  " : ""}{task.id === "memory" ? <Text onPress={() => open(bibleLink(task.refs))} style={{ color: t.accent, fontWeight: "600" }}>Open verse ↗</Text> : null}</P>
        )}
        {g ? (
          <Pressable onPress={() => setOpenWhy(!openWhy)} accessibilityRole="button" style={{ marginTop: 8, alignSelf: "flex-start" }}>
            <Text style={{ color: t.gold, fontWeight: "600", fontSize: 13 }}>{openWhy ? "Hide" : "Why it matters"} {openWhy ? "▴" : "▾"}</Text>
          </Pressable>
        ) : null}
        {g && openWhy ? (
          <View style={{ marginTop: 8, backgroundColor: t.goldSoft, borderRadius: 12, padding: 12, gap: 8 }}>
            <View><Label t={t} style={{ color: t.gold }}>Why</Label><P t={t} size={14}>{g.why}</P></View>
            <View><Label t={t} style={{ color: t.gold }}>What happens when you do it</Label><P t={t} size={14}>{g.happens}</P></View>
            <Text onPress={() => open(bibleLink(g.verse.split("; ")))} style={{ color: t.gold, fontSize: 13, fontWeight: "600" }}>{g.verse} ↗</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* Bottom tab icons */
export function TabIcon({ name, color }) {
  const p = { stroke: color, strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      {name === "today" && (<><Path d="M12 3v18M7 8h10" {...p} /></>)}
      {name === "calendar" && (<><Rect x="3.5" y="5" width="17" height="15" rx="2.5" {...p} /><Path d="M3.5 10h17M8 3v4M16 3v4" {...p} /></>)}
      {name === "progress" && (<><Path d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...p} /></>)}
      {name === "roadmap" && (<><Path d="M4 19c4 0 4-6 8-6s4-6 8-6" {...p} /><Circle cx="4" cy="19" r="1.8" {...p} /><Circle cx="20" cy="7" r="1.8" {...p} /></>)}
      {name === "more" && (<><Circle cx="12" cy="12" r="3" {...p} /><Path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" {...p} /></>)}
    </Svg>
  );
}
