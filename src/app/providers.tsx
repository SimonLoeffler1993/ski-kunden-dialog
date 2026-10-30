"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import KundeErstellenContextProvider from "@/contex/kundeerstellen-contex";
import TerminalVerbindungProvider from "@/contex/terminalverbindung-contex";

type ProvidersProps = {
    // Adresse der API für die Terminal-Verbindung, kommt zur Laufzeit vom Server
    backendUrl: string;
    children: React.ReactNode;
};

export function Providers({ backendUrl, children }: ProvidersProps) {
    // Ein QueryClient je Browser-Sitzung
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: { staleTime: 60 * 1000, retry: 1 },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {/* Auf allen Seiten, damit ein gesendeter Kunde jederzeit ankommt */}
            <KundeErstellenContextProvider>
                <TerminalVerbindungProvider backendUrl={backendUrl}>
                    {children}
                </TerminalVerbindungProvider>
            </KundeErstellenContextProvider>
        </QueryClientProvider>
    );
}
