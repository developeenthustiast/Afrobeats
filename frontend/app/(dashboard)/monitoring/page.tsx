import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, Database, Globe } from 'lucide-react';

const healthMetrics = [
    { name: 'API Gateway', status: 'healthy', latency: '45ms', icon: Globe },
    { name: 'Database', status: 'healthy', latency: '12ms', icon: Database },
    { name: 'JEPA Model', status: 'degraded', latency: '850ms', icon: Activity },
    { name: 'Blockchain Node', status: 'healthy', latency: '120ms', icon: Server },
];

export default function MonitoringPage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                        <CardDescription>Real-time component status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {healthMetrics.map((metric, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-md bg-slate-800">
                                        <metric.icon className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">{metric.name}</div>
                                        <div className="text-xs text-muted-foreground">{metric.latency}</div>
                                    </div>
                                </div>
                                <Badge variant={metric.status === 'healthy' ? 'success' : 'warning'}>
                                    {metric.status}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Model Performance</CardTitle>
                        <CardDescription>JEPA prediction accuracy metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Accuracy</span>
                                <span className="font-mono font-bold text-emerald-400">94.2%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Loss</span>
                                <span className="font-mono text-slate-200">0.045</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Training Epochs</span>
                                <span className="font-mono text-slate-200">1,250</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
