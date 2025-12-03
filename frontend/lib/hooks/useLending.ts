/**
 * Custom hooks for lending functionality
 */

import { useReadContract, useReadContracts } from 'wagmi';
import { useState, useEffect } from 'react';

/**
 * Hook to calculate loan terms based on NFT collateral
 */
export function useLoanCalculator(
    tokenId: string,
    requestedAmount: number,
    duration: number
) {
    const [calculations, setCalculations] = useState({
        maxBorrowable: 0,
        interestRate: 0,
        totalRepayment: 0,
        monthlyPayment: 0,
        healthFactor: 0,
        isLoading: true,
    });

    // Fetch projected earnings from oracle
    const { data: prediction, isLoading: predictionLoading } = useReadContract({
        address: process.env.NEXT_PUBLIC_ROYALTY_ORACLE_ADDRESS as `0x${string}`,
        abi: royaltyOracleABI,
        functionName: 'predictEarnings',
        args: [BigInt(tokenId || 0), BigInt(duration)],
        query: {
            enabled: !!tokenId,
        },
    });

    // Fetch current borrow rate from pool
    const { data: borrowRate, isLoading: rateLoading } = useReadContract({
        address: process.env.NEXT_PUBLIC_LENDING_POOL_ADDRESS as `0x${string}`,
        abi: lendingPoolABI,
        functionName: 'getBorrowRate',
    });

    useEffect(() => {
        if (!prediction || !borrowRate || !tokenId) {
            setCalculations(prev => ({ ...prev, isLoading: predictionLoading || rateLoading }));
            return;
        }

        const [projectedEarnings, confidence] = prediction as [bigint, bigint];
        const projectedUSD = Number(projectedEarnings) / 1e6; // Convert from 6 decimals

        // Calculate max borrowable (70% LTV)
        const maxBorrowable = projectedUSD * 0.7;

        // Interest rate in APR (from basis points)
        const interestRate = Number(borrowRate) / 100; // Convert from basis points

        // Calculate total repayment (simple interest)
        const durationYears = duration / (365 * 24 * 60 * 60);
        const interest = requestedAmount * (interestRate / 100) * durationYears;
        const totalRepayment = requestedAmount + interest;

        // Monthly payment (rough estimate)
        const monthlyPayment = totalRepayment / (durationYears * 12);

        // Health factor = (projected * LTV) / requested
        const healthFactor = requestedAmount > 0 ? (maxBorrowable / requestedAmount) : 0;

        setCalculations({
            maxBorrowable,
            interestRate,
            totalRepayment,
            monthlyPayment,
            healthFactor,
            isLoading: false,
        });
    }, [prediction, borrowRate, tokenId, requestedAmount, duration, predictionLoading, rateLoading]);

    return calculations;
}

/**
 * Hook to fetch user's active loans
 */
export function useActiveLoans(address: `0x${string}` | undefined) {
    const { data, isLoading, refetch } = useReadContract({
        address: process.env.NEXT_PUBLIC_LOAN_MANAGER_ADDRESS as `0x${string}`,
        abi: loanManagerABI,
        functionName: 'getBorrowerLoans',
        args: [address || '0x0'],
        query: {
            enabled: !!address,
        },
    });

    // Transform loan IDs to full loan data
    const loanIds = (data as bigint[] | undefined) || [];

    const { data: loansData } = useReadContracts({
        contracts: loanIds.map((loanId) => ({
            address: process.env.NEXT_PUBLIC_LOAN_MANAGER_ADDRESS as `0x${string}`,
            abi: loanManagerABI,
            functionName: 'loans',
            args: [loanId],
        })),
        query: {
            enabled: loanIds.length > 0,
        },
    });

    const loans = loansData?.map((result, index) => {
        if (!result.result) return null;

        const loan = result.result as any;

        return {
            loanId: loanIds[index].toString(),
            borrower: loan.borrower,
            tokenId: loan.tokenId.toString(),
            principal: Number(loan.principal) / 1e6,
            totalRepayment: Number(loan.totalRepayment) / 1e6,
            repaidAmount: Number(loan.repaidAmount) / 1e6,
            healthFactor: Number(loan.healthFactor) / 10000,
            startTime: Number(loan.startTime),
            duration: Number(loan.duration),
            status: ['Pending', 'Active', 'Repaid', 'Liquidated', 'Defaulted'][loan.status],
            songTitle: `Song #${loan.tokenId}`, // Would fetch from IP Registry
        };
    }).filter(Boolean);

    return {
        loans,
        isLoading,
        refetch,
    };
}

/**
 * Hook to fetch user's IP-NFTs
 */
export function useUserNFTs(address: `0x${string}` | undefined) {
    // In production, would query events or maintain indexer
    // For demo, returning mock data
    const [nfts, setNFTs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!address) {
            setNFTs([]);
            setIsLoading(false);
            return;
        }

        // Mock NFT data
        setTimeout(() => {
            setNFTs([
                { tokenId: 0, title: 'Lagos Nights', artist: 'TestArtist1' },
                { tokenId: 1, title: 'Jollof Dreams', artist: 'TestArtist2' },
                { tokenId: 2, title: 'Okada Ride', artist: 'TestArtist1' },
            ]);
            setIsLoading(false);
        }, 500);
    }, [address]);

    return { nfts, isLoading };
}

// Mock ABIs (replace with actual ABIs from contract artifacts)
const royaltyOracleABI = [] as const;
const lendingPoolABI = [] as const;
const loanManagerABI = [] as const;
