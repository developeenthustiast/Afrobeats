import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Zap } from 'lucide-react';

export default function AnalysisPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Deep Risk Analysis</CardTitle>
                    <CardDescription>Submit targeted contexts for the tri-agent pipeline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="proposal-id">Proposal ID (Optional)</Label>
                            <Input id="proposal-id" placeholder="PROP-123" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="context">Analysis Context</Label>
                            <Input id="context" placeholder="Debt ceiling increase proposal" />
                        </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">
                        <Zap className="mr-2 h-4 w-4" />
                        Run Deep Analysis
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">JEPA Model</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            Predictive modeling engine ready.
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Strategist</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            Risk reasoning module active.
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Auditor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            Compliance checks passing.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
