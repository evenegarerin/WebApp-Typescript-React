"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useColorMode } from "@/components/providers/ThemeRegistry";

export default function Page() {
    const t = useTranslations("About");
    const { mode } = useColorMode();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                width: "100%",
                flex: "1",
                p: 4,
            }}
        >
            <Box sx={{ display: "grid", width: "100%", maxWidth: { xs: 600, xl: 1200 } }}>
                <Box
                    component="img"
                    src="/team.png"
                    alt="Team"
                    sx={{
                        gridArea: "1 / 1",
                        display: "block",
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        transition: "opacity 0.4s ease",
                        opacity: mode === "light" ? 1 : 0,
                    }}
                />
                <Box
                    component="img"
                    src="/team-dark.png"
                    alt=""
                    sx={{
                        gridArea: "1 / 1",
                        display: "block",
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        transition: "opacity 0.4s ease",
                        opacity: mode === "dark" ? 1 : 0,
                    }}
                />
            </Box>

            <Typography>{t("text")}</Typography>
        </Box>
    );
}
