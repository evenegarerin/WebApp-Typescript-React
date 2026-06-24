"use client";

import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations("Error");

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                width: "100%",
                flex: "1",
                padding: 4,
            }}
        >
            <Typography variant="h6">{t("title")}</Typography>

            <Button variant="contained" onClick={reset}>
                {t("retry")}
            </Button>
        </Box>
    );
}
