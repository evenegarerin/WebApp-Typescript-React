import { Card, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { todoStatuses, type Todo, type TodoStatus } from "../models"

interface TodoCardProps {
    todo: Todo
    updateTodo: (todo: Todo) => void
    dropTodo: (todo: Todo) => void
}

const TodoCard = ({ todo, updateTodo, dropTodo }: TodoCardProps) => {
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
                    const updatedTodo = todo

                    updatedTodo.status = nextStatus(todo.status)

                    updateTodo(updatedTodo)
                }}>
                    <DoneIcon />
                </IconButton>

                <IconButton onClick={() => {
                    const updatedTodo = todo

                    updatedTodo.status = nextStatus(todo.status)

                    dropTodo(updatedTodo)
                }}>
                    <DeleteForeverIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};


const nextStatus = (current: TodoStatus): TodoStatus => {
    const index = todoStatuses.indexOf(current);
    return todoStatuses[(index + 1) % todoStatuses.length];
}

export default TodoCard