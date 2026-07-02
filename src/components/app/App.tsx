/**
 * App — the React application root and entry router.
 *
 * Owns the single useWeek instance and decides which experience to show,
 * per PRODUCT.md "Entry routing":
 *   - no plan for the current week  → Week Setup
 *   - a plan exists                 → Reality (the home)
 * The user never chooses; the app already knows.
 */
import type { NewActivity } from "@/lib/store/useWeek";
import { useWeek } from "@/lib/store/useWeek";
import AppShell from "./AppShell";
import WeekSetup from "./Planning/WeekSetup";
import RealityHome from "./Reality/RealityHome";

// Temporary sample plan used by the Milestone 4 routing-test button.
// Removed in Milestone 5 when real setup lands.
const SAMPLE_PLAN: NewActivity[] = [
    { name: "Study", emoji: "📖", unit: "time", target: 240, day: 0 },
    { name: "Exercise", emoji: "🏃", unit: "time", target: 45, day: 1 },
    { name: "Reading", emoji: "📚", unit: "time", target: 120, day: 2 },
];

function LoadingState() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Getting your week ready…</p>
        </div>
    );
}

export default function App() {
    const wk = useWeek();
    const hasPlan = !!wk.week && wk.week.activities.length > 0;

    return (
        <AppShell>
            {!wk.isLoaded ? (
                <LoadingState />
            ) : hasPlan && wk.week ? (
                <RealityHome week={wk.week} accuracy={wk.accuracy} onResetPlan={wk.clearWeek} />
            ) : (
                <WeekSetup onCreateSamplePlan={() => wk.createWeek(SAMPLE_PLAN)} />
            )}
        </AppShell>
    );
}
