"use client"

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"

const theme = createTheme({
    palette: {
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
})

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    )
}