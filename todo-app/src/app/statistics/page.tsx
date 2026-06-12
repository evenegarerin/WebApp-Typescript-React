"use client"

import { getTodoLists, getTodos } from "@/actions";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("Statistics");
    const tStatus = useTranslations("Status");
    const tList = useTranslations("TodoList");

    const results = useQueries({
        queries: [
            { queryKey: ["todos"], queryFn: getTodos },
            { queryKey: ["lists"], queryFn: getTodoLists },
        ],
    });

    const todos = results[0].data;
    const lists = results[1].data;

    if (results.some(r => r.isLoading) || !todos || !lists) {
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
    const highPriority = todos.filter(todo => todo.priority === "high").length

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', gap: 2, width: '100%', flex: '1' }}>
            <Typography>
                <span>{t("all")}: {total} - </span>
                <span>{tStatus("open")}: {open} - </span>
                <span>{tStatus("in-progress")}: {inProgress} - </span>
                <span>{tStatus("done")}: {done} - </span>
                <span>{t("highPriority")}: {highPriority}</span>
            </Typography>

            <Divider sx={{ width: 300 }} />

            <Typography variant="h6">
                {t("perList")}
            </Typography>

            {lists.map(list => {
                const listTodos = todos.filter(todo => todo.listId === list.id)
                const listDone = listTodos.filter(todo => todo.status === "done").length
                const percent = listTodos.length === 0
                    ? 0
                    : Math.round((listDone / listTodos.length) * 100)

                return (
                    <Typography key={list.id}>
                        {list.name}: {tList("count", { n: listTodos.length })} — {t("percentDone", { p: percent })}
                    </Typography>
                )
            })}
        </Box>
    )
}
