"use client";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";

import { erfasseKundeSchema, ErfasseSkiKunde } from "@/types/skikundetypes";
import { useKundeErstellen } from "@/contex/kundeerstellen-contex";
import { orteOptions } from "@/hooks/useOrteOptions";
import KundePruefenDialog from "@/components/kunde/pruefen/KundePruefenDialog";

const leereWerte: ErfasseSkiKunde = {
    Vorname: "",
    Nachname: "",
    Strasse: "",
    Plz: "",
    Ort: "",
    Tel: "",
    Handy: "",
    Email: "",
};

// Feste Referenz, damit der Effekt unten nicht bei jedem Render neu läuft
const KEINE_ORTE: string[] = [];

type FieldProps = {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    className?: string;
    children: ReactNode;
};

function Field({ id, label, error, hint, className, children }: FieldProps) {
    return (
        <div className={className}>
            <Label htmlFor={id}>{label}</Label>
            {children}
            {hint && !error && <p className="text-gray-400 text-xs">{hint}</p>}
            {error && (
                <p id={`${id}-error`} className="text-red-500 text-sm">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function KundeErfassungForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        setError,
        clearErrors,
        reset,
    } = useForm<ErfasseSkiKunde>({
        resolver: zodResolver(erfasseKundeSchema),
        defaultValues: leereWerte,
    });

    const { kunde, setKunde, setUpdateKunde, setSkiKundeID } = useKundeErstellen();
    // Zu prüfende Eingabe, null = Prüfdialog geschlossen
    const [pruefDaten, setPruefDaten] = useState<ErfasseSkiKunde | null>(null);
    // Neuer Dialog-Zustand je Prüfung (Erfolg/Fehler vom letzten Mal zurücksetzen)
    const [pruefNr, setPruefNr] = useState(0);

    const formPlz = useWatch({ control, name: "Plz" }) ?? "";

    // Orte zur PLZ über TanStack Query (Server Action), erst ab 5 Ziffern
    const { data, isFetching: sucheOrt, error: ortFehler, isSuccess } = useQuery(orteOptions(formPlz.trim()));
    const orte = data ?? KEINE_ORTE;

    // Ort aus dem Abfrageergebnis übernehmen (RHF-Store, kein React-State)
    useEffect(() => {
        if (!/^\d{5}$/.test(formPlz.trim())) {
            setValue("Ort", "");
            return;
        }
        if (ortFehler) {
            setValue("Ort", "");
            setError("Plz", { message: "PLZ konnte nicht geprüft werden" });
            return;
        }
        if (!isSuccess) return;
        if (orte.length === 0) {
            setValue("Ort", "");
            setError("Plz", { message: "PLZ nicht gefunden" });
            return;
        }
        clearErrors("Plz");
        // bereits gewählten Ort behalten (z.B. nach dem Korrigieren)
        if (orte.includes(getValues("Ort"))) return;
        setValue("Ort", orte.length === 1 ? orte[0] : "", { shouldValidate: orte.length === 1 });
    }, [formPlz, orte, ortFehler, isSuccess, setValue, getValues, setError, clearErrors]);

    // Vom Personal gesendeten Kunden übernehmen (SSE)
    useEffect(() => {
        if (kunde && (kunde.Vorname || kunde.Nachname)) {
            reset(kunde);
        }
    }, [kunde, reset]);

    // Erst prüfen lassen, gespeichert wird im Dialog
    function onSubmit(values: ErfasseSkiKunde) {
        setPruefNr((nr) => nr + 1);
        setPruefDaten(values);
    }

    // Nach dem Speichern: alles leeren, bereit für den nächsten Kunden
    const fertig = useCallback(() => {
        setPruefDaten(null);
        setKunde(null);
        setUpdateKunde(false);
        setSkiKundeID(null);
        reset(leereWerte);
    }, [setKunde, setUpdateKunde, setSkiKundeID, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
                <Field id="Vorname" label="Vorname" error={errors.Vorname?.message}>
                    <Input
                        id="Vorname"
                        autoComplete="given-name"
                        aria-invalid={!!errors.Vorname}
                        {...register("Vorname")}
                    />
                </Field>

                <Field id="Nachname" label="Nachname" error={errors.Nachname?.message}>
                    <Input
                        id="Nachname"
                        autoComplete="family-name"
                        aria-invalid={!!errors.Nachname}
                        {...register("Nachname")}
                    />
                </Field>

                <Field id="Strasse" label="Straße" error={errors.Strasse?.message} className="col-span-2">
                    <Input
                        id="Strasse"
                        autoComplete="street-address"
                        aria-invalid={!!errors.Strasse}
                        {...register("Strasse")}
                    />
                </Field>

                <Field id="Plz" label="PLZ" error={errors.Plz?.message}>
                    <Input
                        id="Plz"
                        inputMode="numeric"
                        maxLength={5}
                        autoComplete="postal-code"
                        aria-invalid={!!errors.Plz}
                        {...register("Plz")}
                    />
                </Field>

                <Field
                    id="Ort"
                    label="Ort"
                    error={errors.Ort?.message}
                    hint={sucheOrt ? "suche Ort…" : "wird von der PLZ abgeleitet"}
                >
                    {orte.length > 1 ? (
                        <select
                            id="Ort"
                            className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            {...register("Ort")}
                        >
                            <option value="">Bitte wählen…</option>
                            {orte.map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <Input id="Ort" readOnly tabIndex={-1} {...register("Ort")} />
                    )}
                </Field>

                <hr className="col-span-2" />

                <CardDescription className="col-span-2">
                    Es reicht eine Möglichkeit, um Kontakt aufzunehmen
                </CardDescription>
                {errors.Tel?.message && (
                    <p className="col-span-2 text-red-500 text-sm">{errors.Tel.message}</p>
                )}

                <Field id="Tel" label="Telefon" className="col-span-2">
                    <Input id="Tel" type="tel" autoComplete="tel" {...register("Tel")} />
                </Field>

                <Field id="Handy" label="Handy" error={errors.Handy?.message} className="col-span-2">
                    <Input id="Handy" type="tel" autoComplete="tel" {...register("Handy")} />
                </Field>

                <Field id="Email" label="E-Mail" error={errors.Email?.message} className="col-span-2">
                    <Input id="Email" type="email" autoComplete="email" {...register("Email")} />
                </Field>
            </div>

            <Button type="submit" className="w-full">
                weiter
            </Button>

            <KundePruefenDialog
                key={pruefNr}
                daten={pruefDaten}
                onZurueck={() => setPruefDaten(null)}
                onFertig={fertig}
            />
        </form>
    );
}