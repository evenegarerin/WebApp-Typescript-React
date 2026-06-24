import type { Todo } from "@/types/Todo";

export const matchesQuery = (todo: Todo, query: string): boolean => {
    const q = query.trim().toLowerCase();
    if (!q) return false;

    return (
        todo.name.toLowerCase().includes(q) ||
        todo.tags.some((tag) => tag.toLowerCase().includes(q))
    );
};
