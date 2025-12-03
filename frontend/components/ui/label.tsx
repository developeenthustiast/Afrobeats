import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Label Component - WCAG 2.2 AA Compliant
 * 
 * Accessibility Features:
 * - Uses Radix UI Label primitive for proper form associations
 * - Supports htmlFor attribute for input linking
 * - Peer disabled state styling
 * - Required indicator support
 */

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & {
        required?: boolean
    }
>(({ className, required, children, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants(), "text-slate-200", className)}
        {...props}
    >
        {children}
        {required && (
            <span className="text-rose-500 ml-1" aria-label="required">
                *
            </span>
        )}
    </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
