import { z } from "zod";

import { createInsertSchema } from "drizzle-zod";
import { todos } from "@/db/schema";
import { todoPriorities } from "@/types/TodoPriority";
import { todoStatuses } from "@/types/TodoStatus";

export const todoInputSchema = createInsertSchema(todos, {
    name: (s) =>
        s
            .trim()
            .min(3, "Name braucht mindestens 3 Zeichen")
            .max(100, "Name darf höchstens 100 Zeichen haben"),
    description: (s) => s.max(500, "Beschreibung darf höchstens 500 Zeichen haben"),
    listId: z.number().int().positive("Bitte eine Liste auswählen"),
    priority: z.enum(todoPriorities),
    status: z.enum(todoStatuses),
    tags: z.array(
        z
            .string()
            .trim()
            .min(1, "Tag darf nicht leer sein")
            .max(20, "Tag darf höchstens 20 Zeichen haben"),
    ),
    dueDate: z.union([
        z.null(),
        z.literal(""),
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum im Format YYYY-MM-DD"),
    ]),
}).omit({
    id: true,
    userId: true,
});

export type TodoInput = z.infer<typeof todoInputSchema>;
