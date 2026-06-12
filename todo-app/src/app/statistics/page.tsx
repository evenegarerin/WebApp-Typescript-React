"use client"

import { getTodos } from "@/actions";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("Statistics");
    const tStatus = useTranslations("Status");

    const { data: todos, isLoading } = useQuery({
        queryKey: ["todos"],
        queryFn: getTodos,
    });

    if (isLoading || !todos) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flex: '1' }}>
                <CircularProgress />
            </Box>
        )
    }

    const total = todos.length
    const open = todos.filter(todo => todo.status === "open").length
    const inProgress = todos.filter(todo => todo.status === "in-progress").length
    const done = todos.filter(todo => todo.status === "done").length

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', width: '100%', flex: '1' }}>
            <Typography>
                <span>{t("all")}: {total} - </span>
                <span>{tStatus("open")}: {open} - </span>
                <span>{tStatus("in-progress")}: {inProgress} - </span>
                <span>{tStatus("done")}: {done} </span>
            </Typography>
        </Box>
    )
}
