"use client"

import { createContext, useContext, useState } from "react"
import { NextIntlClientProvider } from "next-intl"
import de from "@/../messages/de.json"
import en from "@/../messages/en.json"

export type Locale = "de" | "en"
const messages = { de, en }

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
    return (
        <LocaleContext value={{ locale, setLocale }}>
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