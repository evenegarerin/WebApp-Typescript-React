"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ColorMode = "light" | "dark";

interface ColorModeContextValue {
    mode: ColorMode;
    toggleMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export function useColorMode() {
    const context = useContext(ColorModeContext);
    if (!context) {
        throw new Error("useColorMode muss innerhalb von ThemeRegistry stehen");
    }
    return context;
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ColorMode>("light");

    useEffect(() => {
        const stored = localStorage.getItem("colorMode");
        if (stored === "light" || stored === "dark") {
            setMode(stored);
        }
    }, []);

    const theme = useMemo(() => {
        const isLight = mode === "light";

        return createTheme({
            palette: {
                mode,
                primary: {
                    main: isLight ? "#023047" : "#0087ca",
                },

                // overwriting default values in dark-mode to reduce contrast.
                ...(isLight
                    ? {}
                    : {
                          background: {
                              default: "#1a1a1c",
                              paper: "#242427",
                          },
                          text: {
                              primary: "rgba(255, 255, 255, 0.85)",
                              secondary: "rgba(255, 255, 255, 0.6)",
                          },
                      }),
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
        });
    }, [mode]);

    const toggleMode = () => {
        setMode((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("colorMode", next);
            return next;
        });
    };

    return (
        <AppRouterCacheProvider>
            <ColorModeContext value={{ mode, toggleMode }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline enableColorScheme />
                    {children}
                </ThemeProvider>
            </ColorModeContext>
        </AppRouterCacheProvider>
    );
}
