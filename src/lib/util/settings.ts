import { cvLocalStorage, cvSessionStorage } from "#lib/util/storage";
import { error } from "#lib/util/logger.svelte";
import { browser } from "$app/env";

// Lee preferencias como un objeto parcial: algunos campos pueden no haberse guardado todavía.
// El código también se importa al preparar la web; browser impide acceder a localStorage fuera del navegador.
export function readSettings<
  T extends object = Record<string, unknown>,
>(): Partial<T> {
  if (!browser) return {};

  const raw = cvLocalStorage.getItem("settings");
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      cvLocalStorage.removeItem("settings");
      return {};
    }

    return parsed as Partial<T>;
  } catch (e) {
    error(["settings", "error"], `failed to parse saved settings: ${e}`);
    cvLocalStorage.removeItem("settings");
    return {};
  }
}
