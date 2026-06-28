import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { todoLists } from "@/db/schema";

export const todoListInputSchema = createInsertSchema(todoLists, {
    name: (s) =>
        s
            .trim()
            .min(3, "Name braucht mindestens 3 Zeichen")
            .max(40, "Name darf höchstens 40 Zeichen haben"),
    description: (s) => s.max(126, "Beschreibung darf höchstens 126 Zeichen haben"),
})
    .omit({ id: true, userId: true })
    .required({ description: true });

export type TodoListInput = z.infer<typeof todoListInputSchema>;
