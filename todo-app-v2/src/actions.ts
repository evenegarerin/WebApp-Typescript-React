"use server";

import type { Todo } from "@/types/Todo"
import type { TodoList } from "@/types/TodoList"
import { todoStatuses, type TodoStatus } from "@/types/TodoStatus"

import { ExampleTodos } from "@/debug_test_data/Todos"
import { ExampleTodoLists } from "@/debug_test_data/TodoLists"
import { TodoInput, todoInputSchema } from "@/schemas";
import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { revalidatePath } from "next/cache";

let todos: Todo[] = ExampleTodos
let todoLists: TodoList[] = ExampleTodoLists

export const getTodos = async (): Promise<Todo[]> => {
    return todos
}

export const getTodo = async (id: number): Promise<Todo | undefined> => {
    return todos.find(t => t.id === id)
}

export const addTodo = async (input: TodoInput): Promise<ActionResult> => {
    todoInputSchema.safeParse(input)

    const result = todoInputSchema.safeParse(input)

    if (!result.success) {
        return {
            ok: false,
            message: result.error.issues[0]?.message ?? "Invalid input."
        }
    }

    const data = result.data

    todos.push({
        id: Number(crypto.randomUUID()),

        listId: data.listId,
        name: data.name,
        description: data.description,

        priority: data.priority,

        dueDate: data.dueDate === "" ? null : data.dueDate,

        tags: data.tags,

        status: data.status
    })

    revalidatePath("/")

    return {
        success: true,
        message: "Todo created successfully."
    }
}

export const updateTodo = async (id: number, input: TodoInput): Promise<ActionResult> => {
    todoInputSchema.safeParse(input)

    const result = todoInputSchema.safeParse(input)

    if (!result.success) {
        return {
            ok: false,
            message: result.error.issues[0]?.message ?? "Invalid Input: \"input\"."
        }
    }

    const index = todos.findIndex(t => t.id === id)

    if (index === -1) {
        return {
            success: false,
            message: "Todo not found."
        }
    }

    const data = result.data

    todos[index] = {
        ...todos[index],

        listId: data.listId,
        name: data.name,
        description: data.description,

        priority: data.priority,

        dueDate: data.dueDate === "" ? null : data.dueDate,

        tags: data.tags,

        status: data.status
    }

    revalidatePath("/")

    return {
        success: true,
        message: "Todo updated successfully."
    }
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