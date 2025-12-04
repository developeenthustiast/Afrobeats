'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Music, Play, MoreVertical } from 'lucide-react';

export default function MusicPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Music</h2>
                    <p className="text-muted-foreground">Manage your registered tracks and IP assets</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Register New Track
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search tracks..."
                        className="pl-8 w-full md:w-[300px]"
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tracks</CardTitle>
                    <CardDescription>A list of your registered musical assets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { title: "Lagos Nights", artist: "Davido", date: "Oct 24, 2024", status: "Active", streams: "125K" },
                            { title: "African Giant", artist: "Burna Boy", date: "Sep 12, 2024", status: "Active", streams: "98K" },
                            { title: "Summer Vibes", artist: "Wizkid", date: "Aug 05, 2024", status: "Active", streams: "85K" },
                            { title: "Love Nwantiti", artist: "CKay", date: "Jul 15, 2024", status: "Active", streams: "2.5M" },
                        ].map((track, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Music className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{track.title}</div>
                                        <div className="text-sm text-muted-foreground">{track.artist} • Added {track.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <div className="text-sm font-medium">{track.streams}</div>
                                        <div className="text-xs text-muted-foreground">Total Streams</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Play className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
