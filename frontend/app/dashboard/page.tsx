'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, DollarSign, Music, TrendingUp, Users, PlayCircle, Wallet } from 'lucide-react';

// Mock data for overview
const stats = [
    {
        label: 'Total Royalties',
        value: '$12,450.00',
        icon: DollarSign,
        trend: '+12.5%',
        description: 'Earned this month'
    },
    {
        label: 'Active Listeners',
        value: '45.2K',
        icon: Users,
        trend: '+8.2%',
        description: 'Across all platforms'
    },
    {
        label: 'Total Streams',
        value: '1.2M',
        icon: PlayCircle,
        trend: '+24.3%',
        description: 'All time streams'
    },
    {
        label: 'Active Loans',
        value: '$2,500.00',
        icon: Wallet,
        trend: null,
        description: 'Current borrowed amount'
    }
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <Card key={idx}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                            {stat.trend && (
                                <div className="mt-2">
                                    <Badge variant={stat.trend.startsWith('+') ? 'default' : 'destructive'} className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-0">
                                        {stat.trend}
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity & Top Tracks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Top Performing Tracks</CardTitle>
                        <CardDescription>Your most streamed songs this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: "Lagos Nights", streams: "125K", revenue: "$450.20" },
                                { title: "African Giant", streams: "98K", revenue: "$320.50" },
                                { title: "Summer Vibes", streams: "85K", revenue: "$280.00" },
                            ].map((track, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium">{track.title}</div>
                                            <div className="text-xs text-muted-foreground">{track.streams} streams</div>
                                        </div>
                                    </div>
                                    <div className="font-mono font-medium text-emerald-500">
                                        {track.revenue}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest royalty payouts and loan activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { type: "Royalty Payout", date: "Today, 2:30 PM", amount: "+$1,250.00", status: "Completed" },
                                { type: "Loan Repayment", date: "Yesterday", amount: "-$350.00", status: "Completed" },
                                { type: "Spotify Revenue", date: "Oct 24, 2024", amount: "+$850.20", status: "Pending" },
                            ].map((tx, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.amount.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                            }`}>
                                            {tx.amount.startsWith('+') ? <TrendingUp className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{tx.type}</div>
                                            <div className="text-xs text-muted-foreground">{tx.date}</div>
                                        </div>
                                    </div>
                                    <div className={`text-sm font-medium ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-foreground'
                                        }`}>
                                        {tx.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
