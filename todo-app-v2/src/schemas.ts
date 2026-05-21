import { z } from "zod"

import { todoStatuses } from "@/types/TodoStatus"
import { todoPriorities } from "@/types/TodoPriority"

export const todoInputSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name can not be empty.")
        .max(36, "No more than 36 characters."),

    listId: z.number(),

    description: z.string()
        .trim()
        .min(1, "Description can not be empty.")
        .max(300, "No more than 300 characters."),

    priority: z.enum(todoPriorities),

    dueDate: z.string().nullable(),

    tags: z.array(z.string()),

    status: z.enum(todoStatuses)
})

export type TodoInput = z.infer<typeof todoInputSchema>


// export interface Todo {
//     id: number
//     listId: number
//     name: string
//     description: string
//     priority: TodoPriority
//     dueDate: string | null // ISO-Datum (YYYY-MM-DD) oder null
//     tags: string[]
//     status: TodoStatus
// }