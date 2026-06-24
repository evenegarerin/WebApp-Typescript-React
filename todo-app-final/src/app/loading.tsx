import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                flex: "1",
                padding: 4,
            }}
        >
            <CircularProgress />
        </Box>
    );
}
