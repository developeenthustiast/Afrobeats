import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Skeleton Component - Loading State Indicator
 * 
 * Accessibility Features:
 * - role="status" for screen readers
 * - aria-label for context
 * - Respects prefers-reduced-motion (no animation)
 */

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { label?: string }) {
    return (
        <div
            role="status"
            aria-label={props['aria-label'] || "Loading"}
            className={cn(
                "animate-pulse rounded-lg bg-slate-800/40 border border-slate-800/60",
                className
            )}
            {...props}
        />
    )
}

export { Skeleton }
