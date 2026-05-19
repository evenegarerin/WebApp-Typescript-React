"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import SchoolIcon from "@mui/icons-material/School"
import Link from "next/link";

interface HeaderProps {
    title: string
    todoCount: number
}

const pages = [
    { label: 'Home', path: '/' },
    { label: 'Statistics', path: '/statistics' },
    { label: 'About', path: '/about' },
];

const Header = (props: HeaderProps) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <SchoolIcon sx={{ mr: 2 }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Todo App
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {pages.map((page) => (
                        <Button
                            key={page.path}
                            color="inherit"
                            sx={{ textTransform: 'none' }}
                            component={Link}
                            href={page.path}
                        >
                            {page.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header