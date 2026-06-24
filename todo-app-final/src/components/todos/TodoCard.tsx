"use client";

import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { ToggleStatusIcon, DeleteIcon, EditIcon } from "@/components/common/icons";
import { Todo } from "@/types/Todo";
import { TodoPriority } from "@/types/TodoPriority";
import { TodoStatus } from "@/types/TodoStatus";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { truncate } from "@/lib/text";

interface TodoCardProps {
    todo: Todo;
    toggleTodo: (id: number) => void;
    dropTodo: (id: number) => void;
    highlight?: boolean;
}

export const priorityBorder: Record<TodoPriority, string> = {
    high: "error.main",
    medium: "warning.main",
    low: "divider",
};

export const priorityChipColor: Record<TodoPriority, "error" | "warning" | "default"> = {
    high: "error",
    medium: "warning",
    low: "default",
};

export const statusChipColor: Record<TodoStatus, "success" | "info" | "default"> = {
    done: "success",
    "in-progress": "info",
    open: "default",
};

const TodoCard = ({ todo, toggleTodo, dropTodo, highlight }: TodoCardProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const tPriority = useTranslations("Priority");
    const tStatus = useTranslations("Status");
    const tConf = useTranslations("Conformation");
    const tActions = useTranslations("Actions");
    const format = useFormatter();

    const [openDeletionConformation, setOpenDeletionConformation] = useState(false);

    const isDone = todo.status === "done";

    const handleDeleteClick = () => {
        setOpenDeletionConformation(true);
    };

    const handleConfirmDelete = () => {
        dropTodo(todo.id);
    };

    const handleEdit = () => {
        queryClient.setQueryData(["todo", todo.id], todo);
        router.push(`/todos/${todo.id}`);
    };

    return (
        <>
            <Card
                variant="outlined"
                sx={{
                    margin: 2,
                    width: 305,
                    display: "flex",
                    flexDirection: "column",
                    border: highlight ? "2px solid darkred" : undefined,
                    borderColor: highlight
                        ? "darkred"
                        : isDone
                          ? "divider"
                          : priorityBorder[todo.priority],
                    opacity: isDone ? 0.6 : 1,
                }}
            >
                <CardHeader
                    title={
                        <Typography
                            variant="h6"
                            sx={{ textDecoration: isDone ? "line-through" : "none" }}
                        >
                            {truncate(todo.name, 40)}
                        </Typography>
                    }
                    subheader={
                        <Stack direction="column">
                            <Stack direction="row" spacing={1} mt={0.5}>
                                <Chip
                                    size="small"
                                    color={isDone ? "default" : priorityChipColor[todo.priority]}
                                    label={tPriority(todo.priority)}
                                />
                                <Chip
                                    size="small"
                                    color={statusChipColor[todo.status]}
                                    label={tStatus(todo.status)}
                                />
                            </Stack>

                            {todo.dueDate && (
                                <Typography>
                                    {format.dateTime(new Date(todo.dueDate), { dateStyle: "long" })}
                                </Typography>
                            )}
                        </Stack>
                    }
                />

                <CardContent>
                    {todo.description && (
                        <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                            {truncate(todo.description, 120)}
                        </Typography>
                    )}

                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        {todo.tags.slice(0, 3).map((tag) => (
                            <Chip key={tag} label={tag} />
                        ))}
                    </Stack>
                </CardContent>

                <CardActions sx={{ marginTop: "auto" }}>
                    <Tooltip title={tActions("toggleStatus")}>
                        <IconButton color="success" onClick={() => toggleTodo(todo.id)}>
                            <ToggleStatusIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={tActions("editTodo")}>
                        <IconButton onClick={handleEdit}>
                            <EditIcon color="action" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={tActions("deleteTodo")}>
                        <IconButton color="error" onClick={handleDeleteClick}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
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

export default TodoCard;
