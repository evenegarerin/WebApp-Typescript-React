import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        primary: {
            main: "#023047",
        },
        secondary: {
            main: "#219ebc",
        },
    },

    typography: {
        fontFamily: "'Roboto', sans-serif",
        h4: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
})

export default theme