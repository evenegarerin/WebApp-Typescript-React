"use client"

import { ToggleButtonGroup, ToggleButton } from "@mui/material"
import { useLocale } from "@/context/LocaleContext"

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLocale()

    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newLocale: any
    ) => {
        if (newLocale !== null) {
            setLocale(newLocale)
        }
    }

    return (
        <ToggleButtonGroup
            value={locale}
            exclusive
            onChange={handleChange}
            size="small">
            <ToggleButton value="de">
                DE
            </ToggleButton>

            <ToggleButton value="den">
                EN
            </ToggleButton>
        </ToggleButtonGroup>
    )
}