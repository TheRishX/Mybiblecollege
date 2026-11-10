import React, { useMemo, useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, Platform, Share, ScrollView } from "react-native";
import { serif } from "./theme";
import { Card, H, P, Label, Chip, Btn, Ring, Bar, Toggle, TaskRow, open } from "./ui";
import { TERMS, TOTAL, MEMORY, BREAK_TEXT, PLAN_CHAPTERS, MIN_IDS, dayPlan, chapterCount, todayISO, addDays, diff, parse, DOW, MON, longDate, shortDate, pad, iso, bibleLink } from "./plan";

/* ---------- shared calculations ---------- */
export function useCalc(store) {
  const { data } = store;
  return useMemo(() => {
    const s = data.settings;
    const visible = (plan, rec) => (rec && rec.min ? plan.tasks.filter((x) => MIN_IDS.includes(x.id)) : plan.tasks);
    const completion = (d) => {
      const plan = dayPlan(d, s); if (!plan) return null;
      const rec = data.days[d], vis = visible(plan, rec), done = rec ? rec.done : [];
      const n = vis.filter((x) => done.includes(x.id)).length;
      return { n, total: vis.length, f: vis.length ? n / vis.length : 0 };
    };
    const kept = (d) => { const r = data.days[d]; return !!(r && r.done.includes("read") && r.done.includes("pray")); };
    return { s, visible, completion, kept };
  }, [data]);
}

function stats(store, calc) {
  const { data } = store, s = data.settings, tdy = todayISO();
  const elapsed = Math.max(0, Math.min(TOTAL, diff(s.start, tdy) + 1));
  let streak = 0, d = calc.kept(tdy) ? tdy : addDays(tdy, -1);
  while (diff(s.start, d) >= 0 && calc.kept(d)) { streak++; d = addDays(d, -1); }
  let best = 0, run = 0, keptDays = 0;
  for (let i = 0; i < elapsed; i++) { const x = addDays(s.start, i); if (calc.kept(x)) { run++; keptDays++; best = Math.max(best, run); } else run = 0; }
  let chapters = 0; const counts = { fast: 0, serve: 0, group: 0, halfday: 0, church: 0 };
  Object.entries(data.days).forEach(([ds, r]) => {
    const dn = diff(s.start, ds); if (dn < 0 || dn >= TOTAL) return;
    if (r.done.includes("read")) chapters += chapterCount(dn);
    Object.keys(counts).forEach((k) => { if (r.done.includes(k)) counts[k]++; });
  });
  return { streak, best, keptDays, elapsed, chapters, counts };
}

