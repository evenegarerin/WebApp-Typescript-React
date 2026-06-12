"use client"

import { useTranslations } from "next-intl"

const Footer = () => {
    const t = useTranslations("Layout")

    return (
        <footer style={{
            backgroundColor: "darkblue",
            paddingBlock: "2rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            color: "aliceblue"
        }}>
            {t("author")}
        </footer>
    )
}

export default Footer
