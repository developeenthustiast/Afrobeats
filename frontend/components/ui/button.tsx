import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button Component - WCAG 2.2 AA Compliant
 * 
 * Accessibility Features:
 * - Minimum 24x24px touch target (2.5.8 Target Size Minimum)
 * - Enhanced focus indicators (2.4.13 Focus Appearance)
 * - Keyboard navigation support
 * - Screen reader compatible
 * - Disabled state properly communicated
 */

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-indigo-600 text-white shadow-md hover:bg-indigo-500 active:scale-95",
                destructive:
                    "bg-rose-600 text-white shadow-sm hover:bg-rose-500",
                outline:
                    "border-2 border-slate-700 bg-transparent hover:bg-slate-800 hover:border-slate-600",
                secondary:
                    "bg-slate-700 text-slate-100 shadow-sm hover:bg-slate-600",
                ghost: "hover:bg-slate-800 hover:text-slate-100",
                link: "text-indigo-400 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2 min-h-[2.5rem] min-w-[2.5rem]", // 40px minimum (ideal touch target)
                sm: "h-9 rounded-md px-3 min-h-[2.25rem] min-w-[2.25rem]", // 36px
                lg: "h-11 rounded-lg px-8 min-h-[2.75rem]", // 44px (iOS ideal)
                icon: "h-10 w10 min-h-[2.5rem] min-w-[2.5rem]", // Square, 40px minimum
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
