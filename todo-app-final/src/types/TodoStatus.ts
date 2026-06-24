export type TodoStatus = "open" | "in-progress" | "done";
export const todoStatuses: TodoStatus[] = ["open", "in-progress", "done"] as const;

export const nextTodoStatus = (current: TodoStatus): TodoStatus => {
    const index = todoStatuses.indexOf(current);
    return todoStatuses[(index + 1) % todoStatuses.length];
};
