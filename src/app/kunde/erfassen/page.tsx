"use client";

import KundeEingabe from "@/components/kunde/erfassen/eingabe";
import Statusanzeige from "@/components/kunde/statusanzeige";

export default function Erfassen() {


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Statusanzeige />
            <KundeEingabe />
        </div>
    );
}
