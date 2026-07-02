/**
 * AppShell — the mobile-first frame every app screen lives inside.
 *
 * Constrains content to a comfortable phone-width column, centers it on
 * larger screens (desktop is an adaptation, per PRODUCT.md), and honors
 * device safe-area insets so nothing hides under notches or home bars.
 */
import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
    return (
        <div
            className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5"
            style={{
                paddingTop: "max(1.25rem, env(safe-area-inset-top))",
                paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
            }}
        >
            {children}
        </div>
    );
}
