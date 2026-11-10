import React, { useRef, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "./src/store";
import { useTheme, serif } from "./src/theme";
import { TabIcon } from "./src/ui";
import { todayISO } from "./src/plan";
import { useCalc, TodayScreen, CalendarScreen, ProgressScreen, RoadmapScreen, MoreScreen } from "./src/screens";

const TABS = [["today", "Today"], ["calendar", "Calendar"], ["progress", "Progress"], ["roadmap", "Roadmap"], ["more", "Settings"]];

function Shell() {
  const store = useStore();
  const t = useTheme(store.data.settings.theme);
  const calc = useCalc(store);
  const [tab, setTab] = useState("today");
  const [date, setDate] = useState(todayISO());
  const scroll = useRef(null);
  const insets = useSafeAreaInsets();
  const go = (k) => { setTab(k); requestAnimationFrame(() => scroll.current && scroll.current.scrollTo({ y: 0, animated: false })); };

  if (!store.ready) return <View style={{ flex: 1, backgroundColor: t.bg, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color={t.accent} /></View>;
  const props = { t, store, calc, date, setDate, go };
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style="light" />
      <SafeAreaView edges={["top", "left", "right"]} style={{ backgroundColor: t.header }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10, maxWidth: 760, width: "100%", alignSelf: "center" }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#3366F0", fontWeight: "800", fontSize: 18, lineHeight: 20 }}>✝</Text>
          </View>
          <Text style={[serif, { color: t.onHeader, fontSize: 19, fontWeight: "700" }]}>Spirit and Truth College</Text>
        </View>
      </SafeAreaView>
      <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, maxWidth: 760, width: "100%", alignSelf: "center" }} keyboardShouldPersistTaps="handled">
        {tab === "today" && <TodayScreen {...props} />}
        {tab === "calendar" && <CalendarScreen {...props} />}
        {tab === "progress" && <ProgressScreen {...props} />}
        {tab === "roadmap" && <RoadmapScreen {...props} />}
        {tab === "more" && <MoreScreen {...props} />}
      </ScrollView>
      <View style={{ flexDirection: "row", backgroundColor: t.surface, borderTopWidth: 1, borderTopColor: t.line, paddingBottom: Math.max(insets.bottom, 6), paddingLeft: insets.left, paddingRight: insets.right }}>
        {TABS.map(([k, l]) => {
          const on = tab === k;
          return (
            <Pressable key={k} onPress={() => go(k)} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={l}
              style={{ flex: 1, alignItems: "center", paddingTop: 8, paddingBottom: 4, gap: 2 }}>
              <View style={{ paddingHorizontal: 16, paddingVertical: 3, borderRadius: 999, backgroundColor: on ? t.accentSoft : "transparent" }}><TabIcon name={k} color={on ? t.accent : t.muted} /></View>
              <Text style={{ fontSize: 11, color: on ? t.accent : t.muted, fontWeight: on ? "700" : "500" }}>{l}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return <SafeAreaProvider><Shell /></SafeAreaProvider>;
}
