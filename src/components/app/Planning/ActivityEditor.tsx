/**
 * ActivityEditor — the inline form for shaping a single intention.
 *
 * Used two ways in Week Setup: as an always-present "add an activity" panel,
 * and in place of a card when editing an existing one. It leans tap-first
 * (segmented unit, stepper target, day chips) so the only typing is the
 * activity's name. See PRODUCT.md "Friction principle" and "Core concepts".
 */
import { useEffect, useRef, useState } from "react";
import { Check, Minus, Plus, X } from "lucide-react";

import type { DayIndex, Unit } from "@/lib/domain/types";
import { DAY_LABELS } from "@/lib/domain/week";
import {
    COUNT_STEP,
    DEFAULT_TARGET,
    MIN_TARGET,
    TIME_STEP,
    formatAmount,
} from "@/lib/format";
import { cn } from "@/lib/utils";

/** The editable shape of an activity (no id, no accumulated reality yet). */
export interface DraftActivity {
    name: string;
    emoji?: string;
    unit: Unit;
    target: number;
    day: DayIndex;
}

interface ActivityEditorProps {
    /** Existing values when editing; omitted when adding a fresh activity. */
    initial?: DraftActivity;
    /** Day pre-selected for a fresh activity (defaults to today upstream). */
    defaultDay: DayIndex;
    submitLabel: string;
    /** Shown only while editing, so an in-progress edit can be abandoned. */
    onCancel?: () => void;
    onSubmit: (value: DraftActivity) => void;
}

/** A small, calm set of quick-pick emoji — optional decoration, never required. */
const EMOJI_CHOICES = ["📖", "🏃", "📚", "🧘", "💧", "✍️", "🎧", "🌿"] as const;

function makeInitial(initial: DraftActivity | undefined, defaultDay: DayIndex): DraftActivity {
    return (
        initial ?? {
            name: "",
            emoji: undefined,
            unit: "time",
            target: DEFAULT_TARGET.time,
            day: defaultDay,
        }
    );
}

export default function ActivityEditor({
    initial,
    defaultDay,
    submitLabel,
    onCancel,
    onSubmit,
}: ActivityEditorProps) {
    const isEditing = !!initial;
    const [draft, setDraft] = useState<DraftActivity>(() => makeInitial(initial, defaultDay));
    const nameRef = useRef<HTMLInputElement>(null);

    // When adding, land focus on the name so a plan flows without hunting.
    useEffect(() => {
        if (!isEditing) nameRef.current?.focus();
    }, [isEditing]);

    const step = draft.unit === "time" ? TIME_STEP : COUNT_STEP;
    const min = MIN_TARGET[draft.unit];
    const canSubmit = draft.name.trim().length > 0 && draft.target >= min;

    function setUnit(unit: Unit) {
        // Reset the target to that unit's default so a "4h" target never
        // silently becomes a nonsensical count of 240.
        setDraft((d) => ({ ...d, unit, target: DEFAULT_TARGET[unit] }));
    }

    function nudgeTarget(direction: 1 | -1) {
        setDraft((d) => ({ ...d, target: Math.max(min, d.target + direction * step) }));
    }

    function toggleEmoji(emoji: string) {
        setDraft((d) => ({ ...d, emoji: d.emoji === emoji ? undefined : emoji }));
    }

    function submit() {
        if (!canSubmit) return;
        onSubmit({ ...draft, name: draft.name.trim() });
        if (!isEditing) {
            // Reset for the next activity, keeping the chosen day for momentum.
            setDraft((d) => makeInitial(undefined, d.day));
            nameRef.current?.focus();
        }
    }

    return (
        <div
            className="rounded-3xl border border-border/70 bg-card/70 p-4"
            style={{ boxShadow: "var(--shadow-soft)" }}
        >
            {/* Name */}
            <label htmlFor="activity-name" className="sr-only">
                Activity name
            </label>
            <input
                id="activity-name"
                ref={nameRef}
                type="text"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && canSubmit) submit();
                }}
                placeholder="What do you hope to do?"
                enterKeyHint="done"
                autoComplete="off"
                className="w-full rounded-2xl bg-transparent px-1 py-1 text-lg font-medium text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none"
            />

            {/* Unit selection */}
            <fieldset className="mt-4">
                <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Measured by
                </legend>
                <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-secondary p-1">
                    {(["time", "count"] as const).map((u) => (
                        <button
                            key={u}
                            type="button"
                            onClick={() => setUnit(u)}
                            aria-pressed={draft.unit === u}
                            className={cn(
                                "rounded-xl py-2 text-sm font-medium transition-colors",
                                draft.unit === u
                                    ? "bg-card text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {u === "time" ? "Time" : "Count"}
                        </button>
                    ))}
                </div>
            </fieldset>

            {/* Target amount */}
            <fieldset className="mt-4">
                <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Target
                </legend>
                <div className="flex items-center justify-between rounded-2xl bg-secondary px-2 py-2">
                    <button
                        type="button"
                        onClick={() => nudgeTarget(-1)}
                        disabled={draft.target <= min}
                        aria-label="Decrease target"
                        className="flex size-10 items-center justify-center rounded-xl bg-card text-foreground shadow-sm transition-all active:translate-y-px disabled:opacity-40"
                    >
                        <Minus className="size-4" />
                    </button>
                    <span
                        className="min-w-24 text-center text-xl font-semibold text-foreground tabular-nums"
                        aria-live="polite"
                    >
                        {formatAmount(draft.target, draft.unit)}
                        {draft.unit === "count" && (
                            <span className="ml-1 text-sm font-normal text-muted-foreground">
                                {draft.target === 1 ? "time" : "times"}
                            </span>
                        )}
                    </span>
                    <button
                        type="button"
                        onClick={() => nudgeTarget(1)}
                        aria-label="Increase target"
                        className="flex size-10 items-center justify-center rounded-xl bg-card text-foreground shadow-sm transition-all active:translate-y-px"
                    >
                        <Plus className="size-4" />
                    </button>
                </div>
            </fieldset>

            {/* Day selection */}
            <fieldset className="mt-4">
                <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Day
                </legend>
                <div className="grid grid-cols-7 gap-1">
                    {DAY_LABELS.map((label, index) => {
                        const active = draft.day === index;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => setDraft((d) => ({ ...d, day: index as DayIndex }))}
                                aria-pressed={active}
                                aria-label={label}
                                className={cn(
                                    "rounded-xl py-2 text-xs font-medium transition-colors",
                                    active
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-secondary text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {label.charAt(0)}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            {/* Optional emoji */}
            <fieldset className="mt-4">
                <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Icon <span className="normal-case">(optional)</span>
                </legend>
                <div className="flex flex-wrap gap-1.5">
                    {EMOJI_CHOICES.map((emoji) => {
                        const active = draft.emoji === emoji;
                        return (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => toggleEmoji(emoji)}
                                aria-pressed={active}
                                aria-label={`Icon ${emoji}`}
                                className={cn(
                                    "flex size-9 items-center justify-center rounded-xl text-lg transition-all",
                                    active
                                        ? "bg-accent ring-2 ring-primary/40"
                                        : "bg-secondary hover:bg-accent/60",
                                )}
                            >
                                {emoji}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            {/* Actions */}
            <div className="mt-5 flex items-center gap-2">
                <button
                    type="button"
                    onClick={submit}
                    disabled={!canSubmit}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all active:translate-y-px disabled:opacity-40"
                >
                    <Check className="size-4" />
                    {submitLabel}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Cancel"
                        className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <X className="size-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
