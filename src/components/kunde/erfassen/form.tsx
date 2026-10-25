"use client";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

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

// Große, gut tippbare Eingaben (Tablet), mind. 16px Schrift damit iOS nicht zoomt
const EINGABE = "h-12 text-lg md:text-lg";

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
        <div className={cn("space-y-1.5", className)}>
            <Label htmlFor={id} className="text-base font-medium">{label}</Label>
            {children}
            {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
            {error && (
                <p id={`${id}-error`} className="text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function Abschnitt({ titel, hinweis, children }: { titel: string; hinweis?: string; children: ReactNode }) {
    return (
        <fieldset className="space-y-4">
            <legend className="mb-3">
                <span className="text-lg font-semibold">{titel}</span>
                {hinweis && <span className="ml-2 text-sm text-muted-foreground">{hinweis}</span>}
            </legend>
            {children}
        </fieldset>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            <Abschnitt titel="Name und Adresse">
                {/* Handy: eine Spalte, ab Tablet hochkant ein 6er Raster */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                    <Field id="Vorname" label="Vorname" error={errors.Vorname?.message} className="sm:col-span-3">
                        <Input
                            id="Vorname"
                            className={EINGABE}
                            autoComplete="given-name"
                            autoCapitalize="words"
                            enterKeyHint="next"
                            aria-invalid={!!errors.Vorname}
                            {...register("Vorname")}
                        />
                    </Field>

                    <Field id="Nachname" label="Nachname" error={errors.Nachname?.message} className="sm:col-span-3">
                        <Input
                            id="Nachname"
                            className={EINGABE}
                            autoComplete="family-name"
                            autoCapitalize="words"
                            enterKeyHint="next"
                            aria-invalid={!!errors.Nachname}
                            {...register("Nachname")}
                        />
                    </Field>

                    <Field id="Strasse" label="Straße und Hausnummer" error={errors.Strasse?.message} className="sm:col-span-6">
                        <Input
                            id="Strasse"
                            className={EINGABE}
                            autoComplete="street-address"
                            autoCapitalize="words"
                            enterKeyHint="next"
                            aria-invalid={!!errors.Strasse}
                            {...register("Strasse")}
                        />
                    </Field>

                    <Field id="Plz" label="PLZ" error={errors.Plz?.message} className="sm:col-span-2">
                        <Input
                            id="Plz"
                            className={EINGABE}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={5}
                            autoComplete="postal-code"
                            enterKeyHint="next"
                            aria-invalid={!!errors.Plz}
                            {...register("Plz")}
                        />
                    </Field>

                    <Field
                        id="Ort"
                        label="Ort"
                        error={errors.Ort?.message}
                        hint={sucheOrt ? "suche Ort…" : "wird aus der PLZ übernommen"}
                        className="sm:col-span-4"
                    >
                        {orte.length > 1 ? (
                            <select
                                id="Ort"
                                className={cn("border-input w-full rounded-md border bg-transparent px-3", EINGABE)}
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
                            <Input id="Ort" className={cn(EINGABE, "bg-muted/50")} readOnly tabIndex={-1} {...register("Ort")} />
                        )}
                    </Field>
                </div>
            </Abschnitt>

            <Abschnitt titel="Kontakt" hinweis="mindestens eine Angabe">
                {errors.Tel?.message && (
                    <p className="text-sm text-red-600">{errors.Tel.message}</p>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                    <Field id="Tel" label="Telefon" className="sm:col-span-3">
                        <Input id="Tel" className={EINGABE} type="tel" autoComplete="tel" enterKeyHint="next" {...register("Tel")} />
                    </Field>

                    <Field id="Handy" label="Handy" error={errors.Handy?.message} className="sm:col-span-3">
                        <Input id="Handy" className={EINGABE} type="tel" autoComplete="tel" enterKeyHint="next" {...register("Handy")} />
                    </Field>

                    <Field id="Email" label="E-Mail" error={errors.Email?.message} className="sm:col-span-6">
                        <Input
                            id="Email"
                            className={EINGABE}
                            type="email"
                            autoComplete="email"
                            autoCapitalize="none"
                            enterKeyHint="done"
                            {...register("Email")}
                        />
                    </Field>
                </div>
            </Abschnitt>

            <Button type="submit" className="h-14 w-full text-lg">
                weiter
                <ArrowRightIcon className="size-5" />
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
