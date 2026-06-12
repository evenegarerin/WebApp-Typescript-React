import { z } from "zod"
import { createInsertSchema } from "drizzle-zod"
import { todoLists } from "@/db/schema"

export const todoListInputSchema = createInsertSchema(todoLists)
    .omit({ id: true })

export type TodoListInput = z.infer<typeof todoListInputSchema>