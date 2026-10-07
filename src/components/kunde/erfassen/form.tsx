"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";

import { erfasseKundeSchema, ErfasseSkiKunde } from "@/types/skikundetypes";
import { useKundeErstellen } from "@/contex/kundeerstellen-contex";

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

    const { kunde, setKunde } = useKundeErstellen();
    const router = useRouter();

    const [ortTreffer, setOrtTreffer] = useState<{ plz: string; namen: string[] }>({
        plz: "",
        namen: [],
    });

    const formPlz = useWatch({ control, name: "Plz" });

    // Treffer gelten nur, solange sie zur aktuellen PLZ gehören
    const orte = ortTreffer.plz === formPlz ? ortTreffer.namen : [];

    // Ort anhand der PLZ nachladen
    useEffect(() => {
        if (!formPlz || formPlz.length !== 5) {
            setValue("Ort", ""); // RHF-Store, kein React-State -> ok
            return;
        }

        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch(`/api/kunde/ort?plz=${formPlz}`, {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error("Ortsabfrage fehlgeschlagen");

                const data: { Ort: string }[] = await res.json();
                const namen = data.map((d) => d.Ort);
                setOrtTreffer({ plz: formPlz, namen });

                if (namen.length === 0) {
                    setValue("Ort", "");
                    setError("Plz", { message: "PLZ nicht gefunden" });
                    return;
                }

                clearErrors("Plz");
                // bereits gewählten Ort behalten (z.B. beim Zurückkommen von der Prüfung)
                if (namen.includes(getValues("Ort"))) return;
                setValue("Ort", namen.length === 1 ? namen[0] : "", {
                    shouldValidate: namen.length === 1,
                });
            } catch (e) {
                if ((e as Error).name !== "AbortError") {
                    setError("Plz", { message: "PLZ konnte nicht geprüft werden" });
                }
            }
        })();

        return () => controller.abort();
    }, [formPlz, setValue, getValues, setError, clearErrors]);

    // Daten wiederherstellen, wenn man von der Prüfung zurückkommt
    useEffect(() => {
        if (kunde && (kunde.Vorname || kunde.Nachname)) {
            reset(kunde);
        }
    }, [kunde, reset]);

    function onSubmit(values: ErfasseSkiKunde) {
        setKunde(values);
        router.push("/kunde/erfassen/pruefen"); // Pfad ggf. an deine Route anpassen
    }

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
                    hint="wird von der PLZ abgeleitet"
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
        </form>
    );
}