/* ---------- Today ---------- */
export function TodayScreen({ t, store, calc, date, setDate }) {
  const s = store.data.settings, tdy = todayISO(), plan = dayPlan(date, s), rec = store.dayRec(date);
  const [note, setNote] = useState(rec ? rec.note || "" : "");
  useEffect(() => { setNote(rec ? rec.note || "" : ""); }, [date, store.ready]);
  useEffect(() => { const id = setTimeout(() => { if ((rec ? rec.note || "" : "") !== note) store.setDayField(date, "note", note); }, 600); return () => clearTimeout(id); }, [note]);

  const nav = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <View style={{ flex: 1, minWidth: 200 }}>
        <Label t={t}>{date === tdy ? "Today" : date < tdy ? "Past day" : "Upcoming"}</Label>
        <H t={t} size={24}>{longDate(date)}</H>
      </View>
      <Btn t={t} kind="ghost" small label="‹" accessibilityLabel="Previous day" onPress={() => setDate(addDays(date, -1))} />
      <Btn t={t} kind="ghost" small label="›" accessibilityLabel="Next day" onPress={() => setDate(addDays(date, 1))} />
      {date !== tdy ? <Btn t={t} small label="Today" onPress={() => setDate(tdy)} /> : null}
    </View>
  );
  if (!plan) {
    const before = diff(s.start, date) < 0;
    return (
      <View style={{ gap: 16 }}>{nav}
        <Card t={t} style={{ gap: 8 }}>
          <H t={t} size={18}>{before ? "Your programme hasn't started on this date" : "Your programme has finished by this date"}</H>
          <P t={t} muted>The college runs for {TOTAL} days, from {shortDate(s.start)} to {shortDate(addDays(s.start, TOTAL - 1))}.</P>
          {before ? <Btn t={t} label="Start the programme on this date" onPress={() => store.setSettings({ start: date })} style={{ alignSelf: "flex-start" }} /> : null}
        </Card>
      </View>
    );
  }
  const vis = calc.visible(plan, rec), done = rec ? rec.done : [], n = vis.filter((x) => done.includes(x.id)).length, mins = vis.reduce((a, x) => a + (x.mins || 0), 0);
  const sun = addDays(date, -parse(date).getUTCDay());
  const W = { morning: "Morning · time with the Father", study: "Study hall", day: "Through the day", evening: "Evening" };
  const st = stats(store, calc);

  return (
    <View style={{ gap: 16 }}>
      {nav}
      <View style={{ flexDirection: "row", gap: 16, alignItems: "center", backgroundColor: t.dark ? t.surface : t.accent, borderRadius: 20, padding: 18 }}>
        <Ring t={{ ...t, sunk: t.dark ? t.sunk : "rgba(255,255,255,0.28)", accent: t.dark ? t.accent : "#FFFFFF" }} value={vis.length ? n / vis.length : 0}>
          <Text style={{ color: t.dark ? t.fg : "#FFFFFF", fontWeight: "800", fontSize: 19 }}>{n}/{vis.length}</Text>
          <Text style={{ color: t.dark ? t.muted : "rgba(255,255,255,0.85)", fontSize: 11 }}>done</Text>
        </Ring>
        <View style={{ flex: 1, gap: 6, minWidth: 0 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            <View style={{ backgroundColor: t.dark ? t.accentSoft : "rgba(255,255,255,0.22)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: t.dark ? t.accent : "#FFFFFF", fontSize: 12, fontWeight: "700" }}>{plan.term.name}{plan.term.brk ? "" : ` · Week ${plan.week}/${plan.weeks}`}</Text></View>
            <View style={{ backgroundColor: t.dark ? t.sunk : "#FFFFFF", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: t.dark ? t.muted : t.accent, fontSize: 12, fontWeight: "700" }}>Day {plan.day + 1} of {TOTAL}</Text></View>
          </View>
          <Text style={{ color: t.dark ? t.fg : "#FFFFFF", fontSize: 15, lineHeight: 21, fontWeight: "600" }}>{plan.term.theme}</Text>
          <Text style={{ color: t.dark ? t.muted : "rgba(255,255,255,0.85)", fontSize: 12 }}>About {Math.round(mins / 5) * 5} min of set tasks · 🔥 {st.streak} day streak</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 4 }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x = addDays(sun, i), c = calc.completion(x), sel = x === date;
          const dot = c ? (c.f >= 0.999 ? t.accent : c.f > 0 ? t.gold : t.line) : t.line;
          return (
            <Pressable key={x} onPress={() => setDate(x)} accessibilityLabel={longDate(x)}
              style={{ flex: 1, alignItems: "center", gap: 3, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: sel ? t.accent : t.line, backgroundColor: sel ? t.accentSoft : t.surface }}>
              <Text style={{ color: t.muted, fontSize: 11 }}>{DOW[i].slice(0, 3)}</Text>
              <Text style={{ color: x === tdy ? t.accent : t.fg, fontWeight: "700", fontSize: 16 }}>{parse(x).getUTCDate()}</Text>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dot }} />
            </Pressable>
          );
        })}
      </View>

      <NotesCard t={t} plan={plan} />

      <Card t={t} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: t.fg, fontWeight: "600" }}>Minimum day</Text>
          <P t={t} muted size={13}>Sick, travelling or overloaded? Keep just reading, prayer and the memory verse. Grace, not guilt.</P>
        </View>
        <Toggle t={t} value={!!(rec && rec.min)} onChange={(v) => store.setDayField(date, "min", v)} label="Minimum day" />
      </Card>

      {Object.keys(W).map((w) => {
        const list = vis.filter((x) => x.watch === w); if (!list.length) return null;
        const wm = list.reduce((a, x) => a + (x.mins || 0), 0), wd = list.filter((x) => done.includes(x.id)).length;
        return (
          <Card t={t} key={w} style={{ padding: 0, overflow: "hidden", borderColor: t.sections[w].soft }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: t.sections[w].soft, paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: t.sections[w].c, alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#FFFFFF", fontSize: 15 }}>{t.sections[w].icon}</Text></View>
              <Text style={{ flex: 1, color: t.fg, fontWeight: "700", fontSize: 15 }}>{W[w]}</Text>
              <Text style={{ color: t.sections[w].c, fontSize: 13, fontWeight: "700" }}>{wd}/{list.length}{wm ? ` · ${wm} min` : ""}</Text>
            </View>
            <View style={{ paddingHorizontal: 16 }}>
              {list.map((x, i) => <TaskRow key={x.id} t={t} task={x} color={t.sections[w].c} done={done.includes(x.id)} onToggle={() => store.toggleTask(date, x.id)} last={i === list.length - 1} />)}
            </View>
          </Card>
        );
      })}

      <Card t={t} style={{ gap: 8 }}>
        <Label t={t}>Today's journal</Label>
        <TextInput value={note} onChangeText={setNote} multiline placeholder="What did God show you today? What will you do about it?" placeholderTextColor={t.muted}
          style={{ minHeight: 120, color: t.fg, borderColor: t.line, borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15, lineHeight: 22, textAlignVertical: "top", backgroundColor: t.bg }} />
        <P t={t} muted size={12}>Saved automatically on this device.</P>
      </Card>
    </View>
  );
}

