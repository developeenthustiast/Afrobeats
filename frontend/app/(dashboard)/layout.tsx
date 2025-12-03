import Link from 'next/link';
import { LayoutDashboard, BarChart3, Wallet, Activity, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Lending', href: '/lending', icon: Wallet },
    { name: 'Monitoring', href: '/monitoring', icon: Activity },
];

import { ModeToggle } from '@/components/mode-toggle';
import { usePersonalization } from '@/hooks/use-personalization';
import { Badge } from '@/components/ui/badge';

// ... imports

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { persona, isLoading } = usePersonalization();

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar ... */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Activity className="h-6 w-6" />
                        <span>SenseForge</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:pl-64 min-h-screen">
                <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                        {!isLoading && persona !== 'unknown' && (
                            <Badge variant="secondary" className="animate-in fade-in zoom-in">
                                {persona.charAt(0).toUpperCase() + persona.slice(1)} View
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50" />
                    </div>
                </header>
                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
