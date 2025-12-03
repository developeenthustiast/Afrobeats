/**
 * Active Loans Component
 * 
 * Displays user's active loans with health factors and repayment options
 */

'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlertTriangle, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useActiveLoans } from '@/lib/hooks/useActiveLoans';
import { formatCurrency } from '@/lib/utils';

export function ActiveLoans() {
    const { address } = useAccount();
    const { loans, isLoading, refetch } = useActiveLoans(address);
    const [repayDialogOpen, setRepayDialogOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<any>(null);
    const [repayAmount, setRepayAmount] = useState('');

    const getHealthColor = (health: number) => {
        if (health >= 1.2) return 'text-green-600 bg-green-50';
        if (health >= 1.0) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string; className: string }> = {
            active: { label: 'Active', className: 'bg-blue-100 text-blue-700' },
            pending: { label: 'Pending', className: 'bg-gray-100 text-gray-700' },
            repaid: { label: 'Repaid', className: 'bg-green-100 text-green-700' },
            liquidated: { label: 'Liquidated', className: 'bg-red-100 text-red-700' },
        };

        const variant = variants[status.toLowerCase()] || variants.active;

        return (
            <Badge className={variant.className}>
                {variant.label}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Active Loans</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!loans || loans.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Active Loans</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <p className="text-gray-500">No active loans</p>
                        <p className="text-sm text-gray-400 mt-2">
                            Request a loan above to get started
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Loans ({loans.length})</CardTitle>
            </CardHeader>

            <CardContent>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Song</TableHead>
                                <TableHead>Principal</TableHead>
                                <TableHead>Repaid</TableHead>
                                <TableHead>Health</TableHead>
                                <TableHead>Time Left</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loans.map((loan) => {
                                const repaidPercent = (loan.repaidAmount / loan.totalRepayment) * 100;
                                const daysLeft = Math.max(0, Math.floor(
                                    (loan.startTime + loan.duration - Date.now() / 1000) / 86400
                                ));

                                return (
                                    <TableRow key={loan.loanId}>
                                        <TableCell className="font-medium">
                                            <div>
                                                <div>{loan.songTitle}</div>
                                                <div className="text-xs text-gray-500">#{loan.tokenId}</div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{formatCurrency(loan.principal)}</div>
                                                <div className="text-xs text-gray-500">
                                                    Total: {formatCurrency(loan.totalRepayment)}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm">{formatCurrency(loan.repaidAmount)}</div>
                                                <Progress value={repaidPercent} className="h-1.5" />
                                                <div className="text-xs text-gray-500">{repaidPercent.toFixed(0)}%</div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className={`inline-flex items-center px-2.5 py-1 rounded-md font-medium ${getHealthColor(loan.healthFactor)}`}>
                                                {loan.healthFactor < 1.0 && (
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                )}
                                                {loan.healthFactor.toFixed(2)}x
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {daysLeft} days
                                            </div>
                                        </TableCell>

                                        <TableCell>{getStatusBadge(loan.status)}</TableCell>

                                        <TableCell className="text-right">
                                            <Dialog open={repayDialogOpen} onOpenChange={setRepayDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setSelectedLoan(loan)}
                                                    >
                                                        Repay
                                                    </Button>
                                                </DialogTrigger>

                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Repay Loan</DialogTitle>
                                                    </DialogHeader>

                                                    <div className="space-y-4">
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <div className="text-sm text-gray-600 mb-1">Outstanding Debt</div>
                                                            <div className="text-2xl font-bold">
                                                                {formatCurrency(selectedLoan?.totalRepayment - selectedLoan?.repaidAmount || 0)}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">
                                                                Repayment Amount (USDT)
                                                            </label>
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={repayAmount}
                                                                onChange={(e) => setRepayAmount(e.target.value)}
                                                            />
                                                            <div className="mt-2 flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setRepayAmount(((selectedLoan?.totalRepayment - selectedLoan?.repaidAmount) / 4).toString())}
                                                                >
                                                                    25%
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setRepayAmount(((selectedLoan?.totalRepayment - selectedLoan?.repaidAmount) / 2).toString())}
                                                                >
                                                                    50%
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setRepayAmount((selectedLoan?.totalRepayment - selectedLoan?.repaidAmount).toString())}
                                                                >
                                                                    Full
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <Button className="w-full" size="lg">
                                                            Confirm Repayment
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {loans.map((loan) => (
                        <Card key={loan.loanId}>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">{loan.songTitle}</div>
                                        <div className="text-xs text-gray-500">Loan #{loan.loanId}</div>
                                    </div>
                                    {getStatusBadge(loan.status)}
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <div className="text-gray-500 text-xs">Principal</div>
                                        <div className="font-medium">{formatCurrency(loan.principal)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs">Health Factor</div>
                                        <div className={`font-medium ${loan.healthFactor >= 1.2 ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {loan.healthFactor.toFixed(2)}x
                                        </div>
                                    </div>
                                </div>

                                <Progress value={(loan.repaidAmount / loan.totalRepayment) * 100} />

                                <Button size="sm" className="w-full">Repay</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
