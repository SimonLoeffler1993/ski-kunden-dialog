"use client"
import KundeErstellenContextProvider from "../../contex/kundeerstellen-contex";

export default function KundenLayout({ children }: { children: React.ReactNode }) {
    return (
        <KundeErstellenContextProvider>
            {children}
        </KundeErstellenContextProvider>
    );
}