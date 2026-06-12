"use client"

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Page() {
    const t = useTranslations("About");

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', width: '100%', flex: '1' }}>
            <Typography>
                {t("text")}
            </Typography>
        </Box>
    )
}
