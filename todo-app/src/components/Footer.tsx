"use client"

import { Box, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { getTodos } from "@/actions"

const Footer = () => {
    const t = useTranslations("Layout")
    const tStats = useTranslations("Statistics")
    const tStatus = useTranslations("Status")

    const { data: todos } = useQuery({
        queryKey: ["todos"],
        queryFn: getTodos,
    })

    const total = todos?.length ?? 0
    const open = todos?.filter(todo => todo.status === "open").length ?? 0
    const done = todos?.filter(todo => todo.status === "done").length ?? 0

    const year = new Date().getFullYear()

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                paddingBlock: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Typography>
                © {year} {t("author")}
            </Typography>

            <Typography variant="body2">
                {tStats("all")}: {total} · {tStatus("open")}: {open} · {tStatus("done")}: {done}
            </Typography>
        </Box>
    )
}

export default Footer
