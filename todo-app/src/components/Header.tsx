"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import SchoolIcon from "@mui/icons-material/School"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher"

const pages = [
    { labelKey: 'home', path: '/' },
    { labelKey: 'statistics', path: '/statistics' },
    { labelKey: 'about', path: '/about' },
] as const;

const Header = () => {
    const router = useRouter();
    const t = useTranslations("Layout");

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                    sx={{ display: "flex", alignItems: "center" }}
                    onClick={() => {
                        router.push("/");
                    }}
                >
                    <SchoolIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {t("title")}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <LanguageSwitcher>

                    </LanguageSwitcher>
                    {pages.map((page) => (
                        <Button
                            key={page.path}
                            color="inherit"
                            sx={{ textTransform: 'none' }}
                            component={Link}
                            href={page.path}
                        >
                            {t(page.labelKey)}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header
