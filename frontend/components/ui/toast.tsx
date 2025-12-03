import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Toast Component  
 * 
 * Note: For full toast functionality with queue management,
 * use Sonner library (npm install sonner)
 * This is a base component for custom toasts
 */

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'error' | 'warning'
    onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
    ({ className, variant = 'default', onClose, children, ...props }, ref) => {
        const variants = {
            default: 'bg-slate-900 border-slate-700 text-slate-100',
            success: 'bg-emerald-600/10 border-emerald-500/40 text-emerald-200',
            error: 'bg-rose-600/10 border-rose-500/40 text-rose-200',
            warning: 'bg-amber-500/10 border-amber-500/40 text-amber-200',
        }

        return (
            <div
                ref={ref}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={cn(
                    "pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-lg border p-4 shadow-xl backdrop-blur-sm",
                    variants[variant],
                    className
                )}
                {...props}
            >
                <div className="flex-1 text-sm">{children}</div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-xs uppercase tracking-wide opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1 min-h-[1.5rem]"
                        aria-label="Close notification"
                    >
                        Close
                    </button>
                )}
            </div>
        )
    }
)
Toast.displayName = "Toast"

export { Toast }
