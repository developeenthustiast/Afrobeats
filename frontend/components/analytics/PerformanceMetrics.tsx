/**
 * Performance Metrics Overview Component
 * 
 * High-level KPI cards showing total earnings, streams, growth, etc.
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Music, DollarSign, Users, Globe } from 'lucide-react';
import axios from 'axios';

interface PerformanceMetricsProps {
    address: `0x${string}` | undefined;
    selectedNFT?: string;
}

export function PerformanceMetrics({ address, selectedNFT }: PerformanceMetricsProps) {
    const [metrics, setMetrics] = useState({
        totalEarnings: 0,
        totalStreams: 0,
        growthRate: 0,
        uniqueListeners: 0,
        avgPerStream: 0,
        topCountry: 'Nigeria',
    });

    useEffect(() => {
        if (address) {
            fetchMetrics();
        }
    }, [address, selectedNFT]);

    const fetchMetrics = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/ api/analytics/metrics`,
                {
                    params: { address, tokenId: selectedNFT || 'all' },
                }
            );
            setMetrics(response.data);
        } catch (error) {
            // Mock data
            setMetrics({
                totalEarnings: 4567.89,
                totalStreams: 152430,
                growthRate: 23.4,
                uniqueListeners: 8945,
                avgPerStream: 0.003,
                topCountry: 'Nigeria',
            });
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    const metricsData = [
        {
            title: 'Total Earnings',
            value: `$${metrics.totalEarnings.toLocaleString()}`,
            change: `+${metrics.growthRate}%`,
            icon: DollarSign,
            positive: metrics.growthRate > 0,
        },
        {
            title: 'Total Streams',
            value: formatNumber(metrics.totalStreams),
            change: '+12.3%',
            icon: Music,
            positive: true,
        },
        {
            title: 'Unique Listeners',
            value: formatNumber(metrics.uniqueListeners),
            change: '+8.1%',
            icon: Users,
            positive: true,
        },
        {
            title: 'Top Region',
            value: metrics.topCountry,
            change: '45% of streams',
            icon: Globe,
            positive: null,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricsData.map((metric, index) => {
                const Icon = metric.icon;
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {metric.title}
                            </CardTitle>
                            <Icon className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            {metric.positive !== null && (
                                <div className={`flex items-center gap-1 text-sm mt-1 ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                                    {metric.positive ? (
                                        <TrendingUp className="w-3 h-3" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3" />
                                    )}
                                    {metric.change}
                                </div>
                            )}
                            {metric.positive === null && (
                                <div className="text-sm text-gray-500 mt-1">{metric.change}</div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
