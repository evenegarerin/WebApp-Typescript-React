import { Card, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { type Todo, type TodoStatus } from "../../src/models"

interface TodoCardProps {
    todo: Todo
    toggleTodo: (id: number) => void
    dropTodo: (id: number) => void
}

const TodoCard = ({ todo, toggleTodo, dropTodo }: TodoCardProps) => {
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

            <CardActions>
                <IconButton onClick={() => {
                    toggleTodo(todo.id)
                }}>
                    <DoneIcon />
                </IconButton>

                <IconButton onClick={() => {
                    dropTodo(todo.id)
                }}>
                    <DeleteForeverIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default TodoCard