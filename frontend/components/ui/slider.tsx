import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

/**
 * Slider Component - WCAG 2.2 AA Compliant
 * 
 * Accessibility Features:
 * - Keyboard navigation (Arrow keys, Page Up/Down, Home, End)
 * - ARIA attributes (aria-valuemin, aria-valuemax, aria-valuenow)
 * - Minimum 24px touch target for thumb (WCAG 2.5.8)
 * - Visual focus indicators
 */

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
        )}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-800">
            <SliderPrimitive.Range className="absolute h-full bg-indigo-600" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-indigo-600 bg-slate-100 ring-offset-slate-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[1.5rem] min-w-[1.5rem]" />
    </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
