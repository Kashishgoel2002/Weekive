/**
 * WeekSetup — PLACEHOLDER (Milestone 4).
 *
 * The transient flow for shaping a week. The real single-screen, tap-first
 * setup arrives in Milestone 5. For now this only proves entry routing:
 * it is shown when the current week has no plan yet.
 *
 * The "Create sample plan" button is temporary routing-test scaffolding,
 * not the real setup UI — it will be removed in Milestone 5.
 */
interface WeekSetupProps {
    onCreateSamplePlan: () => void;
}

export default function WeekSetup({ onCreateSamplePlan }: WeekSetupProps) {
    return (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <span className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                Week Setup
            </span>
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    What do you hope this week holds?
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                    Placeholder screen. The real setup flow arrives in Milestone 5.
                </p>
            </div>

            <button
                type="button"
                onClick={onCreateSamplePlan}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
                Create sample plan
            </button>
            <p className="text-xs text-muted-foreground">
                Temporary — verifies routing flips to Reality once a plan exists.
            </p>
        </section>
    );
}
