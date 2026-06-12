import { z } from "zod"

import { createInsertSchema } from "drizzle-zod"
import { todos } from "@/db/schema"
import { todoPriorities } from "@/types/TodoPriority";
import { todoStatuses } from "@/types/TodoStatus";

export const todoInputSchema = createInsertSchema(todos, {
    priority: z.enum(todoPriorities),
    status: z.enum(todoStatuses),
}).omit({
    id: true,
});

export type TodoInput = z.infer<typeof todoInputSchema>