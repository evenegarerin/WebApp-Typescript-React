interface FooterProps {
    author: string
}

const Footer = (props: FooterProps) => {
    return (
        <footer style={{
            backgroundColor: "darkblue",
            paddingBlock: "2rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            color: "aliceblue"
        }}>
            {props.author}
        </footer>
    )
}

export default Footer