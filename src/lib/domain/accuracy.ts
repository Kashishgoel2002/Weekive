/**
 * Reality Accuracy scoring.
 *
 * The rules, straight from PRODUCT.md:
 *  - Each activity is capped at 100% (living beyond a target never inflates).
 *  - Accuracy is cumulative over elapsed days only; future days don't count.
 *  - Accuracy for a period = the average of each activity's capped ratio.
 *  - It recalculates continuously; there is no "finish week" step.
 */

import type { Activity, DayIndex, Week } from "./types";
import { elapsedDays, weekStartFromKey } from "./week";

/** Completion ratio for a reality/target pair, clamped to 0–1. */
export function cappedRatio(reality: number, target: number): number {
    if (target <= 0) return 1; // nothing was required → treat as met
    return Math.min(Math.max(reality, 0) / target, 1);
}

/** An activity's completion ratio (0–1), capped at 100%. */
export function activityRatio(activity: Activity): number {
    return cappedRatio(activity.reality, activity.target);
}

/** Convert a 0–1 ratio to a rounded whole percentage for display. */
export function toPercent(ratio: number): number {
    return Math.round(ratio * 100);
}

/** Average capped ratio across a set of activities, or null if empty. */
function averageRatio(activities: Activity[]): number | null {
    if (activities.length === 0) return null;
    const sum = activities.reduce((total, a) => total + activityRatio(a), 0);
    return sum / activities.length;
}

/**
 * Weekly Reality Accuracy (0–1) over the days that have elapsed so far,
 * or null when no scored day has any activities yet (nothing to show).
 */
export function weeklyAccuracy(week: Week, now: Date): number | null {
    const weekStart = weekStartFromKey(week.key);
    const elapsed = new Set<DayIndex>(elapsedDays(weekStart, now));
    const scored = week.activities.filter((a) => elapsed.has(a.day));
    return averageRatio(scored);
}

/** Accuracy (0–1) for a single day, or null if that day has no activities. */
export function dayAccuracy(week: Week, day: DayIndex): number | null {
    const dayActivities = week.activities.filter((a) => a.day === day);
    return averageRatio(dayActivities);
}
