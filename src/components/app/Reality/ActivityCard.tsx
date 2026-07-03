/**
 * ActivityCard — one intention as lived, the heart of the Reality page.
 *
 * Follows PRODUCT.md's card layout: name, target, today's progress, a bar,
 * and unit-aware quick-add chips. Intention (target) and reality (logged)
 * are kept visually separate for calm scanning. Tapping a chip records
 * reality immediately — there is no save step. Over-performing is shown
 * honestly in the number but the bar and percent cap at 100%.
 */
import { Check } from "lucide-react";

import type { Activity } from "@/lib/domain/types";
import { activityRatio, toPercent } from "@/lib/domain/accuracy";
import { formatAmount, quickAddChips } from "@/lib/format";

interface ActivityCardProps {
    activity: Activity;
    /** Word beside the reality figure ("Today" for today, "Logged" otherwise). */
    realityLabel: string;
    /** Whether this day can be logged (elapsed/today) or is still ahead. */
    loggable: boolean;
    onAddReality: (id: string, amount: number) => void;
}

export default function ActivityCard({
    activity,
    realityLabel,
    loggable,
    onAddReality,
}: ActivityCardProps) {
    const ratio = activityRatio(activity);
    const percent = toPercent(ratio);
    const reached = ratio >= 1;
    const chips = quickAddChips(activity.unit);
    const countNoun = activity.unit === "count";

    return (
        <li className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
            {/* Name */}
            <div className="flex items-center gap-2.5">
                {activity.emoji && (
                    <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-secondary text-lg"
                        aria-hidden="true"
                    >
                        {activity.emoji}
                    </span>
                )}
                <h3 className="min-w-0 flex-1 truncate text-lg font-semibold text-foreground">
                    {activity.name}
                </h3>
                {reached && (
                    <span className="flex items-center gap-1 text-sm font-medium text-pink">
                        <Check className="size-4" />
                        reached
                    </span>
                )}
            </div>

            {/* Intention vs reality, kept visually separate */}
            <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex items-baseline justify-between">
                    <dt className="text-muted-foreground">Target</dt>
                    <dd className="font-medium text-foreground">
                        {formatAmount(activity.target, activity.unit)}
                        {countNoun && (
                            <span className="ml-1 font-normal text-muted-foreground">
                                {activity.target === 1 ? "time" : "times"}
                            </span>
                        )}
                    </dd>
                </div>
                <div className="flex items-baseline justify-between">
                    <dt className="text-muted-foreground">{realityLabel}</dt>
                    <dd className="font-medium text-foreground">
                        {formatAmount(activity.reality, activity.unit)}
                        {countNoun && (
                            <span className="ml-1 font-normal text-muted-foreground">
                                {activity.reality === 1 ? "time" : "times"}
                            </span>
                        )}
                    </dd>
                </div>
            </dl>

            {/* Progress bar (capped at 100%) */}
            <div
                className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${activity.name} progress`}
            >
                <div
                    className="h-full rounded-full transition-[width] duration-500 ease-out"
                    style={{
                        width: `${percent}%`,
                        background: reached
                            ? "linear-gradient(90deg, var(--primary), var(--pink))"
                            : "var(--primary)",
                    }}
                />
            </div>

            {/* Quick-add chips — one tap logs reality, no save step */}
            {loggable ? (
                <div className="mt-4 flex gap-2">
                    {chips.map((chip) => (
                        <button
                            key={chip.label}
                            type="button"
                            onClick={() => onAddReality(activity.id, chip.amount)}
                            aria-label={`Add ${chip.label.replace("+", "")} to ${activity.name}`}
                            className="flex-1 rounded-2xl bg-secondary py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-accent/60 active:translate-y-px active:bg-accent"
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    This day hasn't arrived yet.
                </p>
            )}
        </li>
    );
}
