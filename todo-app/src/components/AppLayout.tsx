"use client"

import { Box, Grid } from "@mui/material"
import Header from "./Header"
import Footer from "./Footer"
import ThemeRegistry from "./ThemeRegistry"

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (< html lang="de" >
        <body>
            <ThemeRegistry>
                <Box sx={{ display: 'flex', flexDirection: "column", width: '100vw', height: '100vh' }}>
                    <Header title={"your cool todo list"} todoCount={0} />

                    <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', width: '100%', flex: '1' }}>
                        {children}
                    </Box>

                    <Footer author={"me"} />
                </Box>
            </ThemeRegistry>
        </body>
    </html >)
}