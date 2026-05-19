"use client"

import { Card, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Todo } from "@/types/Todo";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from "next/navigation";

interface TodoCardProps {
    todo: Todo
    toggleTodo: (id: number) => void
    dropTodo: (id: number) => void
}

const TodoCard = ({ todo, toggleTodo, dropTodo }: TodoCardProps) => {
    const router = useRouter();

    const [openDeletionConformation, setOpenDeletionConformation] = useState(false);

    const handleDeleteClick = () => {
        setOpenDeletionConformation(true);
    };

    const handleConfirmDelete = () => {
        dropTodo(todo.id);
    };

    return (
        <>
            <Card variant="outlined" sx={{ margin: 2 }}>
                <CardHeader title={todo.name} subheader={todo.priority + " - " + todo.status} />

                <CardContent>
                    {todo.description && <Typography>{todo.description}</Typography>}
                    {todo.dueDate && <Typography>{todo.dueDate}</Typography>}

                    {todo.tags.length > 0 && (
                        <Typography>{todo.tags.map((tag, index) => (
                            <span key={index}>
                                {tag}{index < todo.tags.length - 1 ? ", " : ""}
                            </span>
                        ))}</Typography>
                    )}
                </CardContent>

                <CardActions>
                    <IconButton onClick={() => toggleTodo(todo.id)}>
                        <DoneIcon />
                    </IconButton>

                    <IconButton onClick={() => router.push(`/todo/${todo.id}`)}>
                        <RemoveRedEyeIcon />
                    </IconButton>

                    <IconButton onClick={handleDeleteClick}>
                        <DeleteForeverIcon />
                    </IconButton>
                </CardActions>
            </Card>

            <ConfirmDialog
                open={openDeletionConformation}
                title="Delete Todo"
                description={`Are you sure you want to delete Todo: "${todo.name}"? This action cannot be undone.`}
                onClose={() => setOpenDeletionConformation(false)}
                onConfirm={() => {
                    handleConfirmDelete();
                    setOpenDeletionConformation(false);
                }}
            />
        </>
    );
};

export default TodoCard