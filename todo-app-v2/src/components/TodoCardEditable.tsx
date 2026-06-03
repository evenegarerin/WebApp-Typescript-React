"use client";

import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import DoneIcon from "@mui/icons-material/Done";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";

import type { Todo } from "@/types/Todo";

import { TodoStatus, todoStatuses } from "@/types/TodoStatus";
import { todoPriorities, TodoPriority } from "@/types/TodoPriority";
import { TodoInput, todoInputSchema } from "@/schemas/Todo";

import ConfirmDialog from "@/components/ConfirmDialog";
import {
    deleteTodo,
    getTodo,
    toggleTodo,
    updateTodo,
} from "@/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
    todoId: number;
}

type EditableField =
    | "name"
    | "description"
    | "priority-status"
    | "dueDate"
    | "tags"
    | null;

export default function TodoCardEditable({ todoId }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: todo, isLoading, isError } = useQuery({
        queryKey: ["todo", todoId],
        queryFn: () => getTodo(todoId),
    });

    const [editingField, setEditingField] = useState<EditableField>(null);
    const [tagInput, setTagInput] = useState("");
    const [openDeletionConformation, setOpenDeletionConformation] = useState(false);

    const updateMutation = useMutation({
        mutationFn: (value: TodoInput) => updateTodo(todoId, value),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
        },
    });

    const cancel = () => {
        if (!todo) return;

        form.reset({
            name: todo.name,
            listId: todo.listId,
            description: todo.description,
            priority: todo.priority as TodoPriority,
            dueDate: todo.dueDate ?? null as string | null,
            tags: todo.tags ?? [],
            status: todo.status as TodoStatus,
        });

        setEditingField(null);
    };

    const toggle = () => {
        toggleMutation.mutate(todoId)
    }

    const toggleMutation = useMutation({
        mutationFn: toggleTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
        },
    });

    const remove = () => {
        deleteMutation.mutate(todoId)
    }

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
            router.push("/")
        },
    });

    const form = useForm({
        defaultValues: {
            name: todo?.name ?? "",
            listId: todo?.listId ?? 0,
            description: todo?.description ?? "",
            priority: todo?.priority ?? "low" as TodoPriority,
            dueDate: todo?.dueDate ?? null as string | null,
            tags: todo?.tags ?? [] as string[],
            status: todo?.status ?? "open" as TodoStatus,
        },
        validators: {
            onChange: todoInputSchema,
        },
        onSubmit: async ({ value }) => {
            updateMutation.mutate(value);
            setEditingField(null);
        },
    });

    if (isLoading) {
        return <CircularProgress />
    }

    if (isError || !todo) {
        return (
            <Alert severity="error">
                Studierende:r konnte nicht geladen werden.
            </Alert>
        )
    }

    return (
        <>
            <Box component="form" onSubmit={e => {
                e.preventDefault()
                form.handleSubmit()
            }}>
                <Card variant="outlined" sx={{ margin: 2, minWidth: "400px" }}>
                    <CardHeader
                        title={
                            <form.Field name="name">
                                {(field) =>
                                    editingField === "name" ? (
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            error={field.state.meta.errors.length > 0}
                                            helperText={field.state.meta.errors[0]?.message}
                                        />
                                    ) : (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="h6">
                                                {field.state.value}
                                            </Typography>
                                            <IconButton onClick={() => setEditingField("name")}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )
                                }
                            </form.Field>
                        }
                        subheader={
                            <>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <form.Field name="priority">
                                        {(field) =>
                                            editingField === "priority-status" ? (
                                                <TextField
                                                    select
                                                    label="Priority"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value as TodoPriority)
                                                    }
                                                    fullWidth
                                                    error={field.state.meta.errors.length > 0}
                                                    helperText={field.state.meta.errors[0]?.message}
                                                >
                                                    {todoPriorities.map((s) => (
                                                        <MenuItem key={s} value={s}>
                                                            {s}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            ) : (
                                                <Typography>
                                                    {field.state.value}
                                                </Typography>
                                            )
                                        }
                                    </form.Field>
                                    <Typography>
                                        {" - "}
                                    </Typography>
                                    <form.Field name="status">
                                        {(field) =>
                                            editingField === "priority-status" ? (
                                                <TextField
                                                    select
                                                    label="Status"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value as TodoStatus)
                                                    }
                                                    fullWidth
                                                    error={field.state.meta.errors.length > 0}
                                                    helperText={field.state.meta.errors[0]?.message}
                                                >
                                                    {todoStatuses.map((s) => (
                                                        <MenuItem key={s} value={s}>
                                                            {s}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            ) : (
                                                <Typography>
                                                    {field.state.value}
                                                </Typography>
                                            )
                                        }
                                    </form.Field>

                                    {editingField !== "priority-status" ? (
                                        <IconButton onClick={() => setEditingField("priority-status")}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    ) : (
                                        <>
                                        </>
                                    )
                                    }
                                </Box>
                            </>
                        }
                    >

                    </CardHeader>

                    <CardContent>
                        <form.Field name="description">
                            {(field =>
                                editingField === "description" ? (
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        error={field.state.meta.errors.length > 0}
                                        helperText={field.state.meta.errors[0]?.message}
                                    />
                                ) : (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography>
                                            {field.state.value}
                                        </Typography>
                                        <IconButton onClick={() => setEditingField("description")}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )
                            )}
                        </form.Field>

                        <form.Field name="dueDate">
                            {(field =>
                                editingField === "dueDate" ? (
                                    <TextField
                                        type="date"
                                        fullWidth
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        error={field.state.meta.errors.length > 0}
                                        helperText={field.state.meta.errors[0]?.message}
                                    />
                                ) : (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography>
                                            {field.state.value ?? "no deadline"}
                                        </Typography>
                                        <IconButton onClick={() => setEditingField("dueDate")}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )
                            )}
                        </form.Field>

                        <form.Field name="tags">
                            {(field) => {
                                const addTag = () => {
                                    const trimmed = tagInput.trim();
                                    if (!trimmed) return;

                                    if (!field.state.value.includes(trimmed)) {
                                        field.handleChange([...field.state.value, trimmed]);
                                    }

                                    setTagInput("");
                                };

                                const removeTag = (tag: string) => {
                                    field.handleChange(field.state.value.filter((t) => t !== tag));
                                };

                                return editingField === "tags" ? (
                                    <Box>
                                        <Stack direction="row" spacing={1}>
                                            <TextField
                                                label="Add tag"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addTag();
                                                    }
                                                }}
                                                fullWidth
                                                error={field.state.meta.errors.length > 0}
                                                helperText={field.state.meta.errors[0]?.message}
                                            />

                                            <Button onClick={addTag} variant="outlined">
                                                Add
                                            </Button>
                                        </Stack>

                                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                            {(field.state.value ?? []).map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    onDelete={() => removeTag(tag)}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                ) : (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                            {field.state.value.length === 0 ? (
                                                <Typography>
                                                    {"no tags"}
                                                </Typography>
                                            ) : (
                                                field.state.value.map((tag) => (
                                                    <Chip key={tag} label={tag} />
                                                ))
                                            )}
                                        </Stack>
                                        <IconButton onClick={() => setEditingField("tags")}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                );
                            }}
                        </form.Field>
                    </CardContent>

                    <CardActions>
                        {editingField === null ? (
                            <>
                                <IconButton onClick={toggle}>
                                    <DoneIcon />
                                </IconButton>

                                <IconButton onClick={() => setOpenDeletionConformation(true)}>
                                    <DeleteForeverIcon />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    onClick={() =>
                                        form.handleSubmit()
                                    }
                                >
                                    <SaveIcon />
                                </IconButton>

                                <IconButton
                                    onClick={cancel}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </>
                        )}
                    </CardActions>
                </Card>
            </Box >

            <ConfirmDialog
                open={openDeletionConformation}
                title="Delete Todo"
                description={`Are you sure you want to delete Todo: "${todo.name}"? This action cannot be undone.`}
                onClose={() => setOpenDeletionConformation(false)}
                onConfirm={() => {
                    remove();
                    setOpenDeletionConformation(false);
                }}
            />
        </>
    );
}