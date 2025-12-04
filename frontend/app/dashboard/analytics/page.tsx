'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Globe, Users, PlayCircle } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">Detailed insights into your music performance and revenue</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.2M</div>
                        <p className="text-xs text-muted-foreground">+24.3% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue per Stream</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.0042</div>
                        <p className="text-xs text-muted-foreground">+0.0002 avg</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Global Reach</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42 Countries</div>
                        <p className="text-xs text-muted-foreground">Top: Nigeria, UK, USA</p>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Sources</CardTitle>
                        <CardDescription>Breakdown by platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { platform: "Spotify", amount: "$5,240.50", percentage: "45%" },
                                { platform: "Apple Music", amount: "$3,850.20", percentage: "32%" },
                                { platform: "YouTube Music", amount: "$1,450.00", percentage: "12%" },
                                { platform: "Other", amount: "$1,909.30", percentage: "11%" },
                            ].map((source, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span className="font-medium">{source.platform}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground">{source.amount}</span>
                                        <span className="text-sm font-bold w-12 text-right">{source.percentage}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Listener Demographics</CardTitle>
                        <CardDescription>Audience insights</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Age 18-24</span>
                                <div className="w-2/3 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[45%]" />
                                </div>
                                <span className="text-sm text-muted-foreground">45%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Age 25-34</span>
                                <div className="w-2/3 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[35%]" />
                                </div>
                                <span className="text-sm text-muted-foreground">35%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Age 35-44</span>
                                <div className="w-2/3 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[15%]" />
                                </div>
                                <span className="text-sm text-muted-foreground">15%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Age 45+</span>
                                <div className="w-2/3 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[5%]" />
                                </div>
                                <span className="text-sm text-muted-foreground">5%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
