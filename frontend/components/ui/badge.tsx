import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge Component - Visual Label/Tag
 * 
 * Used for status indicators, tags, labels
 * Ensures proper contrast ratios for WCAG AA compliance
 */

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-indigo-600/90 text-white shadow hover:bg-indigo-600",
                secondary:
                    "border-transparent bg-slate-700 text-slate-100 hover:bg-slate-600",
                destructive:
                    "border-transparent bg-rose-600/90 text-white shadow hover:bg-rose-600",
                success:
                    "border-transparent bg-emerald-600/90 text-white shadow hover:bg-emerald-600",
                warning:
                    "border-transparent bg-amber-500/90 text-slate-900 shadow hover:bg-amber-500",
                outline: "text-slate-300 border-slate-600 hover:bg-slate-800",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
