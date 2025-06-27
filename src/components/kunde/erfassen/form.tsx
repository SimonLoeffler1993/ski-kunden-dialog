"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";



import { erfasseKundeSchema, ErfasseSkiKunde } from "../../../types/skikundetypes";
import { useKundeErstellen } from "../../../contex/kundeerstellen-contex";






// Use
// https://www.youtube.com/watch?v=bKm1rNaCFOo

// Design anpassen
// https://www.youtube.com/watch?v=jHzdo1Bm9Lk

// useractionstate
// https://www.youtube.com/watch?v=GgyP0_b-WPY

export default function KundeErfassungForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        reset,
    } = useForm<ErfasseSkiKunde>({
        resolver: zodResolver(erfasseKundeSchema),
    });
    // Custom Hook importieren
    const { kunde, setKunde} = useKundeErstellen();
    const router = useRouter();

    // Postleitzahl überwachen
    const formPlz = useWatch({
        control,
        name: "Plz",
    });

    useEffect(() => {
        const controler = new AbortController();
        // todo ausgabe bei einer Falschen PLZ
        const fetchOrte = async () => {
            const response = await fetch(`/api/kunde/ort?plz=${formPlz}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            if (data.length == 1) {
                setValue("Ort", data[0].Ort);
            }
        };

        if (formPlz && formPlz.length === 5) {
            fetchOrte();
        }

        return () => {
            controler.abort();
        };

    }, [formPlz, setValue]);

    // TODO Wen Kunde von SSE kommt die Plz mit setzten

    useEffect(() => {
    if (kunde) {
        console.log("Kunde wird getriggert");
        console.log(kunde);
        if (kunde.Vorname || kunde.Nachname) {
            reset(kunde)
        }
    }
    }, [kunde, reset]);

    function onSubmit(values: ErfasseSkiKunde) {
        console.log(values);
        setKunde(values);
        // Weiterleitung auf die Prüfung
        router.push("erfassen/pruefen");
        
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="Vorname">Vorname</Label>
                        <Input id="Vorname" {...register("Vorname")} />
                        {errors?.Vorname && <p className="text-red-500 text-sm">{errors.Vorname.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="Nachname">Nachname</Label>
                        <Input id="Nachname" {...register("Nachname")} />
                        {errors.Nachname && <p className="text-red-500 text-sm">{errors.Nachname.message}</p>}
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="Strasse">Straße</Label>
                        <Input id="Strasse" {...register("Strasse")} />
                        {errors.Strasse && <p className="text-red-500 text-sm">{errors.Strasse.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="Plz">PLZ</Label>
                        <Input id="Plz" type="number" {...register("Plz")} />
                        {errors.Plz && <p className="text-red-500 text-sm">{errors.Plz.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="Ort">Ort</Label>
                        <Input id="Ort" {...register("Ort")} disabled />
                        <p className="text-gray-400 text-xs">wird von der PLZ abgeleitet</p>
                        {errors.Ort && <p className="text-red-500 text-sm">{errors.Ort.message}</p>}
                    </div>
                    <hr className="col-span-2" />
                    <CardDescription className="col-span-2">Es reicht nur eine möglichkeit um Kontakt aufzunehmen</CardDescription>
                    <div className="col-span-2">
                        <Label htmlFor="Tel">Telefon</Label>
                        <Input id="Tel" {...register("Tel")} />
                        {errors.Tel && <p className="text-red-500 text-sm">{errors.Tel.message}</p>}
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="Handy">Handy</Label>
                        <Input id="Handy" {...register("Handy")} />
                        {errors.Handy && <p className="text-red-500 text-sm">{errors.Handy.message}</p>}
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="Email">E-Mail</Label>
                        <Input id="Email" type="email" {...register("Email")} />
                        {errors.Email && <p className="text-red-500 text-sm">{errors.Email.message}</p>}
                    </div>
                </div>
                <Button type="submit" className="w-full">weiter</Button>
            </form>
        </>
    );
}