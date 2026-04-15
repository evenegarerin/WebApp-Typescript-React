import { AppBar, Toolbar, Typography } from "@mui/material"
import SchoolIcon from "@mui/icons-material/School"

interface HeaderProps {
    title: string
    todoCount: number
}

const Header = (props: HeaderProps) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <SchoolIcon sx={{ mr: 2 }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Todo App
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Header