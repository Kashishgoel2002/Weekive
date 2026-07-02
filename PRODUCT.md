# Weekive — Product Source of Truth

_Version 1 — **FROZEN**. This is the permanent reference. When in doubt,
this file wins. After freeze, only major usability issues change the
product; minor preferences wait for Version 2._

---

## What it is

Weekive measures **Reality Accuracy**: the gap between the week you
imagined and the week you actually lived.

It is an honest weekly reflection tool. It is **not** a habit tracker,
a streak app, a productivity dashboard, a calendar replacement, or a
to-do list. It must never become a dashboard, a spreadsheet, an
analytics platform, or an enterprise productivity tool.

## The one belief

People don't fail for lack of plans. They fail because they never see
the gap between the imagined week and the lived one. Weekive makes that
gap visible — as understanding, never as judgment.

## Emotional contract (non-negotiable)

- Kind, never judging. It never says "you failed."
- Opening the app should **lower** pressure, not raise it.
- No streaks, no red marks, no "catching up," no penalties.
- Always: kind, hopeful, light, calm, encouraging.
- Opening Weekive should quietly improve someone's mood. If it doesn't,
  we failed.

## Friction principle (non-negotiable)

The app always optimizes for **reducing friction**.

- Open the app → update reality → leave, in **about 15 seconds**.
- **Tap-first.** Reality is updated through taps, not typing. Avoid
  keyboards and text entry wherever possible.
- If using Weekive ever feels like work, we have failed.

## Reality is home (non-negotiable)

Reality is the heart of the product. Users spend almost all their time
there. Week Setup is visited once a week. Reflection is not a place at
all — it is a mood Reality settles into. **Every design decision must
reinforce that Reality is home.**

## Visual hierarchy on the Reality page

Today matters more than the score. People open the app to record today,
not to judge a percentage. Order of visual importance:

1. **Today's activities**
2. **Quick logging** (the tap chips)
3. **Today's progress**
4. **Weekly Reality Accuracy** — always visible, auto-updating, but
   quiet. It never dominates.

The feeling must be "I'm here to record today," never "I'm here to
judge my score."

## Core concepts

- **Activity** — a thing you intend to do (Study, Exercise, Reading).
- **Target** — an amount + unit + day (e.g. Study, 4 hours, Monday).
- **Reality** — incremental entries added through taps. The app sums
  them automatically and stays editable until the week ends. The user
  never calculates totals.
- **Reality Accuracy** — a single percentage comparing plan vs reality
  across **only the days that have already occurred**. It recalculates
  continuously. There is no "finish week" step.

## Activity card layout

Intention and reality are kept visually separate for calm scanning:

```
Reading
Target   2 hours
Today    1h 30m
██████░░░░
[+15m] [+30m] [+1h]
```

Quick-add chips adapt to the unit (time → +15m/+30m/+1h; count → +1/+2/+5).

## Scoring rules

- Accuracy is cumulative over **elapsed days only**. Future planned days
  do not count until reached, so the user is never "behind."
- **Each activity is capped at 100%.** Living 6 hours against a 4-hour
  target counts as 100%, never 150%. Over-performing one activity never
  inflates the overall score.
- Accuracy for an elapsed period = the average of each activity's capped
  completion ratio for that period.

## The experiences

There are really only **two places** and **one emergent moment**:

1. **Week Setup** (transient) — a lightweight flow that appears only on
   first use, or when a new week has started with no plan yet. Not a
   permanent page. A user should finish setup in about **2–3 minutes**.
   Single screen, no wizard. Last week's activities are offered for
   one-tap reuse.
2. **Reality** (home) — opened daily. Today's activities are already
   waiting; the user taps to record reality and leaves. Two moods:
   - **Logging mood** (all week): today's activities dominate; weekly
     accuracy sits quietly at the edge.
   - **Reflection mood** (once the week completes — Sunday evening
     onward): the page naturally settles into a calm summary — accuracy,
     trend vs last week, a kind sentence, a read-only per-activity recap,
     and a gentle path into next week. Insight arrives on its own; it is
     never a separate screen to hunt for.

Plan edits after setup are possible but deliberately tucked away.

## Color & visual direction

Foundation is the **blue-purple family**, carrying the emotional warmth
of Concepts 4 & 5 — expressed through cool, optimistic color, never warm
coral/cream.

- Soft periwinkle, lavender, violet, blue, white.
- Small pink highlights as accent, used sparingly.
- Gradients should feel like **morning light, not sunset**.
- Fresh, premium, modern. Never corporate, never enterprise.

Craft cues: soft gradients, rounded cards, breathing white space, subtle
shadows, tactile interactions, delightful motion.

Avoid: enterprise dashboards, tables, harsh charts, heavy analytics,
boring SaaS, glassmorphism, generic AI gradients.

Motion follows Emil Kowalski's philosophy: alive, responsive, never
distracting.

## Platform

**Mobile-first — the phone is the real product**, not responsive design.
Desktop is only an adaptation. Whenever mobile and desktop conflict,
mobile wins.

## Architecture

- **Landing page** — Astro, static, fast. (Concepts 4/5 tone, blue-purple.)
- **Application** — React islands mounted on `/app` routes.
- **Domain logic** — pure, framework-agnostic TypeScript (scoring, week
  boundaries), fully testable.
- **Persistence** — local-first (on-device) via a swappable storage
  adapter, so a backend can be added later without touching UI.

## Version 1 scope

**In:** landing page, Week Setup flow, Reality home (logging + reflection
moods), local-first storage, last-week comparison.

**Out (deferred to V2):** accounts, sync, notifications, social, long-term
history, recurring/multi-day activities, mid-week nice-to-haves.
