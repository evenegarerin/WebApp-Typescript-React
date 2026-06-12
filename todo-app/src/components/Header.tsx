"use client";

import { useState } from "react";
import { AppBar, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material"
import SchoolIcon from "@mui/icons-material/School"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import LogoutIcon from "@mui/icons-material/Logout"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useColorMode } from "@/components/ThemeRegistry"
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";

const pages = [
    { labelKey: 'home', path: '/' },
    { labelKey: 'statistics', path: '/statistics' },
    { labelKey: 'about', path: '/about' },
] as const;

const Header = () => {
    const router = useRouter();
    const t = useTranslations("Layout");
    const tAuth = useTranslations("Auth");

    const { mode, toggleMode } = useColorMode()

    const { data: session, isPending } = authClient.useSession()
    const queryClient = useQueryClient()

    const [settingsAnchor, setSettingsAnchor] = useState<HTMLElement | null>(null)
    const [userAnchor, setUserAnchor] = useState<HTMLElement | null>(null)

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    // Cache leeren, damit der nächste Nutzer keine fremden Daten sieht
                    queryClient.clear()
                    router.push("/login")
                },
            },
        })
    }

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

                    {isPending ? null : session ? (
                        <>
                            <Button
                                color="inherit"
                                sx={{ textTransform: 'none' }}
                                onClick={(e) => setUserAnchor(e.currentTarget)}
                            >
                                {session.user.name}
                            </Button>

                            <Menu
                                anchorEl={userAnchor}
                                open={Boolean(userAnchor)}
                                onClose={() => setUserAnchor(null)}
                            >
                                <MenuItem
                                    onClick={() => {
                                        setUserAnchor(null)
                                        handleLogout()
                                    }}
                                >
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>
                                        {tAuth("logout")}
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                sx={{ textTransform: 'none' }}
                                component={Link}
                                href="/login"
                            >
                                {tAuth("login")}
                            </Button>
                            <Button
                                color="inherit"
                                sx={{ textTransform: 'none' }}
                                component={Link}
                                href="/register"
                            >
                                {tAuth("register")}
                            </Button>
                        </>
                    )}

                    <IconButton
                        color="inherit"
                        onClick={(e) => setSettingsAnchor(e.currentTarget)}
                    >
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        anchorEl={settingsAnchor}
                        open={Boolean(settingsAnchor)}
                        onClose={() => setSettingsAnchor(null)}
                    >
                        <MenuItem onClick={toggleMode}>
                            <ListItemIcon>
                                {mode === "light" ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                            </ListItemIcon>
                            <ListItemText>
                                {mode === "light" ? t("darkMode") : t("lightMode")}
                            </ListItemText>
                        </MenuItem>

                        <Box sx={{ px: 2, py: 1 }}>
                            <LanguageSwitcher />
                        </Box>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header
