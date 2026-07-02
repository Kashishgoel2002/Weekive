/**
 * Weekive domain types — the shared vocabulary of the product.
 *
 * These are intentionally small and framework-agnostic. See PRODUCT.md
 * "Core concepts" for the meaning behind each field.
 */

/**
 * How an activity is measured.
 * - "time"  → amounts are stored as whole minutes (hours are a display concern).
 * - "count" → amounts are whole counts (cups, pages, sessions).
 */
export type Unit = "time" | "count";

/**
 * Day within a week. 0 = Monday … 6 = Sunday.
 * The week always runs Monday → Sunday (see PRODUCT.md scoring rules).
 */
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * A single intention for the week: a thing you meant to do, how much,
 * and on which day — plus the reality accumulated so far.
 */
export interface Activity {
    id: string;
    name: string;
    /** Optional decorative emoji shown on the card. */
    emoji?: string;
    unit: Unit;
    /** Planned amount in base units (minutes for time, whole count for count). */
    target: number;
    day: DayIndex;
    /** Reality accumulated so far, in the same base units as `target`. */
    reality: number;
}

/**
 * One planned week. `key` is the Monday's date (yyyy-mm-dd) and doubles
 * as the unique identifier and the week's start date.
 */
export interface Week {
    key: string;
    activities: Activity[];
}
