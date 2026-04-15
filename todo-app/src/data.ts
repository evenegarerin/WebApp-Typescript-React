import type { Todo, TodoList } from "./models"

const list_one: TodoList = {
    id: 0,
    name: "Arbeit"
}

const list_two: TodoList = {
    id: 1,
    name: "Private",
    description: "list description"
}

const list_three: TodoList = {
    id: 2,
    name: "Einkauf"
}

const baseTodo = {
    status: "open" as const,
    tags: [] as string[],
    priority: "medium" as const,
};

const todo1: Todo = {
    ...baseTodo,
    id: 1,
    name: "Präsentation vorbereiten",
    description: "Slides für Meeting erstellen",
    listId: 0,
};

const todo2: Todo = {
    ...baseTodo,
    id: 2,
    name: "Code Review",
    status: "in-progress",
    priority: "high",
    tags: ["Arbeit"],
    listId: 0,
};

const todo3: Todo = {
    ...baseTodo,
    id: 3,
    name: "Joggen gehen",
    priority: "low",
    tags: ["Gesundheit"],
    dueDate: "2026-04-02",
    listId: 2,
};

const todo4: Todo = {
    ...baseTodo,
    id: 4,
    name: "Steuererklärung",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-04-30",
    tags: ["Finanzen"],
    listId: 1,
};

const todo5: Todo = {
    ...baseTodo,
    id: 5,
    name: "Buch lesen",
    status: "done",
    priority: "low",
    tags: ["Freizeit"],
    listId: 2,
};

const todo6: Todo = {
    ...baseTodo,
    id: 6,
    name: "E-Mails beantworten",
    priority: "medium",
    status: "in-progress",
    tags: ["Arbeit, Private, Tags"],
    listId: 0,
};

const todo7: Todo = {
    ...baseTodo,
    id: 7,
    name: "Urlaub planen",
    description: "Flüge und Hotel vergleichen",
    priority: "high",
    tags: ["Privat", "Reisen"],
    dueDate: "2026-05-01",
    listId: 1,
};

export const ExampleTodos = [todo1, todo2, todo3, todo4, todo5, todo6, todo7]

export const ExampleTodoLists = [list_one, list_two, list_three]
