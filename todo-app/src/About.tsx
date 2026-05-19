"use client"

import { Box, Typography } from "@mui/material"
import AppLayout from "./components/AppLayout"

export default function About() {

    return (
        <AppLayout>
            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', width: '100%', flex: '1' }}>
                <Typography>
                    Ein kurzer Text über deine ToDo-App und dich als Autor:in
                </Typography>
            </Box>
        </AppLayout>
    )
}