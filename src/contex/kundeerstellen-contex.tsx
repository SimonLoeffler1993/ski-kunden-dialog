import { useState, createContext, useContext } from "react";
import { ErfasseSkiKunde } from "../types/skikundetypes";

type KundeErstellenContextProviderProps = {
    children: React.ReactNode;
}

type KundeErstellenContextType = {
    kunde: ErfasseSkiKunde | null;
    setKunde: React.Dispatch<React.SetStateAction<ErfasseSkiKunde | null>>;
    eingabe: boolean;
    setEingabe: React.Dispatch<React.SetStateAction<boolean>>
    updateKunde :boolean;
    setUpdateKunde: React.Dispatch<React.SetStateAction<boolean>>;
    skiKundeID: number | null;
    setSkiKundeID: React.Dispatch<React.SetStateAction<number | null>>;

}

const KundeErstellenContext = createContext<KundeErstellenContextType | null>(null);


export default function KundeErstellenContextProvider({ children }: KundeErstellenContextProviderProps) {
    const [kunde, setKunde] = useState<ErfasseSkiKunde | null>(null);
    const [eingabe, setEingabe] = useState(false);
    const [updateKunde, setUpdateKunde] = useState(false);
    const [skiKundeID, setSkiKundeID] = useState<number | null>(null);   

    // TODO PLZ mit useWatch überwachen
    return (
        <KundeErstellenContext.Provider value={{ kunde, setKunde, eingabe, setEingabe, updateKunde, setUpdateKunde, skiKundeID, setSkiKundeID }}>
            {children}
        </KundeErstellenContext.Provider>
    )
}

export function useKundeErstellen() {
    const context = useContext(KundeErstellenContext);
    if (!context) {
        throw new Error("useKundeErstellen must be used within a KundeErstellenProvider");
    }
    return context;
}