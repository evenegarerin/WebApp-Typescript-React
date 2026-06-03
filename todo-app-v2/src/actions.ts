"use server";

import type { Todo } from "@/types/Todo"
import type { TodoList } from "@/types/TodoList"
import { todoStatuses, type TodoStatus } from "@/types/TodoStatus"

import { type TodoInput, todoInputSchema } from "@/schemas/Todo";

import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { TodoListInput, todoListInputSchema } from "@/schemas/TodoList";
import { db } from "@/db";
import { todoLists, todos } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getTodos = async (): Promise<Todo[]> => {
    return db.select().from(todos)
};

export const getTodo = async (id: number): Promise<Todo | undefined> => {
    const result = await db
        .select()
        .from(todos)
        .where(eq(todos.id, id))
        .limit(1)

    return result[0]
};

export const addTodo = async (input: TodoInput): Promise<ActionResult> => {
    const result = todoInputSchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input."
        };
    }

    return db.insert(todos).values(result.data)
};

export const updateTodo = async (id: number, input: TodoInput): Promise<ActionResult> => {
    const result = todoInputSchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input."
        };
    }

    return db
        .update(todos)
        .set(result.data)
        .where(eq(todos.id, id))
};

export const deleteTodo = async (id: number): Promise<ActionResult> => {
    return db.delete(todos).where(eq(todos.id, id))
};

export const toggleTodo = async (id: number): Promise<ActionResult> => {
    const result = await db
        .select()
        .from(todos)
        .where(eq(todos.id, id))
        .limit(1)

    const todo = result[0]

    if (!todo) {
        return { success: false, message: "Todo not found." };
    }

    const nextStatus = (current: TodoStatus): TodoStatus => {
        const index = todoStatuses.indexOf(current);
        return todoStatuses[(index + 1) % todoStatuses.length];
    };

    todo.status = nextStatus(todo.status)

    return db
        .update(todos)
        .set(todo)
        .where(eq(todos.id, id))
};

export const getTodoLists = async (): Promise<TodoList[]> => {
    return db.select().from(todoLists)
};

export const addTodoList = async (newList: TodoListInput): Promise<ActionResult> => {
    const result = todoListInputSchema.safeParse(newList);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input."
        };
    }

    return db.insert(todoLists).values(result.data)
};

export const deleteTodoList = async (id: number): Promise<ActionResult> => {
    return db.delete(todoLists).where(eq(todoLists.id, id))
};