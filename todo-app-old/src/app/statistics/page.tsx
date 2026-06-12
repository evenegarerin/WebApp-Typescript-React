import { getTodos } from "@/actions";
import { Box, Typography } from "@mui/material";

export default async function Home() {
    const todos = await getTodos()

    const total = todos.length
    const open = todos.filter(t => t.status === "open").length
    const inProgress = todos.filter(t => t.status === "in-progress").length
    const done = todos.filter(t => t.status === "done").length

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', width: '100%', flex: '1' }}>
            <Typography>
                <span>total: {total} - </span>
                <span>open: {open} - </span>
                <span>in progress: {inProgress} - </span>
                <span>done: {done} </span>
            </Typography>
        </Box>
    )
}