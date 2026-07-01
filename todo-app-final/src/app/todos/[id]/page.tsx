import { Box } from "@mui/material";
import TodoCardEditable from "@/components/todos/TodoCardEditable";
import BackButton from "@/components/common/BackButton";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const todoId = Number((await params).id);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                flex: "1",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                <BackButton />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    flex: "1",
                }}
            >
                <TodoCardEditable todoId={todoId} />
            </Box>
        </Box>
    );
}
