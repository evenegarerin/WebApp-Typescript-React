import { sqliteTable, text, integer, } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { todoStatuses } from "@/types/TodoStatus"
import { todoPriorities } from "@/types/TodoPriority"

export const todos = sqliteTable("todos", {
    id: integer("id").primaryKey({ autoIncrement: true }),

    name: text("name")
        .notNull(),

    listId: integer("list_id")
        .notNull()
        .references(() => todoLists.id, {
            onDelete: "cascade"
        }),

    description: text("description")
        .notNull(),

    priority: text("priority")
        .$type<(typeof todoPriorities)[number]>()
        .notNull(),

    dueDate: text("due_date"),

    tags: text("tags", {
        mode: "json"
    }).$type<string[]>()
        .notNull()
        .default([]),

    status: text("status")
        .$type<(typeof todoStatuses)[number]>()
        .notNull(),
})

export const todoLists = sqliteTable("todo_lists", {
    id: integer("id").primaryKey({ autoIncrement: true }),

    name: text("name")
        .notNull(),

    description: text("description")
})

export const todoInsertSchema =
    createInsertSchema(todos)
export const todoSelectSchema =
    createSelectSchema(todos)

export const todoListInsertSchema =
    createInsertSchema(todoLists)
export const todoListSelectSchema =
    createSelectSchema(todoLists)