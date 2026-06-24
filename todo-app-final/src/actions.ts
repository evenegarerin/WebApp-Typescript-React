"use server";

import type { Todo } from "@/types/Todo";
import type { TodoList } from "@/types/TodoList";
import { nextTodoStatus } from "@/types/TodoStatus";

import { type TodoInput, todoInputSchema } from "@/schemas/Todo";

import { TodoListInput, todoListInputSchema } from "@/schemas/TodoList";
import { db } from "@/db";
import { todoLists, todos } from "@/db/schema";
import { and, eq } from "drizzle-orm";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type ActionResult = { success: boolean; message?: string };

const NOT_AUTHENTICATED: ActionResult = {
    success: false,
    message: "Not authenticated.",
};

const getSession = async () => {
    return auth.api.getSession({
        headers: await headers(),
    });
};

const requireUserId = async (): Promise<string | null> => {
    const session = await getSession();
    return session?.user.id ?? null;
};

export const getTodos = async (): Promise<Todo[]> => {
    const userId = await requireUserId();
    if (!userId) return [];

    return db.select().from(todos).where(eq(todos.userId, userId)).orderBy(todos.dueDate);
};

export const todoNameExists = async (name: string): Promise<boolean> => {
    const userId = await requireUserId();
    if (!userId) return false;

    const result = await db
        .select({ id: todos.id })
        .from(todos)
        .where(and(eq(todos.userId, userId), eq(todos.name, name.trim())))
        .limit(1);

    return result.length > 0;
};

export const getTodo = async (id: number): Promise<Todo | null> => {
    const userId = await requireUserId();
    if (!userId) return null;

    const result = await db
        .select()
        .from(todos)
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
        .limit(1);

    return result[0] ?? null;
};

export const addTodo = async (input: TodoInput): Promise<ActionResult> => {
    const userId = await requireUserId();
    if (!userId) return NOT_AUTHENTICATED;

    const result = todoInputSchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input.",
        };
    }

    await db.insert(todos).values({
        ...result.data,
        userId,
    });

    return { success: true };
};

export const updateTodo = async (id: number, input: TodoInput): Promise<ActionResult> => {
    const userId = await requireUserId();
    if (!userId) return NOT_AUTHENTICATED;

    const result = todoInputSchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input.",
        };
    }

    await db
        .update(todos)
        .set(result.data)
        .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    return { success: true };
};

export const deleteTodo = async (id: number): Promise<ActionResult> => {
    const userId = await requireUserId();
    if (!userId) return NOT_AUTHENTICATED;

    await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, userId)));

    return { success: true };
};

export const toggleTodo = async (id: number): Promise<ActionResult> => {
    const userId = await requireUserId();
    if (!userId) return NOT_AUTHENTICATED;

    const todo = await getTodo(id);

    if (!todo) {
        return { success: false, message: "Todo not found." };
    }

    await db
        .update(todos)
        .set({ status: nextTodoStatus(todo.status) })
        .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    return { success: true };
};

export const getTodoLists = async (): Promise<TodoList[]> => {
    const userId = await requireUserId();
    if (!userId) return [];

    return db.select().from(todoLists).where(eq(todoLists.userId, userId));
};

export const addTodoList = async (newList: TodoListInput): Promise<ActionResult> => {
    const userId = await requireUserId();
    if (!userId) return NOT_AUTHENTICATED;

    const result = todoListInputSchema.safeParse(newList);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input.",
        };
    }

    await db.insert(todoLists).values({
        ...result.data,
        userId,
    });

    return { success: true };
};

export const updateTodoList = async (id: number, input: TodoListInput): Promise<ActionResult> => {
    const userId = await requireUserId();
    if (!userId) return NOT_AUTHENTICATED;

    const result = todoListInputSchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input.",
        };
    }

    await db
        .update(todoLists)
        .set(result.data)
        .where(and(eq(todoLists.id, id), eq(todoLists.userId, userId)));

    return { success: true };
};

export const deleteTodoList = async (id: number): Promise<ActionResult> => {
    const userId = await requireUserId();
    if (!userId) return NOT_AUTHENTICATED;

    await db.delete(todoLists).where(and(eq(todoLists.id, id), eq(todoLists.userId, userId)));

    return { success: true };
};
