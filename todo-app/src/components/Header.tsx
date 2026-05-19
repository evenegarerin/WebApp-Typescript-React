import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import SchoolIcon from "@mui/icons-material/School"
import { useRouter } from "next/navigation";

interface HeaderProps {
    title: string
    todoCount: number
}

const pages = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
];

const Header = (props: HeaderProps) => {
    const router = useRouter();

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
                            onClick={() => router.push(page.path)}
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