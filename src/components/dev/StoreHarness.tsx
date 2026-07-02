/**
 * TEMPORARY development harness for the persistence layer (Milestone 3).
 *
 * Not part of the product. Exercises the useWeek hook — creating a plan,
 * adding activities, recording reality, editing, removing, and clearing —
 * so localStorage persistence can be verified in the browser. Also serves
 * as the first confirmation that React islands hydrate correctly.
 *
 * Remove this (and /dev) before launch — see Milestone 9.
 */
import { useWeek } from "@/lib/store/useWeek";
import type { DayIndex, Unit } from "@/lib/domain/types";
import { DAY_LABELS } from "@/lib/domain/week";
import { toPercent } from "@/lib/domain/accuracy";

const SAMPLES: { name: string; emoji: string; unit: Unit; target: number; day: DayIndex }[] = [
    { name: "Study", emoji: "📖", unit: "time", target: 240, day: 0 },
    { name: "Exercise", emoji: "🏃", unit: "time", target: 45, day: 1 },
    { name: "Reading", emoji: "📚", unit: "time", target: 120, day: 2 },
    { name: "Water", emoji: "💧", unit: "count", target: 8, day: 2 },
];

export default function StoreHarness() {
    const w = useWeek();

    if (!w.isLoaded) {
        return <p className="text-sm text-muted-foreground">Loading from storage…</p>;
    }

    const addSample = () => {
        const next = SAMPLES[(w.week?.activities.length ?? 0) % SAMPLES.length];
        w.addActivity(next);
    };

    const first = w.week?.activities[0];

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
                <button className={btn} onClick={addSample}>+ Add sample activity</button>
                <button
                    className={btn}
                    disabled={!first}
                    onClick={() => first && w.addReality(first.id, first.unit === "time" ? 30 : 1)}
                >
                    + Reality to first
                </button>
                <button
                    className={btn}
                    disabled={!first}
                    onClick={() => first && w.setReality(first.id, 0)}
                >
                    Reset first reality
                </button>
                <button
                    className={btn}
                    disabled={!first}
                    onClick={() => first && w.removeActivity(first.id)}
                >
                    Remove first
                </button>
                <button className={btnDanger} onClick={w.clearWeek}>Clear week</button>
            </div>

            <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">Has plan</dt>
                <dd className="text-foreground">{String(w.hasPlan)}</dd>
                <dt className="text-muted-foreground">Weekly accuracy</dt>
                <dd className="text-foreground">
                    {w.accuracy === null ? "null (nothing scored yet)" : `${toPercent(w.accuracy)}%`}
                </dd>
                <dt className="text-muted-foreground">Activities</dt>
                <dd className="text-foreground">{w.week?.activities.length ?? 0}</dd>
            </dl>

            {w.week && w.week.activities.length > 0 && (
                <ul className="space-y-2">
                    {w.week.activities.map((a) => (
                        <li key={a.id} className="rounded-xl bg-card p-3" style={{ boxShadow: "var(--shadow-soft)" }}>
                            <span className="text-foreground">
                                {a.emoji} {a.name} — {DAY_LABELS[a.day]} · reality {a.reality} / target {a.target}{" "}
                                {a.unit === "time" ? "min" : "count"}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <pre className="overflow-auto rounded-xl bg-secondary p-3 text-xs text-secondary-foreground">
                {JSON.stringify(w.week, null, 2)}
            </pre>
            <p className="text-xs text-muted-foreground">
                Change something, then refresh the page — it should persist.
            </p>
        </div>
    );
}

const btn =
    "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40";
const btnDanger =
    "rounded-full bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive";
