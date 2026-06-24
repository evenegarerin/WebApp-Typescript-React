"use client";

import { AppBar, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getTodos } from "@/actions";

const Footer = () => {
    const t = useTranslations("Layout");
    const tStats = useTranslations("Statistics");
    const tStatus = useTranslations("Status");

    const { data: todos } = useQuery({
        queryKey: ["todos"],
        queryFn: getTodos,
    });

    const total = todos?.length ?? 0;
    const open = todos?.filter((todo) => todo.status === "open").length ?? 0;
    const done = todos?.filter((todo) => todo.status === "done").length ?? 0;
    const inProgress = todos?.filter((todo) => todo.status === "in-progress").length ?? 0;

    const year = new Date().getFullYear();

    return (
        <AppBar
            position="static"
            component="footer"
            sx={{
                paddingBlock: 4,
                alignItems: "center",
                gap: 1,
            }}
        >
            <Typography>
                © {year} {t("author")}
            </Typography>

            <Typography variant="body2">
                {tStats("all")}: {total} · {tStatus("open")}: {open} · {tStatus("done")}: {done} ·{" "}
                {tStatus("in-progress")}: {inProgress}
            </Typography>
        </AppBar>
    );
};

export default Footer;
