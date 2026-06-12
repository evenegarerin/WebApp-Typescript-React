"use client"

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import { createContext, useContext, useMemo, useState } from "react"

type ColorMode = "light" | "dark"

interface ColorModeContextValue {
    mode: ColorMode
    toggleMode: () => void
}

const ColorModeContext =
    createContext<ColorModeContextValue | null>(null)

export function useColorMode() {
    const context = useContext(ColorModeContext)
    if (!context) {
        throw new Error(
            "useColorMode muss innerhalb von ThemeRegistry stehen",
        )
    }
    return context
}

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode
}) {
    const [mode, setMode] = useState<ColorMode>("light")

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {
                main: "#023047",
            },
            secondary: {
                main: "#219ebc",
            },
        },

        typography: {
            fontFamily: "'Roboto', sans-serif",
            h4: {
                fontWeight: 600,
            },
        },
        shape: {
            borderRadius: 8,
        },
    }), [mode])

    const toggleMode = () => {
        setMode(prev => prev === "light" ? "dark" : "light")
    }

    return (
        <AppRouterCacheProvider>
            <ColorModeContext value={{ mode, toggleMode }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </ColorModeContext>
        </AppRouterCacheProvider>
    )
}
