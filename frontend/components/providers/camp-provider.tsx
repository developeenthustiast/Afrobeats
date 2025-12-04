'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CampProvider as OriginCampProvider } from '@campnetwork/origin/react';
import { CAMP_CONFIG } from '@/lib/camp/config';

export function CampProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <OriginCampProvider
                clientId={CAMP_CONFIG.clientId}
                redirectUri={CAMP_CONFIG.redirectUri}
            >
                {children}
            </OriginCampProvider>
        </QueryClientProvider>
    );
}
