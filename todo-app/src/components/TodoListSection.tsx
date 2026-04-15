import { Card, CardContent } from "@mui/material"
import { CardHeader } from '@mui/material';
import type { Todo, TodoList } from "../models"
import TodoCard from "./TodoCard"

interface TodoListSectionProps {
    list: TodoList,
    todos: Array<Todo>
}

const TodoListSection = ({ list, todos }: TodoListSectionProps) => {
    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardHeader title={list.name} subheader={list.description} />

            <CardContent>
                {todos.map(todo => (
                    <TodoCard key={todo.id} todo={todo} />
                ))}
            </CardContent>
        </Card>
    )
}

export default TodoListSection