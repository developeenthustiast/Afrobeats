import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Wallet, ArrowRight } from 'lucide-react';

export default function LendingPage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Loan Request Form */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Request Liquidity</CardTitle>
                        <CardDescription>Borrow against your future royalty streams</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Select NFT Collateral</Label>
                            <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded bg-indigo-500/20 flex items-center justify-center">
                                        <Wallet className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium">AfroBeats Vol. 1</div>
                                        <div className="text-sm text-muted-foreground">Token ID: #4829</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Loan Amount</Label>
                                <span className="text-sm font-mono text-emerald-400">15,000 USDC</span>
                            </div>
                            <Slider defaultValue={[50]} max={100} step={1} />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Min: 1,000 USDC</span>
                                <span>Max: 30,000 USDC</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Duration</Label>
                                <Input value="12 Months" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label>Interest Rate</Label>
                                <Input value="4.5% APR" readOnly />
                            </div>
                        </div>

                        <Button className="w-full" size="lg">
                            Approve & Request Loan
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Loan Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Health Factor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-400">1.85</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Liquidation at &lt; 1.0
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Total Borrowed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-100">45k</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                USDC
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
