import { useColorScheme } from "react-native";

// Bright, light palette: fresh sky blue with warm sunrise accents.
const light = {
  bg: "#F4F7FF", surface: "#FFFFFF", sunk: "#ECF0FB", fg: "#1E2445", muted: "#666D90", line: "#E2E7F4",
  accent: "#3366F0", accentSoft: "#E5ECFF", onAccent: "#FFFFFF", gold: "#D97F00", goldSoft: "#FFF2D9", done: "#9EA4BF",
  danger: "#D93636", header: "#3366F0", onHeader: "#FFFFFF", dark: false,
  sections: {
    morning: { c: "#F08A00", soft: "#FFF3DF", icon: "☀" },
    study: { c: "#3366F0", soft: "#E8EEFF", icon: "✎" },
    day: { c: "#12A37A", soft: "#E2F7EF", icon: "♥" },
    evening: { c: "#7C5CEB", soft: "#EFEAFE", icon: "☾" },
  },
};
// Optional dark mode, only when chosen in Settings.
const dark = {
  bg: "#14182B", surface: "#1D2238", sunk: "#262C47", fg: "#EDEFFA", muted: "#A4AAC8", line: "#30375A",
  accent: "#7C9BFF", accentSoft: "#263159", onAccent: "#0E1225", gold: "#FFB547", goldSoft: "#3D3020", done: "#7B82A3",
  danger: "#FF8A8A", header: "#1D2238", onHeader: "#EDEFFA", dark: true,
  sections: {
    morning: { c: "#FFB547", soft: "#3A2E1C", icon: "☀" },
    study: { c: "#7C9BFF", soft: "#232C52", icon: "✎" },
    day: { c: "#4FD1A5", soft: "#1B3A33", icon: "♥" },
    evening: { c: "#B39BFF", soft: "#2E2752", icon: "☾" },
  },
};
export function useTheme(pref) {
  const sys = useColorScheme();
  const mode = pref === "dark" ? "dark" : pref === "system" && sys === "dark" ? "dark" : "light";
  return mode === "dark" ? dark : light;
}
export const serif = { fontFamily: "Georgia" };
