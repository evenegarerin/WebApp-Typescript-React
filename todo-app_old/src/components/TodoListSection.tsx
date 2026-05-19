import { Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Button from '@mui/material/Button';
import { CardHeader, TextField } from '@mui/material';
import { todoStatuses, type Todo, type TodoList, type TodoStatus } from "../models"
import TodoCard from "./TodoCard"
import { useState } from "react";

interface TodoListSectionProps {
    list: TodoList,
    todos: Array<Todo>
    addTodo: (todo: Todo) => void
    updateTodo: (todo: Todo) => void
    dropTodo: (todo: Todo) => void
}

const TodoListSection = ({ list, todos, addTodo, updateTodo, dropTodo }: TodoListSectionProps) => {
    const [title, setTitle] = useState("")

    const filterOptions = ["all", ...todoStatuses] as const

    const [filter, setFilter] = useState(filterOptions[0])

    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardHeader title={list.name} subheader={list.description} />

            <CardActions sx={{ flexDirection: "column" }}>
                <FormControl>
                    <TextField variant="outlined" placeholder="tilte" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                    <Button onClick={() => {
                        const newTodo: Todo = {
                            status: "open" as const,
                            tags: [] as string[],
                            priority: "medium" as const,
                            id: todos[todos.length - 1].id + 1,
                            name: title,
                            listId: list.id
                        }

                        addTodo(newTodo)
                        setTitle("")
                    }}>create new todo</Button>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="filter-input-label">Filter</InputLabel>
                    <Select
                        labelId="filter-input-label"
                        id="filter-label"
                        value={filter}
                        label="Age"
                        onChange={(e) => setFilter(e.target.value)}
                    >

                        {filterOptions.map(option => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </CardActions>

            <CardContent>
                {filterTodos(todos, filter).map(todo => (
                    <TodoCard key={todo.id} todo={todo} updateTodo={updateTodo} dropTodo={dropTodo} />
                ))}
            </CardContent>
        </Card>
    )
}

const filterTodos = (todos: Todo[], filter: TodoStatus | "all"): Todo[] => {
    if (filter === "all") {
        return todos
    }

    return todos.filter(t => t.status === filter)
}

export default TodoListSection