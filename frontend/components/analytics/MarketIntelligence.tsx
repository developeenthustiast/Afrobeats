/**
 * Market Intelligence Component
 * 
 * Provides genre trends, collaboration opportunities,
 * and optimal release timing recommendations.
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Lightbulb, Calendar, Users2 } from 'lucide-react';

const genreTrends = [
    { genre: 'Afrobeats', growth: 45, color: '#3b82f6' },
    { genre: 'Afropop', growth: 38, color: '#8b5cf6' },
    { genre: 'Afrofusion', growth: 32, color: '#10b981' },
    { genre: 'Amapiano', growth: 28, color: '#f59e0b' },
    { genre: 'Alte', growth: 22, color: '#ec4899' },
];

const collaborationOpportunities = [
    {
        artist: 'Rising Star A',
        genre: 'Afrobeats',
        growth: '125%',
        compatibility: 92,
    },
    {
        artist: 'Emerging Artist B',
        genre: 'Afropop',
        growth: '98%',
        compatibility: 88,
    },
    {
        artist: 'New Talent C',
        genre: 'Amapiano',
        growth: '87%',
        compatibility: 85,
    },
];

const optimalReleaseData = [
    { day: 'Monday', score: 65 },
    { day: 'Tuesday', score: 72 },
    { day: 'Wednesday', score: 78 },
    { day: 'Thursday', score: 95 },
    { day: 'Friday', score: 88 },
    { day: 'Saturday', score: 70 },
    { day: 'Sunday', score: 68 },
];

interface MarketIntelligenceProps {
    address: `0x${string}` | undefined;
}

export function MarketIntelligence({ address }: MarketIntelligenceProps) {
    return (
        <div className="space-y-6">
            {/* Genre Trends */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Genre Trends (Last 30 Days)
                    </CardTitle>
                    <CardDescription>
                        Growth rates across Afrobeats sub-genres
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={genreTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="genre" />
                            <YAxis label={{ value: 'Growth %', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Growth']} />
                            <Bar dataKey="growth">
                                {genreTrends.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900">
                                <strong>Insight:</strong> Afrobeats is trending 45% higher than last month.
                                Consider releasing tracks in this genre to maximize reach.
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Collaboration Opportunities */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users2 className="w-5 h-5" />
                        Collaboration Opportunities
                    </CardTitle>
                    <CardDescription>
                        Rising artists with high compatibility scores
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {collaborationOpportunities.map((collab, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {collab.artist.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium">{collab.artist}</div>
                                        <div className="text-sm text-gray-600">
                                            {collab.genre} • {collab.growth} growth
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600">
                                            {collab.compatibility}%
                                        </div>
                                        <div className="text-xs text-gray-500">Compatibility</div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700">
                                        High Match
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-purple-900">
                                <strong>Recommendation:</strong> "Rising Star A" has 92% compatibility with your style
                                and is experiencing rapid growth in Nigerian markets.
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Optimal Release Timing */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Optimal Release Timing
                    </CardTitle>
                    <CardDescription>
                        Best days to release for maximum engagement
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={optimalReleaseData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis label={{ value: 'Engagement Score', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value) => [`${value}/100`, 'Score']} />
                            <Bar dataKey="score" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-sm font-medium text-green-900 mb-1">Best Day</div>
                            <div className="text-2xl font-bold text-green-600">Thursday</div>
                            <div className="text-xs text-green-700 mt-1">12:00 PM WAT recommended</div>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-sm font-medium text-orange-900 mb-1">Avoid</div>
                            <div className="text-2xl font-bold text-orange-600">Monday</div>
                            <div className="text-xs text-orange-700 mt-1">Lowest engagement historically</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
