import type { TodoStatus } from "@/types/TodoStatus";
import type { TodoPriority } from "@/types/TodoPriority";

export interface Todo {
    id: number;
    listId: number;
    name: string;
    description: string;
    priority: TodoPriority;
    dueDate: string | null; // ISO-Date (YYYY-MM-DD) or null
    tags: string[];
    status: TodoStatus;
    userId: string | null;
}
