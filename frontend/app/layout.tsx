import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

// Optimize fonts with next/font (self-hosted, no FOIT)
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
    display: 'swap',
})

export const metadata = {
    title: 'AfroBeats Protocol | Royalty Management & IPFi',
    description: 'Enterprise-grade royalty management and IPFi lending for African artists',
}

import { ThemeProvider } from "@/components/theme-provider"

// ... imports

import { CampProvider } from "@/components/providers/camp-provider"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={cn(inter.variable, spaceGrotesk.variable)} suppressHydrationWarning>
            <body className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-indigo-500/30">


                <CampProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </CampProvider>
            </body>
        </html>
    )
}
