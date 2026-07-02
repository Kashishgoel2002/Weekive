/**
 * RealityHome — PLACEHOLDER (Milestone 4).
 *
 * Reality is the true home of the app (PRODUCT.md). The real logging and
 * reflection experience arrives in Milestones 6–7. For now this only
 * proves entry routing: it is shown when the current week has a plan.
 *
 * The "Clear plan" button is temporary routing-test scaffolding, not the
 * real Reality UI — it will be removed in a later milestone.
 */
import type { Week } from "@/lib/domain/types";
import { toPercent } from "@/lib/domain/accuracy";

interface RealityHomeProps {
    week: Week;
    accuracy: number | null;
    onResetPlan: () => void;
}

export default function RealityHome({ week, accuracy, onResetPlan }: RealityHomeProps) {
    return (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <span className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                Reality
            </span>
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Reality is home.
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                    Placeholder screen. The real Reality page arrives in Milestone 6.
                </p>
            </div>

            <div
                className="w-full rounded-2xl bg-card p-4 text-left"
                style={{ boxShadow: "var(--shadow-soft)" }}
            >
                <p className="text-sm text-muted-foreground">This week</p>
                <p className="mt-1 text-4xl font-semibold tracking-tight text-primary">
                    {accuracy === null ? "—" : `${toPercent(accuracy)}%`}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                    {week.activities.length} planned{" "}
                    {week.activities.length === 1 ? "activity" : "activities"}
                </p>
            </div>

            <button
                type="button"
                onClick={onResetPlan}
                className="rounded-full bg-destructive/10 px-5 py-2.5 text-sm font-medium text-destructive"
            >
                Clear plan
            </button>
            <p className="text-xs text-muted-foreground">
                Temporary — verifies routing returns to Week Setup when no plan exists.
            </p>
        </section>
    );
}
