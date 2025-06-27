"use client"
import { useState } from "react";
import { Card, CardContent} from "@/components/ui/card";
import { Label} from "@/components/ui/label";
import KundePruefungDetailsChange from "./detailChange";
import { Pencil2Icon } from "@radix-ui/react-icons"
import { useKundeErstellen } from "../../../contex/kundeerstellen-contex";
import { ErfasseSkiKunde } from "../../../types/skikundetypes";


type KundePruefungDetailsProps = {
    wertBeschreibung: string
    canEditing?: boolean
    kundeKey: keyof ErfasseSkiKunde
}
export default function KundePruefungDetails({wertBeschreibung, canEditing=true, kundeKey }: KundePruefungDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const {kunde} = useKundeErstellen();

    function handleClick() {
        if (!canEditing) return
        setIsEditing(true);
    }

    return (
        <Card>
            <CardContent onClick={handleClick}>
                <Label htmlFor="detail">{wertBeschreibung}:</Label>
                {isEditing ? (
                    <KundePruefungDetailsChange kundeKey={kundeKey} toggleOff={setIsEditing} />
                ) : (
                    <div id="detail">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            {kunde[kundeKey]}

                            {canEditing && <span style={{ color: "black", cursor: "pointer" }}><Pencil2Icon /></span>}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


