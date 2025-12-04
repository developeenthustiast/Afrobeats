/**
 * Loan Request Form Component
 * 
 * Allows artists to request loans against their IP-NFTs
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useLoanCalculator } from '@/lib/hooks/useLending';
import { useUserNFTs } from '@/lib/hooks/useLending';

const DURATIONS = [
    { label: '30 Days', value: 30 * 24 * 60 * 60 },
    { label: '90 Days', value: 90 * 24 * 60 * 60 },
    { label: '180 Days', value: 180 * 24 * 60 * 60 },
];

export function LoanRequestForm() {
    const { address } = useAccount();
    const [selectedNFT, setSelectedNFT] = useState<string>('');
    const [loanAmount, setLoanAmount] = useState(100);
    const [duration, setDuration] = useState(DURATIONS[2].value); // Default 180 days

    // Fetch user's IP-NFTs
    const { nfts, isLoading: nftsLoading } = useUserNFTs(address);

    // Calculate loan terms
    const {
        maxBorrowable,
        interestRate,
        totalRepayment,
        monthlyPayment,
        healthFactor,
        isLoading: calculatorLoading
    } = useLoanCalculator(selectedNFT, loanAmount, duration);

    // Contract interaction
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const handleRequestLoan = async () => {
        if (!selectedNFT || !loanAmount) return;

        try {
            await writeContract({
                address: process.env.NEXT_PUBLIC_LOAN_MANAGER_ADDRESS as `0x${string}`,
                abi: loanManagerABI,
                functionName: 'requestLoan',
                args: [
                    BigInt(selectedNFT),
                    parseUnits(loanAmount.toString(), 6), // USDT/USDC has 6 decimals
                    BigInt(duration)
                ],
            });
        } catch (error) {
            console.error('Loan request error:', error);
        }
    };

    const isFormValid = selectedNFT && loanAmount > 0 && loanAmount <= maxBorrowable;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Request Loan</CardTitle>
                <CardDescription>
                    Borrow against your IP-NFT's future royalty earnings
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* NFT Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Select IP-NFT Collateral
                    </label>
                    <Select value={selectedNFT} onValueChange={setSelectedNFT}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose an IP-NFT" />
                        </SelectTrigger>
                        <SelectContent>
                            {nftsLoading ? (
                                <SelectItem value="loading" disabled>Loading...</SelectItem>
                            ) : nfts && nfts.length > 0 ? (
                                nfts.map((nft) => (
                                    <SelectItem key={nft.tokenId} value={nft.tokenId.toString()}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{nft.title}</span>
                                            <span className="text-xs text-gray-500">
                                                #{nft.tokenId}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="none" disabled>
                                    No IP-NFTs found
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Loan Amount Slider */}
                {selectedNFT && (
                    <>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium">
                                    Loan Amount
                                </label>
                                <span className="text-sm text-gray-600">
                                    Max: ${maxBorrowable.toLocaleString()}
                                </span>
                            </div>

                            <Slider
                                value={[loanAmount]}
                                onValueChange={([value]) => setLoanAmount(value)}
                                max={maxBorrowable}
                                min={100}
                                step={50}
                                className="mb-2"
                            />

                            <div className="text-center">
                                <span className="text-3xl font-bold">${loanAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Duration Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Loan Duration
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {DURATIONS.map((d) => (
                                    <button
                                        key={d.value}
                                        onClick={() => setDuration(d.value)}
                                        className={`
                      px-4 py-3 rounded-lg border-2 transition-all
                      ${duration === d.value
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                    `}
                                    >
                                        <div className="text-sm font-medium">{d.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Loan Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <h3 className="font-medium text-sm">Loan Summary</h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Interest Rate
                                    </span>
                                    <span className="font-medium">{interestRate}% APR</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Total Repayment
                                    </span>
                                    <span className="font-medium">${totalRepayment.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Est. Monthly
                                    </span>
                                    <span className="font-medium">${monthlyPayment.toLocaleString()}</span>
                                </div>

                                <div className="pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Health Factor</span>
                                        <span className={`font-medium ${healthFactor >= 1.2 ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {healthFactor.toFixed(2)}x
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${healthFactor >= 1.2 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                            style={{ width: `${Math.min(healthFactor * 50, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Warnings */}
                        {healthFactor < 1.2 && healthFactor > 0 && (
                            <Alert>
                                <AlertDescription>
                                    ⚠️ Health factor is below recommended level. Consider reducing loan amount.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Submit Button */}
                        <Button
                            onClick={handleRequestLoan}
                            disabled={!isFormValid || isPending || isConfirming}
                            className="w-full"
                            size="lg"
                        >
                            {isPending || isConfirming ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : isSuccess ? (
                                'Loan Requested! ✓'
                            ) : (
                                'Request Loan'
                            )}
                        </Button>

                        {isSuccess && (
                            <Alert className="bg-green-50 border-green-200">
                                <AlertDescription className="text-green-800">
                                    ✅ Loan request submitted successfully! Funds will be sent to your Token Bound Account.
                                </AlertDescription>
                            </Alert>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}

// Mock ABI (replace with actual ABI)
const loanManagerABI = [] as const;
