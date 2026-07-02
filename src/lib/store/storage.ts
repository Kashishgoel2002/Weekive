/**
 * Local-first persistence.
 *
 * All access goes through the `WeekStore` interface so the backing store
 * can later be swapped (e.g. for a server) without touching the UI — see
 * PRODUCT.md "Architecture". Version 1 persists to the browser's
 * localStorage under a single versioned key.
 */

import type { Week } from "../domain/types";

const STORAGE_KEY = "weekive:v1";

/** The shape written to disk. `version` guards future migrations. */
interface Persisted {
    version: 1;
    weeks: Record<string, Week>;
}

/** The persistence contract the app depends on. Swappable by design. */
export interface WeekStore {
    getWeek(key: string): Week | null;
    saveWeek(week: Week): void;
    removeWeek(key: string): void;
    clearAll(): void;
}

function isBrowser(): boolean {
    return typeof window !== "undefined" && !!window.localStorage;
}

function emptyState(): Persisted {
    return { version: 1, weeks: {} };
}

/** Read the whole blob, tolerating missing/corrupt/legacy data. */
function read(): Persisted {
    if (!isBrowser()) return emptyState();
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyState();
        const parsed = JSON.parse(raw) as Persisted;
        if (!parsed || parsed.version !== 1 || typeof parsed.weeks !== "object") {
            return emptyState();
        }
        return parsed;
    } catch {
        return emptyState();
    }
}

function write(state: Persisted): void {
    if (!isBrowser()) return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Storage full or unavailable — fail quietly. The app keeps working
        // from in-memory state; we never interrupt the user over persistence.
    }
}

/** The default localStorage-backed store used throughout Version 1. */
export const localWeekStore: WeekStore = {
    getWeek(key) {
        return read().weeks[key] ?? null;
    },
    saveWeek(week) {
        const state = read();
        state.weeks[week.key] = week;
        write(state);
    },
    removeWeek(key) {
        const state = read();
        delete state.weeks[key];
        write(state);
    },
    clearAll() {
        if (!isBrowser()) return;
        try {
            window.localStorage.removeItem(STORAGE_KEY);
        } catch {
            // ignore
        }
    },
};
