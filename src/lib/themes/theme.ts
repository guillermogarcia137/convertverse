import { cvLocalStorage, cvSessionStorage } from "#lib/util/storage";
import { themes, palette } from "./catalog.js";
export const THEME_KEY = "convertverse.theme.v1";
// Recupera la elección de este navegador; si el almacenamiento falla utiliza un tema predeterminado.
export function readTheme() {
  try {
    return cvLocalStorage.getItem(THEME_KEY) || "navy-sans";
  } catch {
    return "navy-sans";
  }
}
// Una paleta se traduce a variables CSS, propiedades que las hojas de estilo reutilizan en toda la interfaz.
// También actualiza los nombres heredados de VERT para que sus controles usen los mismos colores.
export function applyTheme(id: string) {
  const selected =
      themes.find((t) => t.id === id) ||
      themes.find((t) => t.id === "navy-sans")!,
    p = palette(selected);
  const vars: Record<string, string> = {
    "--cv-bg": p.bg,
    "--cv-surface": p.surface,
    "--cv-sidebar": p.sidebar,
    "--cv-text": p.text,
    "--cv-muted": p.muted,
    "--cv-accent": p.accent,
    "--cv-line": p.border,
    "--cv-ink": p.ink,
    "--cv-link": p.link,
    "--cv-soft": p.soft,
    "--bg": p.bg,
    "--fg": p.text,
    "--fg-muted": p.muted,
    "--fg-on-accent": p.ink,
    "--fg-on-badge": p.ink,
    "--fg-accent": p.link,
    "--fg-failure": p.danger,
    "--text-panel": p.text,
    "--accent": p.accent,
    "--accent-alt": p.link,
    "--accent-pink": p.accent,
    "--accent-pink-alt": p.link,
    "--accent-pink-muted": p.link,
    "--accent-purple": p.accent,
    "--accent-purple-alt": p.link,
    "--accent-blue": p.accent,
    "--accent-blue-alt": p.link,
    "--bg-panel": p.surface,
    "--bg-panel-highlight": p.hover,
    "--bg-separator": p.border,
    "--bg-button": p.soft,
    "--bg-input": p.bg,
    "--bg-badge": p.accent,
    "--shadow-panel": "none",
    "--font-body": '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    "--font-display":
      '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };
  for (const [key, value] of Object.entries(vars))
    document.documentElement.style.setProperty(key, value);
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(p.mode);
  document.documentElement.dataset.cvTheme = p.id;
  document.documentElement.dataset.cvStyle = p.style;
  document.documentElement.style.colorScheme = p.mode;
  try {
    cvLocalStorage.setItem(THEME_KEY, p.id);
    cvLocalStorage.setItem("theme", p.mode);
  } catch {}
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", p.bg);
  // El evento avisa a la galería de que cambió el tema, aunque el cambio se haya hecho desde otro control.
  window.dispatchEvent(
    new CustomEvent("convertverse:theme", {
      detail: { id: p.id, mode: p.mode },
    }),
  );
  return p;
}