function NotesCard({ t, plan }) {
  const [expanded, setExpanded] = useState(true);
  const N = plan.notes;
  const Row = ({ label, title, children }) => (
    <View style={{ gap: 3, paddingTop: 12, borderTopWidth: 1, borderTopColor: t.dark ? t.line : "#F5DDB0" }}>
      <Label t={t} style={{ color: t.gold }}>{label}</Label>
      {title ? <Text style={{ color: t.fg, fontWeight: "600" }}>{title}</Text> : null}
      <P t={t} size={14}>{children}</P>
    </View>
  );
  return (
    <Card t={t} style={{ gap: 12, backgroundColor: t.goldSoft, borderColor: t.goldSoft }}>
      <Pressable onPress={() => setExpanded(!expanded)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} accessibilityRole="button">
        <H t={t} size={18}>Notes for today</H>
        <Text style={{ color: t.gold, fontWeight: "700" }}>{expanded ? "Hide ▴" : "Show ▾"}</Text>
      </Pressable>
      {expanded ? (
        <>
          <Row label="Today's word" title={N.word.title}>{N.word.note}</Row>
          {N.season ? <Row label="This season">{N.season}</Row> : null}
          {N.study ? <Row label="Today's study: key idea" title={N.study.title}>{N.study.note}</Row> : null}
          {N.prayer ? <Row label="Prayer focus this week" title={N.prayer.title}>{N.prayer.note}</Row> : null}
          {N.books.map((b) => <Row key={b.book} label="Starting a new book" title={b.book}>{b.note}</Row>)}
        </>
      ) : <P t={t} muted size={14}>{N.word.title}</P>}
    </Card>
  );
}

