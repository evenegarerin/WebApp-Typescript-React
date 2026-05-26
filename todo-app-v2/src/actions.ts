"use server";

import type { Todo } from "@/types/Todo"
import type { TodoList } from "@/types/TodoList"
import { todoStatuses, type TodoStatus } from "@/types/TodoStatus"

import { store } from "@/lib/todoStore";

import { ExampleTodos } from "@/debug_test_data/Todos"
import { ExampleTodoLists } from "@/debug_test_data/TodoLists"

import { type TodoInput, todoInputSchema } from "@/schemas/Todo";

import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { revalidatePath } from "next/cache";
import { TodoListInput, todoListInputSchema } from "@/schemas/TodoList";

let todos: Todo[] = ExampleTodos
let todoLists: TodoList[] = ExampleTodoLists

export const getTodos = async (): Promise<Todo[]> => {
    return store.todos;
};

export const getTodo = async (id: number): Promise<Todo | undefined> => {
    return store.todos.find(t => t.id === id);
};

export const addTodo = async (input: TodoInput): Promise<ActionResult> => {
    const result = todoInputSchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid input."
        };
    }

    const data = result.data;

    store.todos.push({
        id: Date.now(),
        listId: data.listId,
        name: data.name,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate === "" ? null : data.dueDate,
        tags: data.tags,
        status: data.status
    });

    revalidatePath("/");
    return { success: true, message: "Todo created successfully." };
};

export const updateTodo = async (id: number, input: TodoInput): Promise<ActionResult> => {
    const result = todoInputSchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid Input."
        };
    }

    const index = store.todos.findIndex(t => t.id === id);

    if (index === -1) {
        return { success: false, message: "Todo not found." };
    }

    const data = result.data;

    store.todos[index] = {
        ...store.todos[index],
        ...data,
        dueDate: data.dueDate === "" ? null : data.dueDate
    };

    revalidatePath("/");
    return { success: true, message: "Todo updated successfully." };
};

export const deleteTodo = async (id: number): Promise<ActionResult> => {
    const exists = store.todos.some(t => t.id === id);

    if (!exists) {
        return { success: false, message: "Todo not found." };
    }

    store.todos = store.todos.filter(t => t.id !== id);

    revalidatePath("/");
    return { success: true, message: "Todo deleted successfully." };
};

export const toggleTodo = async (id: number): Promise<ActionResult> => {
    const exists = store.todos.some(t => t.id === id);

    if (!exists) {
        return { success: false, message: "Todo not found." };
    }

    const nextStatus = (current: TodoStatus): TodoStatus => {
        const index = todoStatuses.indexOf(current);
        return todoStatuses[(index + 1) % todoStatuses.length];
    };

    store.todos = store.todos.map(t =>
        t.id === id ? { ...t, status: nextStatus(t.status) } : t
    );

    revalidatePath("/");
    return { success: true, message: "Status updated." };
};

export const getTodoLists = async (): Promise<TodoList[]> => {
    return store.todoLists;
};

export const addTodoList = async (newList: TodoListInput): Promise<ActionResult> => {
    const result = todoListInputSchema.safeParse(newList);

    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "Invalid Input."
        };
    }

    const data = result.data;

    store.todoLists.push({
        id: Date.now(),
        name: data.name,
        description: data.description ? data.description : undefined
    });

    revalidatePath("/");
    return { success: true, message: "TodoList created successfully." };
};

export const deleteTodoList = async (id: number): Promise<ActionResult> => {
    const exists = store.todoLists.some(tl => tl.id === id);

    if (!exists) {
        return { success: false, message: "Todo list not found." };
    }

    store.todoLists = store.todoLists.filter(tl => tl.id !== id);
    store.todos = store.todos.filter(t => t.listId !== id);

    revalidatePath("/");
    return { success: true, message: "Todo list deleted." };
};