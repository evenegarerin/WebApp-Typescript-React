import { z } from "zod"

export const todoListInputSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name can not be empty.")
        .max(36, "No more than 36 characters."),

    description: z.string()
        .trim()
        .max(300, "No more than 300 characters.")
        .nullable()
})

export type TodoListInput = z.infer<typeof todoListInputSchema>