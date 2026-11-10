// Saves all progress on the device (AsyncStorage: phone storage on Android/iOS,
// browser storage on the web). Backups can be exported and imported as text.
import { useEffect, useRef, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "spirit-truth-college:v1";
export const DEFAULT_SETTINGS = { start: "2026-11-10", fastDay: 3, groupDay: 4, theme: "light", v: 2 };
const EMPTY = { settings: DEFAULT_SETTINGS, days: {}, learned: [] };

function normalise(o) {
  return {
    // Older saves defaulted to "match device"; move them to the new light look.
    settings: (() => { const st = { ...DEFAULT_SETTINGS, ...((o && o.settings) || {}) }; if (!o || !o.settings || o.settings.v !== 2) { st.theme = "light"; st.v = 2; } return st; })(),
    days: (o && o.days) || {},
    learned: (o && o.learned) || [],
  };
}

export function useStore() {
  const [data, setData] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => { if (raw) setData(normalise(JSON.parse(raw))); })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback((next) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {}); }, 300);
  }, []);

  const update = useCallback((fn) => {
    setData((prev) => { const next = fn(prev); persist(next); return next; });
  }, [persist]);

  const dayRec = (d) => data.days[d] || null;

  const toggleTask = (d, id) => update((p) => {
    const r = p.days[d] || { done: [], note: "", min: false };
    const done = r.done.includes(id) ? r.done.filter((x) => x !== id) : [...r.done, id];
    return { ...p, days: { ...p.days, [d]: { ...r, done } } };
  });
  const setDayField = (d, field, value) => update((p) => {
    const r = p.days[d] || { done: [], note: "", min: false };
    return { ...p, days: { ...p.days, [d]: { ...r, [field]: value } } };
  });
  const setSettings = (patch) => update((p) => ({ ...p, settings: { ...p.settings, ...patch } }));
  const toggleLearned = (ref) => update((p) => ({ ...p, learned: p.learned.includes(ref) ? p.learned.filter((x) => x !== ref) : [...p.learned, ref] }));
  const exportText = () => JSON.stringify({ app: "spirit-truth-college", version: 1, exported: new Date().toISOString(), ...data });
  const importText = (text) => { const o = JSON.parse(text); if (!o || typeof o !== "object" || !o.days) throw new Error("bad"); update(() => normalise(o)); };
  const resetAll = () => update(() => EMPTY);

  return { data, ready, dayRec, toggleTask, setDayField, setSettings, toggleLearned, exportText, importText, resetAll };
}
