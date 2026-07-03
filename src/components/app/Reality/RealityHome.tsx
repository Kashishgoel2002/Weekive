/**
 * RealityHome — the everyday home of Weekive (Milestone 6).
 *
 * Reality is where users live (PRODUCT.md "Reality is home"). Today's
 * activities dominate; weekly Reality Accuracy sits quietly at the top,
 * always visible and auto-updating but never loud. A bottom day strip lets
 * the user move through the week and edit earlier days.
 *
 * Reflection mood (the week-complete summary) is intentionally out of scope
 * here — it arrives in Milestone 7.
 */
import { useMemo, useState } from "react";

import type { Activity, DayIndex, Week } from "@/lib/domain/types";
import { toPercent } from "@/lib/domain/accuracy";
import {
    DAY_FULL_LABELS,
    elapsedDays,
    startOfWeek,
    todayIndex,
} from "@/lib/domain/week";
import ActivityCard from "./ActivityCard";
import DayStrip from "./DayStrip";

interface RealityHomeProps {
    week: Week;
    accuracy: number | null;
    onAddReality: (id: string, amount: number) => void;
}

/** Quiet, always-visible weekly accuracy — never the loudest thing on screen. */
function WeeklyAccuracy({ accuracy }: { accuracy: number | null }) {
    const percent = accuracy === null ? null : toPercent(accuracy);
    return (
        <div className="sticky top-0 z-10 -mx-5 bg-background/80 px-5 pt-3 pb-3 backdrop-blur">
            <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    This week
                </span>
                <span className="text-sm font-semibold text-primary tabular-nums">
                    {percent === null ? "—" : `${percent}%`}
                </span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary">
                <div
                    className="h-full rounded-full bg-primary/60 transition-[width] duration-500 ease-out"
                    style={{ width: `${percent ?? 0}%` }}
                />
            </div>
        </div>
    );
}

export default function RealityHome({ week, accuracy, onAddReality }: RealityHomeProps) {
    const now = useMemo(() => new Date(), []);
    const weekStart = useMemo(() => startOfWeek(now), [now]);
    const today = useMemo<DayIndex | null>(() => todayIndex(weekStart, now), [weekStart, now]);
    const elapsed = useMemo(() => new Set(elapsedDays(weekStart, now)), [weekStart, now]);

    const [selected, setSelected] = useState<DayIndex>(today ?? 6);

    // Day-of-month for each weekday, for the calendar-feel day strip.
    const dates = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            return d.getDate();
        });
    }, [weekStart]);

    // Which days carry at least one activity (drives the quiet strip dots).
    const activeDays = useMemo(() => {
        const set = new Set<DayIndex>();
        for (const a of week.activities) set.add(a.day);
        return set;
    }, [week.activities]);

    const dayActivities: Activity[] = useMemo(
        () => week.activities.filter((a) => a.day === selected),
        [week.activities, selected],
    );

    const isToday = today === selected;
    const loggable = elapsed.has(selected);
    const heading = isToday ? "Today" : DAY_FULL_LABELS[selected];

    return (
        <section className="flex flex-1 flex-col pb-24">
            <WeeklyAccuracy accuracy={accuracy} />

            <header className="pt-4 pb-1">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">{heading}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {dayActivities.length === 0
                        ? "A gentle, open day."
                        : isToday
                            ? "Tap to record what really happened."
                            : loggable
                                ? "Adjust anything that changed."
                                : "Here's what you hoped for."}
                </p>
            </header>

            {dayActivities.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                    <p className="text-base text-muted-foreground">
                        Nothing planned for {isToday ? "today" : DAY_FULL_LABELS[selected]}.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground/80">Rest is part of the week too.</p>
                </div>
            ) : (
                <ul className="mt-3 space-y-3">
                    {dayActivities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            realityLabel={isToday ? "Today" : "Logged"}
                            loggable={loggable}
                            onAddReality={onAddReality}
                        />
                    ))}
                </ul>
            )}

            <DayStrip
                selected={selected}
                today={today}
                dates={dates}
                activeDays={activeDays}
                onSelect={setSelected}
            />
        </section>
    );
}