/* ---------- Calendar ---------- */
export function CalendarScreen({ t, store, calc, date, setDate, go }) {
  const [month, setMonth] = useState(date.slice(0, 7));
  const [y, m] = month.split("-").map(Number), first = `${y}-${pad(m)}-01`, gridStart = addDays(first, -parse(first).getUTCDay()), tdy = todayISO();
  const shift = (k) => setMonth(iso(new Date(Date.UTC(y, m - 1 + k, 1, 12))).slice(0, 7));
  const cells = [...Array(42)].map((_, i) => addDays(gridStart, i));
  const upcoming = [];
  for (let i = 0; i < 70 && upcoming.length < 6; i++) { const d = addDays(tdy, i), p = dayPlan(d, calc.s); if (!p) continue; p.tasks.filter((x) => ["halfday", "mentor", "retreat"].includes(x.id)).forEach((x) => upcoming.push([d, x.title])); }
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <H t={t} size={24} style={{ flex: 1 }}>{MON[m - 1]} {y}</H>
        <Btn t={t} kind="ghost" small label="‹" accessibilityLabel="Previous month" onPress={() => shift(-1)} />
        <Btn t={t} kind="ghost" small label="›" accessibilityLabel="Next month" onPress={() => shift(1)} />
      </View>
      <Card t={t} style={{ padding: 10 }}>
        <View style={{ flexDirection: "row" }}>{DOW.map((d) => <Text key={d} style={{ flex: 1, textAlign: "center", color: t.muted, fontSize: 11, fontWeight: "700", paddingBottom: 6 }}>{d.slice(0, 3).toUpperCase()}</Text>)}</View>
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <View key={r} style={{ flexDirection: "row", gap: 4, marginBottom: 4 }}>
            {cells.slice(r * 7, r * 7 + 7).map((d) => {
              const c = calc.completion(d), out = d.slice(0, 7) !== month, p = c ? dayPlan(d, calc.s) : null;
              return (
                <Pressable key={d} onPress={() => { setDate(d); go("today"); }} accessibilityLabel={longDate(d)}
                  style={{ flex: 1, aspectRatio: 1, borderRadius: 10, borderWidth: d === tdy ? 2 : 1, borderColor: d === tdy ? t.accent : t.line, padding: 4, justifyContent: "space-between", opacity: out ? 0.35 : 1,
                    backgroundColor: c && c.f >= 0.999 ? t.accentSoft : t.surface }}>
                  <Text style={{ color: t.fg, fontSize: 13, fontWeight: "600" }}>{parse(d).getUTCDate()}</Text>
                  {p ? <Text numberOfLines={1} style={{ color: t.muted, fontSize: 9 }}>{p.term.brk ? "Break" : p.term.name.replace("Semester ", "S").replace("Intensive ", "I").replace("Orientation", "Ori")}</Text> : null}
                  {c ? <Bar t={t} value={c.f} height={4} /> : <View style={{ height: 4 }} />}
                </Pressable>
              );
            })}
          </View>
        ))}
      </Card>
      <P t={t} muted size={13}>The bar under each day shows how much of it you finished. Tap a day to open its tasks.</P>
      {upcoming.length ? (
        <Card t={t} style={{ gap: 8 }}>
          <Label t={t}>Coming up</Label>
          {upcoming.map(([d, x]) => <View key={d + x} style={{ flexDirection: "row", gap: 10 }}><Text style={{ color: t.accent, fontWeight: "600", width: 96 }}>{shortDate(d)}</Text><P t={t} size={14} style={{ flex: 1 }}>{x}</P></View>)}
        </Card>
      ) : null}
    </View>
  );
}

