"use server";

import type { Todo } from "@/types/Todo"
import type { TodoList } from "./types/TodoList"
import { todoStatuses, type TodoStatus } from "./types/TodoStatus"

import { ExampleTodos } from "./debug_test_data/Todos"
import { ExampleTodoLists } from "./debug_test_data/TodoLists"

let todos: Todo[] = ExampleTodos
let todoLists: TodoList[] = ExampleTodoLists

export const getTodos = async (): Promise<Todo[]> => {
    return todos
}

export const getTodo = async (id: number): Promise<Todo | undefined> => {
    return todos.find(t => t.id === id)
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

export const getTodoLists = async (): Promise<TodoList[]> => {
    return todoLists
}

export const addTodoList = async (newTodoList: TodoList): Promise<TodoList[]> => {
    todoLists.push(newTodoList)

    return todoLists
}

export const deleteTodoList = async (id: number): Promise<TodoList[]> => {
    todoLists = todoLists.filter(
        tl => tl.id !== id
    )

    return todoLists
}