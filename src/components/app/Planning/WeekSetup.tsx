/**
 * WeekSetup — the real single-screen flow for shaping a week (Milestone 5).
 *
 * A transient, calm, tap-first experience: build a list of intentions, then
 * commit once. Last week's activities can be reused with one tap. Committing
 * saves the plan and lets entry routing carry the user to Reality (home).
 * See PRODUCT.md "The experiences" → Week Setup.
 */
import { useMemo, useState } from "react";
import { ArrowRight, Pencil, RotateCcw, Trash2 } from "lucide-react";

import type { DayIndex, Week } from "@/lib/domain/types";
import type { NewActivity } from "@/lib/store/useWeek";
import { DAY_LABELS, startOfWeek, todayIndex } from "@/lib/domain/week";
import { formatAmount } from "@/lib/format";
import ActivityEditor, { type DraftActivity } from "./ActivityEditor";

interface WeekSetupProps {
    /** Last week's plan, if any — offered for one-tap reuse. */
    previousWeek: Week | null;
    /** Persist the shaped plan; routing then flips to Reality automatically. */
    onCommit: (activities: NewActivity[]) => void;
}

/** A draft carries a local id purely for stable list keys during editing. */
interface Draft extends DraftActivity {
    localId: string;
}

let draftCounter = 0;
function nextDraftId(): string {
    draftCounter += 1;
    return `draft_${draftCounter}`;
}

function toDraft(activity: DraftActivity): Draft {
    return { ...activity, localId: nextDraftId() };
}

export default function WeekSetup({ previousWeek, onCommit }: WeekSetupProps) {
    // Today's index within this week — the friendly default for a new activity.
    const today = useMemo<DayIndex>(() => {
        const now = new Date();
        return todayIndex(startOfWeek(now), now) ?? 0;
    }, []);

    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const canReuse = !!previousWeek && previousWeek.activities.length > 0 && drafts.length === 0;

    function addDraft(value: DraftActivity) {
        setDrafts((list) => [...list, toDraft(value)]);
    }

    function updateDraft(localId: string, value: DraftActivity) {
        setDrafts((list) => list.map((d) => (d.localId === localId ? { ...value, localId } : d)));
        setEditingId(null);
    }

    function removeDraft(localId: string) {
        setDrafts((list) => list.filter((d) => d.localId !== localId));
        if (editingId === localId) setEditingId(null);
    }

    function reuseLastWeek() {
        if (!previousWeek) return;
        setDrafts(
            previousWeek.activities.map((a) =>
                toDraft({ name: a.name, emoji: a.emoji, unit: a.unit, target: a.target, day: a.day }),
            ),
        );
    }

    function commit() {
        if (drafts.length === 0) return;
        const activities: NewActivity[] = drafts.map((d) => ({
            name: d.name,
            emoji: d.emoji,
            unit: d.unit,
            target: d.target,
            day: d.day,
        }));
        onCommit(activities);
    }

    return (
        <section className="flex flex-1 flex-col pb-28">
            <header className="pt-6 pb-2">
                <p className="text-sm font-medium text-primary">A fresh week</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-balance text-foreground">
                    What do you hope this week holds?
                </h1>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    Add a few intentions. No pressure — you can shape them however you like.
                </p>
            </header>

            {/* One-tap reuse of last week */}
            {canReuse && (
                <button
                    type="button"
                    onClick={reuseLastWeek}
                    className="mt-4 flex w-full items-center gap-3 rounded-3xl border border-border/70 bg-card/70 p-4 text-left transition-all active:translate-y-px"
                    style={{ boxShadow: "var(--shadow-soft)" }}
                >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                        <RotateCcw className="size-5" />
                    </span>
                    <span className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground">
                            Reuse last week
                        </span>
                        <span className="block text-sm text-muted-foreground">
                            Bring back your {previousWeek?.activities.length}{" "}
                            {previousWeek?.activities.length === 1 ? "activity" : "activities"} to
                            start from.
                        </span>
                    </span>
                </button>
            )}

            {/* Draft list */}
            {drafts.length > 0 && (
                <ul className="mt-4 space-y-2.5">
                    {drafts.map((draft) =>
                        editingId === draft.localId ? (
                            <li key={draft.localId}>
                                <ActivityEditor
                                    initial={draft}
                                    defaultDay={today}
                                    submitLabel="Save changes"
                                    onCancel={() => setEditingId(null)}
                                    onSubmit={(value) => updateDraft(draft.localId, value)}
                                />
                            </li>
                        ) : (
                            <li
                                key={draft.localId}
                                className="flex items-center gap-3 rounded-3xl bg-card p-4"
                                style={{ boxShadow: "var(--shadow-soft)" }}
                            >
                                {draft.emoji && (
                                    <span
                                        className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-xl"
                                        aria-hidden="true"
                                    >
                                        {draft.emoji}
                                    </span>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-foreground">
                                        {draft.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatAmount(draft.target, draft.unit)}
                                        {draft.unit === "count" &&
                                            ` ${draft.target === 1 ? "time" : "times"}`}{" "}
                                        · {DAY_LABELS[draft.day]}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditingId(draft.localId)}
                                    aria-label={`Edit ${draft.name}`}
                                    className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                >
                                    <Pencil className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeDraft(draft.localId)}
                                    aria-label={`Remove ${draft.name}`}
                                    className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </li>
                        ),
                    )}
                </ul>
            )}

            {/* Add a new activity (hidden while editing an existing one) */}
            {editingId === null && (
                <div className="mt-4">
                    <ActivityEditor
                        key={drafts.length}
                        defaultDay={today}
                        submitLabel={drafts.length === 0 ? "Add activity" : "Add another"}
                        onSubmit={addDraft}
                    />
                </div>
            )}

            {/* Commit — sticky so it stays reachable on a long plan */}
            <div
                className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-md px-5"
                style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
            >
                <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent" />
                <button
                    type="button"
                    onClick={commit}
                    disabled={drafts.length === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all active:translate-y-px disabled:opacity-40"
                    style={{ boxShadow: "var(--shadow-lifted)" }}
                >
                    {drafts.length === 0 ? (
                        "Add an activity to begin"
                    ) : (
                        <>
                            Start my week
                            <ArrowRight className="size-5" />
                        </>
                    )}
                </button>
            </div>
        </section>
    );
}