/* ---------- Progress ---------- */
export function ProgressScreen({ t, store, calc, setDate, go }) {
  const st = stats(store, calc), s = calc.s, tdy = todayISO();
  const curWeek = Math.max(0, Math.min(MEMORY.length - 1, Math.floor(diff(s.start, tdy) / 7)));
  const verses = MEMORY.slice(0, curWeek + 1);
  const Tile = ({ big, label, k = "study" }) => (
    <View style={{ flexBasis: "47%", flexGrow: 1, backgroundColor: t.sections[k].soft, borderRadius: 16, padding: 14 }}>
      <Text style={[serif, { color: t.sections[k].c, fontSize: 30, fontWeight: "700" }]}>{big}</Text><P t={t} size={12} style={{ color: t.fg }}>{label}</P>
    </View>
  );
  // 16-week heatmap ending this week
  const end = addDays(tdy, 6 - parse(tdy).getUTCDay()), startHM = addDays(end, -16 * 7 + 1);
  const cols = [...Array(16)].map((_, c) => [...Array(7)].map((_, r) => addDays(startHM, c * 7 + r)));
  const shade = (f) => (f == null || f === 0 ? t.sunk : f < 0.4 ? "#BFD0FF" : f < 0.8 ? "#7D9DFA" : t.accent);
  // practice consistency, last 30 days
  const practices = [["read", "Bible reading"], ["pray", "Prayer"], ["journal", "Journal"], ["memory", "Memory verse"], ["study", "Study hall"], ["examen", "Evening examen"]];
  const consistency = practices.map(([id, name]) => {
    let had = 0, did = 0;
    for (let i = 0; i < 30; i++) { const d = addDays(tdy, -i), p = dayPlan(d, s); if (!p || !p.tasks.some((x) => x.id === id)) continue; had++; const r = store.data.days[d]; if (r && r.done.includes(id)) did++; }
    return { id, name, had, did };
  });
  const journal = Object.entries(store.data.days).filter(([, r]) => r.note && r.note.trim()).sort((a, b) => (a[0] < b[0] ? 1 : -1));

  return (
    <View style={{ gap: 16 }}>
      <H t={t} size={24}>Your progress</H>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Tile k="morning" big={st.streak} label="day streak (reading and prayer)" />
        <Tile k="evening" big={st.best} label="best streak" />
        <Tile big={st.elapsed ? Math.round((st.keptDays * 100) / st.elapsed) + "%" : "—"} label={`days kept (${st.keptDays} of ${st.elapsed})`} k="day" />
        <Tile big={store.data.learned.length} label="memory verses learned" />
      </View>

      <Card t={t} style={{ gap: 10 }}>
        <Label t={t}>Through the programme</Label>
        <View style={{ gap: 6 }}><View style={{ flexDirection: "row", justifyContent: "space-between" }}><P t={t} size={14}>Programme days</P><P t={t} muted size={14}>{st.elapsed} / {TOTAL}</P></View><Bar t={t} value={st.elapsed / TOTAL} /></View>
        <View style={{ gap: 6 }}><View style={{ flexDirection: "row", justifyContent: "space-between" }}><P t={t} size={14}>Bible reading plan</P><P t={t} muted size={14}>{st.chapters} / {PLAN_CHAPTERS} chapters</P></View><Bar t={t} value={st.chapters / PLAN_CHAPTERS} color={t.gold} /></View>
      </Card>

      <Card t={t} style={{ gap: 10 }}>
        <Label t={t}>Last 16 weeks</Label>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 4 }}>
            {cols.map((col, c) => (
              <View key={c} style={{ gap: 4 }}>
                {col.map((d) => { const comp = calc.completion(d); return <Pressable key={d} onPress={() => { setDate(d); go("today"); }} accessibilityLabel={longDate(d)} style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: d > tdy ? "transparent" : shade(comp ? comp.f : null), borderWidth: d === tdy ? 2 : 0, borderColor: t.fg }} />; })}
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
          <P t={t} muted size={12}>Less</P>{[0, 0.3, 0.6, 1].map((f) => <View key={f} style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: shade(f) }} />)}<P t={t} muted size={12}>More</P>
        </View>
      </Card>

      <Card t={t} style={{ gap: 12 }}>
        <Label t={t}>Consistency, last 30 days</Label>
        {consistency.map((c) => (
          <View key={c.id} style={{ gap: 4 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}><P t={t} size={14}>{c.name}</P><P t={t} muted size={13}>{c.did} of {c.had} days</P></View>
            <Bar t={t} value={c.had ? c.did / c.had : 0} color={{ read: t.sections.morning.c, pray: t.sections.evening.c, journal: t.gold, memory: t.sections.day.c, study: t.sections.study.c, examen: t.sections.evening.c }[c.id]} />
          </View>
        ))}
      </Card>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Tile k="morning" big={st.counts.fast} label="fasts kept" />
        <Tile k="day" big={st.counts.serve} label="weeks served" />
        <Tile k="evening" big={st.counts.group} label="group meetings" />
        <Tile big={st.counts.halfday} label="half-days of prayer" />
      </View>

      <Card t={t} style={{ gap: 4 }}>
        <Label t={t}>Memory verses so far</Label>
        <P t={t} muted size={13}>Tick a verse once you can say it from memory.</P>
        {verses.slice().reverse().map((v) => {
          const on = store.data.learned.includes(v);
          return (
            <Pressable key={v} onPress={() => store.toggleLearned(v)} accessibilityRole="checkbox" accessibilityState={{ checked: on }}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: t.line }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: on ? t.accent : t.muted, backgroundColor: on ? t.accent : "transparent" }} />
              <Text style={{ color: t.fg, flex: 1 }}>{v}</Text>
              <Text onPress={() => open(bibleLink([v]))} style={{ color: t.accent, fontSize: 13 }}>Read ↗</Text>
            </Pressable>
          );
        })}
      </Card>

      <Card t={t} style={{ gap: 4 }}>
        <Label t={t}>Journal history</Label>
        {journal.length ? journal.slice(0, 60).map(([d, r]) => (
          <Pressable key={d} onPress={() => { setDate(d); go("today"); }} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: t.line, gap: 2 }}>
            <Text style={{ color: t.accent, fontWeight: "600", fontSize: 13 }}>{longDate(d)}</Text>
            <P t={t} size={14} style={{}} >{r.note.length > 160 ? r.note.slice(0, 160) + "…" : r.note}</P>
          </Pressable>
        )) : <P t={t} muted size={14}>Your journal entries will appear here. Write in "Today's journal" at the bottom of the Today tab.</P>}
      </Card>
    </View>
  );
}

