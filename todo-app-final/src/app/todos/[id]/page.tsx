import { Box } from "@mui/material";
import TodoCardEditable from "@/components/todos/TodoCardEditable";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const todoId = Number((await params).id);

    return (
        <>
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
        </>
    );
}
