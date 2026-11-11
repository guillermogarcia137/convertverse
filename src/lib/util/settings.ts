import {cvLocalStorage,cvSessionStorage} from '#lib/util/storage';
import { error } from "#lib/util/logger.svelte";
import { browser } from "$app/env";

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
