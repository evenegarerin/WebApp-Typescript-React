"use client";

import { getTodoLists, getTodos } from "@/actions";
import { Box, CircularProgress, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function Statistics() {
    const t = useTranslations("Statistics");
    const tStatus = useTranslations("Status");
    const tPriority = useTranslations("Priority");
    const tList = useTranslations("TodoList");

    const results = useQueries({
        queries: [
            { queryKey: ["todos"], queryFn: getTodos },
            { queryKey: ["lists"], queryFn: getTodoLists },
        ],
    });

    const todos = results[0].data;
    const lists = results[1].data;

    if (results.some((r) => r.isLoading) || !todos || !lists) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    flex: "1",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const total = todos.length;
    const open = todos.filter((todo) => todo.status === "open").length;
    const inProgress = todos.filter((todo) => todo.status === "in-progress").length;
    const done = todos.filter((todo) => todo.status === "done").length;

    const high = todos.filter((todo) => todo.priority === "high").length;
    const medium = todos.filter((todo) => todo.priority === "medium").length;
    const low = todos.filter((todo) => todo.priority === "low").length;

    const donePct = total === 0 ? 0 : Math.round((done / total) * 100);
    const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", p: 4 }}>
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Typography variant="h4">{t("title")}</Typography>

                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            flex: "1 1 240px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box sx={{ position: "relative", display: "inline-flex" }}>
                            <CircularProgress
                                variant="determinate"
                                value={100}
                                size={150}
                                thickness={4}
                                sx={{ color: "action.hover" }}
                            />
                            <CircularProgress
                                variant="determinate"
                                value={donePct}
                                size={150}
                                thickness={4}
                                color="success"
                                sx={{ position: "absolute", left: 0 }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography variant="h4">{donePct}%</Typography>
                            </Box>
                        </Box>
                        <Typography color="text.secondary">
                            {t("completed", { done, total })}
                        </Typography>
                    </Paper>

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            flex: "2 1 320px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6">{t("byStatus")}</Typography>
                        <StackedBar
                            total={total}
                            segments={[
                                { value: done, color: "success.main" },
                                { value: inProgress, color: "info.main" },
                                { value: open, color: "grey.500" },
                            ]}
                        />
                        <Stack spacing={1}>
                            <LegendRow
                                color="success.main"
                                label={tStatus("done")}
                                value={done}
                                percent={pct(done)}
                            />
                            <LegendRow
                                color="info.main"
                                label={tStatus("in-progress")}
                                value={inProgress}
                                percent={pct(inProgress)}
                            />
                            <LegendRow
                                color="grey.500"
                                label={tStatus("open")}
                                value={open}
                                percent={pct(open)}
                            />
                        </Stack>
                    </Paper>
                </Box>

                <Paper
                    variant="outlined"
                    sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <Typography variant="h6">{t("byPriority")}</Typography>
                    <StackedBar
                        total={total}
                        segments={[
                            { value: high, color: "error.main" },
                            { value: medium, color: "warning.main" },
                            { value: low, color: "grey.500" },
                        ]}
                    />
                    <Stack spacing={1}>
                        <LegendRow
                            color="error.main"
                            label={tPriority("high")}
                            value={high}
                            percent={pct(high)}
                        />
                        <LegendRow
                            color="warning.main"
                            label={tPriority("medium")}
                            value={medium}
                            percent={pct(medium)}
                        />
                        <LegendRow
                            color="grey.500"
                            label={tPriority("low")}
                            value={low}
                            percent={pct(low)}
                        />
                    </Stack>
                </Paper>

                <Paper
                    variant="outlined"
                    sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <Typography variant="h6">{t("perList")}</Typography>
                    {lists.length === 0 ? (
                        <Typography color="text.secondary">—</Typography>
                    ) : (
                        lists.map((list) => {
                            const listTodos = todos.filter((todo) => todo.listId === list.id);
                            const listDone = listTodos.filter(
                                (todo) => todo.status === "done",
                            ).length;
                            const percent =
                                listTodos.length === 0
                                    ? 0
                                    : Math.round((listDone / listTodos.length) * 100);

                            return (
                                <Box key={list.id}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 0.5,
                                        }}
                                    >
                                        <Typography>{list.name}</Typography>
                                        <Typography color="text.secondary">
                                            {tList("count", { n: listTodos.length })} ·{" "}
                                            {t("percentDone", { p: percent })}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={percent}
                                        color="success"
                                        sx={{ height: 8, borderRadius: 1 }}
                                    />
                                </Box>
                            );
                        })
                    )}
                </Paper>
            </Box>
        </Box>
    );
}

type Segment = { value: number; color: string };

const StackedBar = ({ segments, total }: { segments: Segment[]; total: number }) => {
    return (
        <Box
            sx={{
                display: "flex",
                height: 14,
                width: "100%",
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "action.hover",
            }}
        >
            {total > 0 &&
                segments.map((segment, i) => (
                    <Box
                        key={i}
                        sx={{ width: `${(segment.value / total) * 100}%`, bgcolor: segment.color }}
                    />
                ))}
        </Box>
    );
};

const LegendRow = ({
    color,
    label,
    value,
    percent,
}: {
    color: string;
    label: string;
    value: number;
    percent: number;
}) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
                sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: color, flexShrink: 0 }}
            />
            <Typography sx={{ flexGrow: 1 }}>{label}</Typography>
            <Typography color="text.secondary">
                {value} ({Math.round(percent)}%)
            </Typography>
        </Box>
    );
};
