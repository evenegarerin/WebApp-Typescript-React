"use client"

import { Card, CardActions, CardContent, CardHeader, Chip, IconButton, Stack, Typography } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Todo } from "@/types/Todo";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface TodoCardProps {
    todo: Todo
    toggleTodo: (id: number) => void
    dropTodo: (id: number) => void
}

const TodoCard = ({ todo, toggleTodo, dropTodo }: TodoCardProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const tPriority = useTranslations("Priority");
    const tStatus = useTranslations("Status");
    const tConf = useTranslations("Conformation");

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
                <CardHeader title={todo.name} subheader={tPriority(todo.priority) + " - " + tStatus(todo.status)} />

                <CardContent>
                    {todo.description && <Typography>{todo.description}</Typography>}
                    {todo.dueDate && <Typography>{todo.dueDate}</Typography>}

                    <Stack
                        direction="row"
                        spacing={1}
                        mt={1}
                        flexWrap="wrap"
                    >
                        {todo.tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                            />
                        ))}
                    </Stack>
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
                title={tConf("deleteTodoTitle")}
                description={tConf("deleteTodoText", { name: todo.name })}
                onClose={() => setOpenDeletionConformation(false)}
                onConfirm={async () => {
                    await handleConfirmDelete();
                    setOpenDeletionConformation(false);
                    await queryClient.invalidateQueries({ queryKey: ["todos"] });
                }}
            />
        </>
    );
};

export default TodoCard