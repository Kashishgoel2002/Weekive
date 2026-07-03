/**
 * DayStrip — the fixed bottom strip for moving through the current week.
 *
 * Lets the user switch to any day and edit past days (PRODUCT.md). Today is
 * emphasised, the selected day is filled, elapsed days that carry activity
 * show a quiet dot, and days still ahead read gently muted.
 */
import type { DayIndex } from "@/lib/domain/types";
import { DAY_FULL_LABELS, DAY_LABELS } from "@/lib/domain/week";
import { cn } from "@/lib/utils";

interface DayStripProps {
    selected: DayIndex;
    today: DayIndex | null;
    /** Day-of-month numbers for each weekday, for a light calendar feel. */
    dates: number[];
    /** Days that carry at least one activity, for the quiet dot. */
    activeDays: Set<DayIndex>;
    onSelect: (day: DayIndex) => void;
}

export default function DayStrip({
    selected,
    today,
    dates,
    activeDays,
    onSelect,
}: DayStripProps) {
    return (
        <nav
            aria-label="Days of the week"
            className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-md px-3"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
            <div
                className="flex items-stretch gap-1 rounded-3xl border border-border/60 bg-card/90 p-1.5 backdrop-blur"
                style={{ boxShadow: "var(--shadow-lifted)" }}
            >
                {DAY_LABELS.map((label, index) => {
                    const day = index as DayIndex;
                    const isSelected = selected === day;
                    const isToday = today === day;
                    const hasActivity = activeDays.has(day);
                    return (
                        <button
                            key={label}
                            type="button"
                            onClick={() => onSelect(day)}
                            aria-pressed={isSelected}
                            aria-label={`${DAY_FULL_LABELS[index]}${isToday ? ", today" : ""}`}
                            className={cn(
                                "relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 transition-colors",
                                isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary",
                            )}
                        >
                            <span className="text-[0.65rem] font-medium tracking-wide uppercase">
                                {label.charAt(0)}
                            </span>
                            <span
                                className={cn(
                                    "text-sm font-semibold tabular-nums",
                                    !isSelected && isToday && "text-primary",
                                )}
                            >
                                {dates[index]}
                            </span>
                            {/* Quiet dot: planned activity on a day the user isn't viewing */}
                            <span
                                className={cn(
                                    "absolute bottom-1 size-1 rounded-full transition-opacity",
                                    hasActivity && !isSelected ? "opacity-100" : "opacity-0",
                                    isToday ? "bg-pink" : "bg-primary/50",
                                )}
                                aria-hidden="true"
                            />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
