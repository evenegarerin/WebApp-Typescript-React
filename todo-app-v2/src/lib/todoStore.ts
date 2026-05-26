import type { Todo } from "@/types/Todo";
import type { TodoList } from "@/types/TodoList";
import { ExampleTodos } from "@/debug_test_data/Todos";
import { ExampleTodoLists } from "@/debug_test_data/TodoLists";

export type Store = {
    todos: Todo[];
    todoLists: TodoList[];
};

const globalForStore = globalThis as unknown as {
    store: Store | undefined;
};

export const store: Store =
    globalForStore.store ??
    (globalForStore.store = {
        todos: ExampleTodos,
        todoLists: ExampleTodoLists,
    });