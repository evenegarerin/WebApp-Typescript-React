export type Status = "open" | "in-progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface Todo {
    id: number,
    name: string,
    description?: string,
    status: Status,
    priority: Priority,
    dueDate?: string,
    tags: string[],
    listId: number
}

export interface TodoList {
    id: number,
    name: string,
    description?: string,
}