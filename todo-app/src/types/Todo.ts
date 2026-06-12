import type { TodoStatus } from "@/types/TodoStatus"
import type { TodoPriority } from "@/types/TodoPriority"

export interface Todo {
    id: number
    listId: number
    name: string
    description: string
    priority: TodoPriority
    dueDate: string | null // ISO-Datum (YYYY-MM-DD) oder null
    tags: string[]
    status: TodoStatus
    userId: string | null
}