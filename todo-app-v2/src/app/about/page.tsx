import { Box, Typography } from "@mui/material";

export default async function Page() {
    return (
        <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', width: '100%', flex: '1' }}>
            <Typography>
                Ein kurzer Text über deine ToDo-App und dich als Autor:in
            </Typography>
        </Box>
    )
}