import { Activity, TrendingUp, Shield, CheckCircle, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mock data for overview
const stats = [
    {
        label: 'Current Liquidity',
        value: '$9.5M',
        icon: TrendingUp,
        trend: '+2.3%',
        description: 'Depth across monitored venues'
    },
    {
        label: 'Predicted Risk',
        value: 'SAFE',
        icon: Shield,
        trend: null,
        description: 'JEPA risk posture'
    },
    {
        label: 'Volatility Index',
        value: '0.52',
        icon: Activity,
        trend: '-5.2%',
        description: '24h realized volatility'
    },
    {
        label: 'Confidence',
        value: '87%',
        icon: CheckCircle,
        trend: null,
        description: 'JEPA certainty score'
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
                                    <Badge variant={stat.trend.startsWith('+') ? 'success' : 'warning'}>
                                        {stat.trend}
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Analysis Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Quick Risk Analysis</CardTitle>
                            <CardDescription>Run JEPA-based assessments on the latest liquidity snapshot</CardDescription>
                        </div>
                        <Button>
                            <Zap className="mr-2 h-4 w-4" />
                            Run Analysis
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Current State</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                    <span className="text-slate-300">Liquidity Depth</span>
                                    <span className="font-mono text-emerald-400">$9.50M</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                    <span className="text-slate-300">Volatility</span>
                                    <span className="font-mono text-amber-400">0.523</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">JEPA Prediction</h3>
                            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield className="w-8 h-8 text-emerald-500" />
                                    <div>
                                        <div className="text-2xl font-bold text-emerald-500">SAFE</div>
                                        <div className="text-sm text-slate-400">Risk Level</div>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-300">
                                    Market conditions stable. Volatility within expected range.
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
