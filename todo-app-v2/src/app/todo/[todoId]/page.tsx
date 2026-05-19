"use client"

import { deleteTodo, getTodo, toggleTodo } from "@/actions";
import TodoCard from "@/components/TodoCard";
import { Todo } from "@/types/Todo";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
    const params = useParams();
    const todoId = Number(params.todoId)
    const router = useRouter();

    const [todo, setTodo] = useState<Todo | undefined>(undefined)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteTodo = async (id: number) => {
        await deleteTodo(id);
        router.push("/");
    };

    const handleToggleTodo = async (id: number) => {
        const updatedTodos = await toggleTodo(id);

        const updatedTodo = updatedTodos.find(t => t.id === todoId)

        setTodo(updatedTodo)
    };

    useEffect(() => {
        const loadTodo = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getTodo(todoId);

                if (!data) {
                    setError("Todo not found");
                    setTodo(undefined);
                    return;
                }

                setTodo(data);
            } catch (e) {
                setError("Failed to load todo");
                setTodo(undefined);
            } finally {
                setLoading(false);
            }
        };

        loadTodo();
    }, [todoId]);

    if (loading) {
        return <p>Loading todo...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!todo) return <p>No todo found</p>;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TodoCard
                todo={todo}
                toggleTodo={handleToggleTodo}
                dropTodo={handleDeleteTodo}
            />
        </Box>
    );
}