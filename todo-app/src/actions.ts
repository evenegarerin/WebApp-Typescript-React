"use server";

import type { Todo } from "@/types/Todo"
import type { TodoList } from "@/types/TodoList"
import { nextTodoStatus } from "@/types/TodoStatus"

import { type TodoInput, todoInputSchema } from "@/schemas/Todo";

import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { TodoListInput, todoListInputSchema } from "@/schemas/TodoList";
import { db } from "@/db";
import { todoLists, todos } from "@/db/schema";
import { eq } from "drizzle-orm";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const getSession = async () => {
    return auth.api.getSession({
        headers: await headers(),
    })
};

export const getTodos = async (): Promise<Todo[]> => {
    const session = await getSession()

    if (!session) {
        return []
    }

    // Sortierung auf DB-Ebene statt im Client — skaliert auch bei großen Listen
    return db
        .select()
        .from(todos)
        .where(eq(todos.userId, session.user.id))
        .orderBy(todos.dueDate)
};

export const todoNameExists = async (name: string): Promise<boolean> => {
    const result = await db
        .select({ id: todos.id })
        .from(todos)
        .where(eq(todos.name, name.trim()))
        .limit(1)

    return result.length > 0
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
    const session = await getSession()

    if (!session) {
        return {
            success: false,
            message: "Not authenticated."
        };
    }

    const result = todoInputSchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input."
        };
    }

    await db.insert(todos).values({
        ...result.data,
        userId: session.user.id,
    })

    return { success: true };
};

export const updateTodo = async (id: number, input: TodoInput): Promise<ActionResult> => {
    const result = todoInputSchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input."
        };
    }

    await db
        .update(todos)
        .set(result.data)
        .where(eq(todos.id, id))

    return { success: true };
};

export const deleteTodo = async (id: number): Promise<ActionResult> => {
    await db.delete(todos).where(eq(todos.id, id));

    return { success: true };
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

    todo.status = nextTodoStatus(todo.status)

    await db
        .update(todos)
        .set(todo)
        .where(eq(todos.id, id))

    return { success: true };
};

export const getTodoLists = async (): Promise<TodoList[]> => {
    const session = await getSession()

    if (!session) {
        return []
    }

    return db
        .select()
        .from(todoLists)
        .where(eq(todoLists.userId, session.user.id))
};

export const addTodoList = async (newList: TodoListInput): Promise<ActionResult> => {
    const session = await getSession()

    if (!session) {
        return {
            success: false,
            message: "Not authenticated."
        };
    }

    const result = todoListInputSchema.safeParse(newList);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input."
        };
    }

    return db.insert(todoLists).values({
        ...result.data,
        userId: session.user.id,
    });
};

export const deleteTodoList = async (id: number): Promise<ActionResult> => {
    await db.delete(todoLists).where(eq(todoLists.id, id));

    return { success: true };
};