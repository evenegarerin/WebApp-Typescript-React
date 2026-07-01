"use client";

import Link from "next/link";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { ArrowBackIcon } from "@/components/common/icons";

export default function BackButton() {
    const t = useTranslations("Actions");

    return (
        <Button component={Link} href="/" startIcon={<ArrowBackIcon />}>
            {t("back")}
        </Button>
    );
}
