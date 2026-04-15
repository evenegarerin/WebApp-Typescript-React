import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import type { Todo } from "../models"

interface TodoCardProps {
    todo: Todo
}

const TodoCard = ({ todo }: TodoCardProps) => {
    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardHeader title={todo.name} subheader={todo.priority + " - " + todo.status} />

            <CardContent>
                {todo.description && <Typography>{todo.description}</Typography>}
                {todo.dueDate && <Typography>{todo.dueDate}</Typography>}

                {todo.tags.length > 0 && (
                    <Typography>{todo.tags.map((tag, index) => (
                        <span key={index}>
                            {tag}{index < todo.tags.length - 1 ? ", " : ""}
                        </span>
                    ))}</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default TodoCard