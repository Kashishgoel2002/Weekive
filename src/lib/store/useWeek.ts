/**
 * useWeek — the React state spine for the application.
 *
 * Loads the current week from the store, exposes it plus the derived
 * Reality Accuracy, and provides the mutators the UI needs (create a
 * plan, add/edit/remove activities, record reality). Every mutation
 * persists immediately, so there is never a "save" step for the user.
 */

import { useCallback, useEffect, useState } from "react";

import type { Activity, DayIndex, Unit, Week } from "../domain/types";
import { toDateKey, weekKey, weekStartFromKey } from "../domain/week";
import { weeklyAccuracy } from "../domain/accuracy";
import { localWeekStore, type WeekStore } from "./storage";

/** Fields needed to introduce a new activity (id and reality are derived). */
export interface NewActivity {
    name: string;
    emoji?: string;
    unit: Unit;
    target: number;
    day: DayIndex;
    reality?: number;
}

/** Fields of an activity that can be edited after creation. */
export type ActivityPatch = Partial<Pick<Activity, "name" | "emoji" | "unit" | "target" | "day">>;

function newId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function toActivity(input: NewActivity): Activity {
    return {
        id: newId(),
        name: input.name.trim(),
        emoji: input.emoji,
        unit: input.unit,
        target: input.target,
        day: input.day,
        reality: Math.max(0, input.reality ?? 0),
    };
}

/** The Monday key of the week before the given week key. */
function previousWeekKey(key: string): string {
    const start = weekStartFromKey(key);
    start.setDate(start.getDate() - 7);
    return toDateKey(start);
}

export function useWeek(now: Date = new Date(), store: WeekStore = localWeekStore) {
    const currentKey = weekKey(now);

    const [week, setWeek] = useState<Week | null>(null);
    const [previousWeek, setPreviousWeek] = useState<Week | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load (and reload if the calendar week changes while open).
    useEffect(() => {
        setWeek(store.getWeek(currentKey));
        setPreviousWeek(store.getWeek(previousWeekKey(currentKey)));
        setIsLoaded(true);
    }, [currentKey, store]);

    // --- mutators (each persists immediately) --------------------------------

    const createWeek = useCallback(
        (activities: NewActivity[] = []) => {
            const next: Week = { key: currentKey, activities: activities.map(toActivity) };
            store.saveWeek(next);
            setWeek(next);
        },
        [currentKey, store],
    );

    const addActivity = useCallback(
        (input: NewActivity) => {
            setWeek((current) => {
                const base: Week = current ?? { key: currentKey, activities: [] };
                const next: Week = { ...base, activities: [...base.activities, toActivity(input)] };
                store.saveWeek(next);
                return next;
            });
        },
        [currentKey, store],
    );

    const updateActivity = useCallback(
        (id: string, patch: ActivityPatch) => {
            setWeek((current) => {
                if (!current) return current;
                const next: Week = {
                    ...current,
                    activities: current.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)),
                };
                store.saveWeek(next);
                return next;
            });
        },
        [store],
    );

    const removeActivity = useCallback(
        (id: string) => {
            setWeek((current) => {
                if (!current) return current;
                const next: Week = { ...current, activities: current.activities.filter((a) => a.id !== id) };
                store.saveWeek(next);
                return next;
            });
        },
        [store],
    );

    /** Add an increment to an activity's reality (the quick-add path). */
    const addReality = useCallback(
        (id: string, amount: number) => {
            setWeek((current) => {
                if (!current) return current;
                const next: Week = {
                    ...current,
                    activities: current.activities.map((a) =>
                        a.id === id ? { ...a, reality: Math.max(0, a.reality + amount) } : a,
                    ),
                };
                store.saveWeek(next);
                return next;
            });
        },
        [store],
    );

    /** Set an activity's reality to an exact amount (the correction path). */
    const setReality = useCallback(
        (id: string, amount: number) => {
            setWeek((current) => {
                if (!current) return current;
                const next: Week = {
                    ...current,
                    activities: current.activities.map((a) =>
                        a.id === id ? { ...a, reality: Math.max(0, amount) } : a,
                    ),
                };
                store.saveWeek(next);
                return next;
            });
        },
        [store],
    );

    const clearWeek = useCallback(() => {
        store.removeWeek(currentKey);
        setWeek(null);
    }, [currentKey, store]);

    // --- derived values ------------------------------------------------------

    const hasPlan = !!week && week.activities.length > 0;
    const accuracy = week ? weeklyAccuracy(week, now) : null;
    // A past week is fully elapsed by the current Monday, so score over all days.
    const previousAccuracy = previousWeek
        ? weeklyAccuracy(previousWeek, weekStartFromKey(currentKey))
        : null;

    return {
        week,
        previousWeek,
        isLoaded,
        hasPlan,
        accuracy,
        previousAccuracy,
        createWeek,
        addActivity,
        updateActivity,
        removeActivity,
        addReality,
        setReality,
        clearWeek,
    };
}
