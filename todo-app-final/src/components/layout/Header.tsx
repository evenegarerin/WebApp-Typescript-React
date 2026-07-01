"use client";

import { useState } from "react";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import {
    LogoIcon,
    DarkModeIcon,
    LightModeIcon,
    MenuIcon,
    LogoutIcon,
} from "@/components/common/icons";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useColorMode } from "@/components/providers/ThemeRegistry";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";

const pages = [
    { labelKey: "home", path: "/" },
    { labelKey: "statistics", path: "/statistics" },
    { labelKey: "about", path: "/about" },
] as const;

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("Layout");
    const tAuth = useTranslations("Auth");

    const { mode, toggleMode } = useColorMode();

    const { data: session, isPending } = authClient.useSession();
    const queryClient = useQueryClient();

    const [settingsAnchor, setSettingsAnchor] = useState<HTMLElement | null>(null);
    const [userAnchor, setUserAnchor] = useState<HTMLElement | null>(null);

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    // clear the cache to ensure that no data leaks to the next user
                    queryClient.clear();
                    router.push("/login");
                    router.refresh();
                },
            },
        });
    };

    return (
        <AppBar position="static">
            <Toolbar
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    py: { xs: 1, sm: 0 },
                    gap: { xs: 1, sm: 0 },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LogoIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {t("title")}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {session &&
                        pages.map((page) => {
                            const isActive =
                                page.path === "/"
                                    ? pathname === "/"
                                    : pathname === page.path ||
                                      pathname.startsWith(page.path + "/");

                            return (
                                <Button
                                    key={page.path}
                                    color="inherit"
                                    sx={{
                                        textTransform: "none",
                                        textDecoration: isActive ? "underline" : "none",
                                        textUnderlineOffset: "4px",
                                    }}
                                    component={Link}
                                    href={page.path}
                                >
                                    {t(page.labelKey)}
                                </Button>
                            );
                        })}

                    {isPending ? null : session ? (
                        <>
                            <Button
                                color="inherit"
                                sx={{ textTransform: "none" }}
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
                                        setUserAnchor(null);
                                        handleLogout();
                                    }}
                                >
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>{tAuth("logout")}</ListItemText>
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                sx={{ textTransform: "none" }}
                                component={Link}
                                href="/login"
                            >
                                {tAuth("login")}
                            </Button>
                            <Button
                                color="inherit"
                                sx={{ textTransform: "none" }}
                                component={Link}
                                href="/register"
                            >
                                {tAuth("register")}
                            </Button>
                        </>
                    )}

                    <IconButton color="inherit" onClick={(e) => setSettingsAnchor(e.currentTarget)}>
                        <MenuIcon />
                    </IconButton>

                    <Menu
                        anchorEl={settingsAnchor}
                        open={Boolean(settingsAnchor)}
                        onClose={() => setSettingsAnchor(null)}
                    >
                        <MenuItem onClick={toggleMode}>
                            <ListItemIcon>
                                {mode === "light" ? (
                                    <DarkModeIcon fontSize="small" />
                                ) : (
                                    <LightModeIcon fontSize="small" />
                                )}
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
    );
};

export default Header;
