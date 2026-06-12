import { Box } from "@mui/material";
import TodoCardEditable from "@/components/TodoCardEditable";

export default async function Page({
    params,
}: {
    params: Promise<{ todoId: string }>;
}) {
    const todoId = Number((await params).todoId);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <TodoCardEditable
                    todoId={todoId}
                />
            </Box>
        </>
    );
}