/* ---------- Roadmap ---------- */
export function RoadmapScreen({ t, calc }) {
  const s = calc.s, cur = diff(s.start, todayISO());
  const [openKey, setOpenKey] = useState(() => { const tm = TERMS.find((x) => cur >= x.start && cur < x.start + x.days); return tm ? tm.key : "orient"; });
  return (
    <View style={{ gap: 16 }}>
      <H t={t} size={24}>Your roadmap</H>
      <P t={t} muted>{TOTAL} days from {shortDate(s.start)} to {shortDate(addDays(s.start, TOTAL - 1))}. You read the whole Bible once, Genesis to Revelation, in three daily tracks (Old Testament, New Testament starting with Mark, and Psalms then Proverbs), about two chapters a day with no chapter repeated. Every day has its own note, question, action and prayer.</P>
      <Card t={t} style={{ gap: 8 }}>
        <Label t={t}>How it fits together</Label>
        {[["Word", "Daily reading, memory and study give you knowledge and a renewed mind."], ["Prayer", "Eight stages, from the Lord's Prayer to praying in the Spirit and with authority."], ["Formation", "One discipline at a time, so habits stick and character grows."], ["Spirit", "The Holy Spirit, His gifts and your authority in Christ, practised safely."], ["Service", "Serving every week, so passion for Christ grows by being used."]].map(([a, b]) => (
          <View key={a} style={{ flexDirection: "row", gap: 10 }}><Text style={{ color: t.accent, fontWeight: "700", width: 84 }}>{a}</Text><P t={t} size={14} style={{ flex: 1 }}>{b}</P></View>
        ))}
      </Card>
      {TERMS.map((tm) => {
        const isCur = cur >= tm.start && cur < tm.start + tm.days, isOpen = openKey === tm.key;
        return (
          <Card key={tm.key} t={t} style={{ gap: 8, borderColor: isCur ? t.accent : t.line, borderWidth: isCur ? 2 : 1 }}>
            <Pressable onPress={() => setOpenKey(isOpen ? null : tm.key)} accessibilityRole="button" style={{ gap: 4 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                <H t={t} size={17}>{tm.name}{isCur ? "  ·  you are here" : ""}</H>
                <P t={t} muted size={13}>{shortDate(addDays(s.start, tm.start))} – {shortDate(addDays(s.start, tm.start + tm.days - 1))}</P>
              </View>
              <P t={t} muted size={14}>{tm.theme}</P>
            </Pressable>
            {isOpen ? (
              <View style={{ gap: 10 }}>
                {tm.study && tm.study.type === "rotate" ? tm.study.courses.map((c, i) => (
                  <View key={c.code} style={{ gap: 4, paddingTop: 10, borderTopWidth: 1, borderTopColor: t.line }}>
                    <Text style={{ color: t.fg, fontWeight: "700" }}>{c.code} {c.name} <Text style={{ color: t.muted, fontWeight: "400" }}>· {DOW[i + 1]}s</Text></Text>
                    {c.units.map((u, k) => <P key={k} t={t} muted size={13}>{u.w} wk: {u.seq ? u.t.replace("{x}", u.seq.length > 6 ? u.seq.slice(0, 3).join(", ") + " … " + u.seq[u.seq.length - 1] : u.seq.join(", ")) : u.t}</P>)}
                  </View>
                )) : tm.study ? tm.study.weeks.map((w, i) => <P key={i} t={t} muted size={13}>Week {i + 1}: {w.t}</P>) : <P t={t} muted size={13}>{BREAK_TEXT[tm.key]}</P>}
              </View>
            ) : null}
          </Card>
        );
      })}
      <Card t={t} style={{ gap: 6 }}>
        <Label t={t}>Milestones</Label>
        {[["End of Semester 1", "22 memory verses · Philippians study written · praying Scripture · serving weekly"], ["End of Semester 2", "39 verses · statement of beliefs and Rule of Life · listening prayer · testimony shared 3 times"], ["End of Semester 3", "57 verses · authority paper · praying with authority · praying for people"], ["End of Semester 4", "75 verses · calling statement · leading something"], ["Graduation", "Whole Bible read · 80% of days kept · taught a study · discipling someone · commissioned"]].map(([a, b]) => (
          <View key={a} style={{ paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: t.line }}><Text style={{ color: t.fg, fontWeight: "600" }}>{a}</Text><P t={t} muted size={13}>{b}</P></View>
        ))}
      </Card>
      <Card t={t} style={{ gap: 6 }}>
        <Label t={t}>Self-assessment</Label>
        <P t={t} muted size={13}>Rate each from 1 to 5 in your journal at the start, at each quarterly retreat and at graduation. Ask your mentor to rate you too.</P>
        {[["Knowledge", "I can explain the Bible's whole story · I can study a passage in context · I can explain the gospel and core beliefs with Scripture"], ["Prayer", "I pray daily and enjoy it · I recognise God's voice and test it · I pray in the Spirit and with understanding"], ["Discipline", "I keep my rhythm even when I don't feel like it · I fast, rest and practise solitude"], ["Spirit", "I depend on the Holy Spirit daily · I know and use my gifts · I use my authority in Christ humbly"], ["Fruit", "Love · joy · peace · patience · kindness · goodness · faithfulness · gentleness · self-control"], ["Service", "I serve with joy · I share my faith naturally · I sense my calling growing"]].map(([a, b]) => (
          <View key={a}><Text style={{ color: t.fg, fontWeight: "600" }}>{a}</Text><P t={t} muted size={13}>{b}</P></View>
        ))}
      </Card>
      <Card t={t} style={{ gap: 6 }}>
        <Label t={t}>Free tools</Label>
        {[["BiblicalTraining.org: free seminary courses", "https://www.biblicaltraining.org"], ["BibleProject: overview videos for every book", "https://bibleproject.com"], ["STEP Bible: word studies", "https://www.stepbible.org"], ["Blue Letter Bible", "https://www.blueletterbible.org"], ["NET Bible translator notes", "https://netbible.org"]].map(([a, u]) => (
          <Text key={u} onPress={() => open(u)} style={{ color: t.accent, paddingVertical: 4 }}>{a} ↗</Text>
        ))}
      </Card>
    </View>
  );
}

/* ---------- More / settings ---------- */
export function MoreScreen({ t, store }) {
  const s = store.data.settings;
  const [start, setStart] = useState(s.start);
  const [msg, setMsg] = useState("");
  const [importing, setImporting] = useState(false);
  const [importTextValue, setImportTextValue] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const DayPicker = ({ value, onChange }) => (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
      {DOW.map((d, i) => (
        <Pressable key={d} onPress={() => onChange(i)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: value === i ? t.accent : t.line, backgroundColor: value === i ? t.accentSoft : "transparent" }}>
          <Text style={{ color: value === i ? t.accent : t.fg, fontWeight: "600", fontSize: 13 }}>{d.slice(0, 3)}</Text>
        </Pressable>
      ))}
    </View>
  );
  const saveStart = () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || isNaN(parse(start).getTime())) { setMsg("Use the format YYYY-MM-DD, for example 2026-11-10."); return; }
    store.setSettings({ start }); setMsg("Start date saved.");
  };
  const doExport = async () => {
    const text = store.exportText();
    if (Platform.OS === "web") {
      try { const blob = new Blob([text], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `bible-college-backup-${todayISO()}.json`; a.click(); setMsg("Backup downloaded."); } catch (e) { setMsg("Couldn't download the backup in this browser."); }
    } else { try { await Share.share({ message: text, title: "Bible college backup" }); } catch (e) { setMsg("Couldn't open the share sheet."); } }
  };
  const doImport = () => { try { store.importText(importTextValue); setImporting(false); setImportTextValue(""); setMsg("Backup restored."); } catch (e) { setMsg("That doesn't look like a backup from this app. Paste the whole text and try again."); } };
  const pickFile = () => {
    if (Platform.OS !== "web") return;
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/json,.json";
    inp.onchange = () => { const f = inp.files && inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { store.importText(String(r.result)); setMsg("Backup restored."); } catch (e) { setMsg("That file isn't a backup from this app."); } }; r.readAsText(f); };
    inp.click();
  };
  return (
    <View style={{ gap: 16 }}>
      <H t={t} size={24}>Settings</H>
      {msg ? <Card t={t} style={{ backgroundColor: t.accentSoft, borderColor: t.accentSoft }}><P t={t} size={14}>{msg}</P></Card> : null}
      <Card t={t} style={{ gap: 10 }}>
        <Label t={t}>Programme start date</Label>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <TextInput value={start} onChangeText={setStart} placeholder="YYYY-MM-DD" placeholderTextColor={t.muted} autoCapitalize="none"
            style={{ flex: 1, color: t.fg, borderColor: t.line, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: t.bg, fontSize: 15 }} />
          <Btn t={t} label="Save" onPress={saveStart} />
        </View>
        <P t={t} muted size={13}>Changing it moves the whole schedule. Ticks you've made stay on the dates you made them.</P>
      </Card>
      <Card t={t} style={{ gap: 10 }}><Label t={t}>Weekly fast day</Label><DayPicker value={s.fastDay} onChange={(i) => store.setSettings({ fastDay: i })} /></Card>
      <Card t={t} style={{ gap: 10 }}><Label t={t}>Small group or accountability day</Label><DayPicker value={s.groupDay} onChange={(i) => store.setSettings({ groupDay: i })} /></Card>
      <Card t={t} style={{ gap: 10 }}>
        <Label t={t}>Appearance</Label>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {[["light", "Light (bright)"], ["dark", "Dark"], ["system", "Match device"]].map(([k, l]) => (
            <Pressable key={k} onPress={() => store.setSettings({ theme: k })} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: s.theme === k ? t.accent : t.line, backgroundColor: s.theme === k ? t.accentSoft : "transparent" }}>
              <Text style={{ color: s.theme === k ? t.accent : t.fg, fontWeight: "600", fontSize: 13 }}>{l}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card t={t} style={{ gap: 10 }}>
        <Label t={t}>Backup</Label>
        <P t={t} muted size={13}>Your progress is saved on this device. Export a backup now and then, and import it to move to a new phone or browser.</P>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Btn t={t} label={Platform.OS === "web" ? "Download backup" : "Share backup"} onPress={doExport} />
          {Platform.OS === "web" ? <Btn t={t} kind="ghost" label="Restore from file" onPress={pickFile} /> : null}
          <Btn t={t} kind="ghost" label="Paste a backup" onPress={() => setImporting(!importing)} />
        </View>
        {importing ? (
          <View style={{ gap: 8 }}>
            <TextInput value={importTextValue} onChangeText={setImportTextValue} multiline placeholder="Paste your backup text here" placeholderTextColor={t.muted}
              style={{ minHeight: 100, color: t.fg, borderColor: t.line, borderWidth: 1, borderRadius: 10, padding: 10, backgroundColor: t.bg, textAlignVertical: "top" }} />
            <Btn t={t} label="Restore this backup" onPress={doImport} style={{ alignSelf: "flex-start" }} />
          </View>
        ) : null}
      </Card>
      <Card t={t} style={{ gap: 10 }}>
        <Label t={t}>Start over</Label>
        {confirmReset ? (
          <View style={{ gap: 8 }}>
            <P t={t} size={14}>This deletes every tick, note and setting on this device. Download a backup first if you might want them.</P>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Btn t={t} kind="danger" label="Delete everything" onPress={() => { store.resetAll(); setConfirmReset(false); setStart("2026-11-10"); setMsg("All progress cleared."); }} />
              <Btn t={t} kind="ghost" label="Cancel" onPress={() => setConfirmReset(false)} />
            </View>
          </View>
        ) : <Btn t={t} kind="danger" label="Clear all progress" onPress={() => setConfirmReset(true)} style={{ alignSelf: "flex-start" }} />}
      </Card>
      <P t={t} muted size={12} style={{ textAlign: "center" }}>Spirit and Truth College · "Worship the Father in spirit and truth" (John 4:23–24)</P>
    </View>
  );
}
