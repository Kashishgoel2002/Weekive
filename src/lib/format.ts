/**
 * Display formatting for activity amounts.
 *
 * Pure and framework-agnostic so both Week Setup and Reality can share it.
 * Amounts live in base units (minutes for "time", whole counts for "count");
 * turning them into friendly labels is purely a display concern and lives
 * here rather than in the domain.
 */

import type { Unit } from "./domain/types";

/** Smallest editable step for each unit (matches the tap-first quick-adds). */
export const TIME_STEP = 15; // minutes
export const COUNT_STEP = 1;

/** Sensible starting target when a new activity is created. */
export const DEFAULT_TARGET: Record<Unit, number> = {
    time: 60, // one hour
    count: 1,
};

/** The smallest a target may be dialed down to. */
export const MIN_TARGET: Record<Unit, number> = {
    time: TIME_STEP,
    count: COUNT_STEP,
};

/** Format a minute count as "2h", "45m", or "1h 30m". */
export function formatMinutes(minutes: number): string {
    const total = Math.max(0, Math.round(minutes));
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
}

/**
 * Format an amount for its unit: time reads as hours/minutes, count reads
 * as a plain number (its noun, if any, lives beside it in the UI).
 */
export function formatAmount(amount: number, unit: Unit): string {
    if (unit === "time") return formatMinutes(amount);
    return String(Math.max(0, Math.round(amount)));
}

/** A single tap-to-log increment: the amount added and its short label. */
export interface QuickAdd {
    amount: number;
    label: string;
}

/**
 * The quick-add chips for a unit, straight from PRODUCT.md's card layout:
 * time → +15m/+30m/+1h, count → +1/+2/+5. One tap records reality; there
 * is never a save step.
 */
export function quickAddChips(unit: Unit): QuickAdd[] {
    if (unit === "time") {
        return [
            { amount: 15, label: "+15m" },
            { amount: 30, label: "+30m" },
            { amount: 60, label: "+1h" },
        ];
    }
    return [
        { amount: 1, label: "+1" },
        { amount: 2, label: "+2" },
        { amount: 5, label: "+5" },
    ];
}
