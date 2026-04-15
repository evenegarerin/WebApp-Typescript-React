export type TodoStatus = "open" | "in-progress" | "done";
export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
    id: number,
    name: string,
    description?: string,
    status: TodoStatus,
    priority: TodoPriority,
    dueDate?: string,
    tags: string[],
    listId: number
}

export interface TodoList {
    id: number,
    name: string,
    description?: string,
}