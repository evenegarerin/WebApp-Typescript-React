"use client"

import { useState, useTransition } from "react"
import { Box, Grid } from "@mui/material"
import Header from "./components/Header"
import Footer from "./components/Footer"
import TodoListSection from "./components/TodoListSection"
import Statistics from "./components/Statistics"
import { ExampleTodoLists } from "../src/data"
import type { Todo } from "../src/models"
import { getTodos, addTodo, deleteTodo, toggleTodo } from "../src/actions"
import AppLayout from "./components/AppLayout"

type Props = {
    initialTodos: Todo[]
}

const getTodosByList = (todos: Todo[], listId: number): Todo[] => {
    return todos.filter(todo => todo.listId === listId)
}

export default function TodoApp({ initialTodos }: Props) {
    const [todos, setTodos] = useState(initialTodos)
    const [lists] = useState(ExampleTodoLists)
    const [isPending, startTransition] = useTransition()

    const refreshTodos = async () => {
        const updated = await getTodos()
        setTodos(updated)
    }

    const handleAddTodo = (newTodo: Todo) => {
        startTransition(async () => {
            await addTodo(newTodo)
            await refreshTodos()
        })
    }

    const handleDeleteTodo = (id: number) => {
        startTransition(async () => {
            await deleteTodo(id)
            await refreshTodos()
        })
    }

    const handleToggleTodo = (id: number) => {
        startTransition(async () => {
            await toggleTodo(id)
            await refreshTodos()
        })
    }

    return (
        <AppLayout>
            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', width: '100%', flex: '1' }}>

                <Grid container spacing={2} sx={{ maxWidth: 1100, alignSelf: "center" }}>
                    {lists.map(todoList => (
                        <Grid key={todoList.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <TodoListSection
                                list={todoList}
                                todos={getTodosByList(todos, todoList.id)}
                                addTodo={handleAddTodo}
                                toggleTodo={handleToggleTodo}
                                dropTodo={handleDeleteTodo}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Statistics todos={todos} />
        </AppLayout>
    )
}