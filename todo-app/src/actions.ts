"use server"

import { ExampleTodoLists, ExampleTodos } from "./data"
import { todoStatuses, type Todo, type TodoStatus } from "./models"

let todos = ExampleTodos

export const getTodos = async (): Promise<Todo[]> => {
    return todos
}

export const addTodo = async (newTodo: Todo): Promise<Todo[]> => {
    todos.push(newTodo)

    return todos
}

export const deleteTodo = async (id: number): Promise<Todo[]> => {
    todos = todos.filter(
        t => t.id !== id
    )

    return todos
}

export const toggleTodo = async (id: number): Promise<Todo[]> => {
    const nextStatus = (current: TodoStatus): TodoStatus => {
        const index = todoStatuses.indexOf(current);
        return todoStatuses[(index + 1) % todoStatuses.length];
    }

    todos = todos.map(t =>
        t.id === id
            ? {
                ...t,
                status: nextStatus(t.status)
            }
            : t
    )

    return todos
}