"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { NextIntlClientProvider } from "next-intl"
import de from "@/../messages/de.json"
import en from "@/../messages/en.json"
import es from "@/../messages/es.json"

export type Locale = "de" | "en" | "es"
const messages = { de, en, es }

const isLocale = (value: string | null): value is Locale =>
    value === "de" || value === "en" || value === "es"

interface LocaleContextValue {
    locale: Locale
    setLocale: (next: Locale) => void
}

const LocaleContext =
    createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [locale, setLocale] = useState<Locale>("de")

    // Gespeicherte Sprache erst nach dem Mount lesen, damit Server-Render
    // und erster Client-Render dieselbe Sprache annehmen (kein Hydration-Mismatch).
    useEffect(() => {
        const stored = localStorage.getItem("locale")
        if (isLocale(stored)) {
            setLocale(stored)
        }
    }, [])

    const changeLocale = (next: Locale) => {
        setLocale(next)
        localStorage.setItem("locale", next)
    }

    return (
        <LocaleContext value={{ locale, setLocale: changeLocale }}>
            <NextIntlClientProvider
                locale={locale}
                messages={messages[locale]}
                timeZone="Europe/Berlin"
            >
                {children}
            </NextIntlClientProvider>
        </LocaleContext>
    )
}

export function useLocale() {
    const context = useContext(LocaleContext)
    if (!context) {
        throw new Error(
            "useLocale muss innerhalb von LocaleProvider stehen",
        )
    }
    return context
}
