/**
 * App — the React application root and entry router.
 *
 * Owns the single useWeek instance and decides which experience to show,
 * per PRODUCT.md "Entry routing":
 *   - no plan for the current week  → Week Setup
 *   - a plan exists                 → Reality (the home)
 * The user never chooses; the app already knows.
 */
import { useWeek } from "@/lib/store/useWeek";
import AppShell from "./AppShell";
import WeekSetup from "./Planning/WeekSetup";
import RealityHome from "./Reality/RealityHome";

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
                <RealityHome week={wk.week} accuracy={wk.accuracy} onAddReality={wk.addReality} />
            ) : (
                <WeekSetup previousWeek={wk.previousWeek} onCommit={wk.createWeek} />
            )}
        </AppShell>
    );
}
