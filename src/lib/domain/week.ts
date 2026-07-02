/**
 * Week boundaries and elapsed-day logic.
 *
 * All reasoning is calendar-day based (not clock-millisecond based) so
 * that daylight-saving transitions never miscount a day. "Today" always
 * follows the device's local calendar day. See PRODUCT.md scoring rules.
 */

import type { DayIndex } from "./types";

/** Short labels for the seven days, Monday-first. */
export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** Whole calendar days between two dates, ignoring time-of-day and DST. */
function daysBetween(from: Date, to: Date): number {
    const fromUTC = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const toUTC = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((toUTC - fromUTC) / 86_400_000);
}

/** Midnight (local) on the Monday of the week containing `date`. */
export function startOfWeek(date: Date): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const offset = (d.getDay() + 6) % 7; // JS: 0 = Sunday → make Monday = 0
    d.setDate(d.getDate() - offset);
    return d;
}

/** yyyy-mm-dd for a date, using local calendar components. */
export function toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/** The week key (Monday's yyyy-mm-dd) for the week containing `date`. */
export function weekKey(date: Date): string {
    return toDateKey(startOfWeek(date));
}

/** Reconstruct the Monday-midnight Date from a week key. */
export function weekStartFromKey(key: string): Date {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
}

/**
 * Whole days since the week began: 0 on Monday, 6 on Sunday, 7+ once the
 * week is over, and negative if the week has not started yet.
 */
export function dayOffset(weekStart: Date, now: Date): number {
    return daysBetween(weekStart, now);
}

/** Today's index within the week (0–6), or null if `now` is outside the week. */
export function todayIndex(weekStart: Date, now: Date): DayIndex | null {
    const offset = dayOffset(weekStart, now);
    if (offset < 0 || offset > 6) return null;
    return offset as DayIndex;
}

/** True once the whole week (through Sunday) has passed. */
export function isWeekComplete(weekStart: Date, now: Date): boolean {
    return dayOffset(weekStart, now) > 6;
}

/**
 * Day indexes that have already occurred (started).
 * Empty before the week begins; all seven once the week is complete.
 * This is the set the accuracy score is allowed to consider.
 */
export function elapsedDays(weekStart: Date, now: Date): DayIndex[] {
    const offset = dayOffset(weekStart, now);
    if (offset < 0) return [];
    const last = Math.min(offset, 6);
    const days: DayIndex[] = [];
    for (let i = 0; i <= last; i++) days.push(i as DayIndex);
    return days;
}
