import { TodoStatus } from "@/types/TodoStatus"
import { TodoPriority } from "@/types/TodoPriority"

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