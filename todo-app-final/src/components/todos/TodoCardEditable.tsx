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
    Tooltip,
    Typography,
} from "@mui/material";
import {
    ToggleStatusIcon,
    DeleteIcon,
    CancelIcon,
    EditIcon,
    SaveIcon,
} from "@/components/common/icons";
import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { TodoStatus, todoStatuses } from "@/types/TodoStatus";
import { todoPriorities, TodoPriority } from "@/types/TodoPriority";
import { TodoInput, todoInputSchema } from "@/schemas/Todo";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { priorityBorder, priorityChipColor, statusChipColor } from "@/components/todos/TodoCard";
import { deleteTodo, getTodo, toggleTodo, updateTodo, todoNameExists } from "@/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";

interface Props {
    todoId: number;
}

type EditableField = "name" | "description" | "priority-status" | "dueDate" | "tags" | null;

export default function TodoCardEditable({ todoId }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const t = useTranslations("Todo");
    const tStatus = useTranslations("Status");
    const tPriority = useTranslations("Priority");
    const tConf = useTranslations("Conformation");
    const tActions = useTranslations("Actions");
    const format = useFormatter();

    const {
        data: todo,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["todo", todoId],
        queryFn: () => getTodo(todoId),
    });

    const [editingField, setEditingField] = useState<EditableField>(null);
    const [tagInput, setTagInput] = useState("");
    const [openDeletionConformation, setOpenDeletionConformation] = useState(false);

    const updateMutation = useMutation({
        mutationFn: (value: TodoInput) => updateTodo(todoId, value),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
            await queryClient.invalidateQueries({ queryKey: ["todos"] });

            form.reset()
        },
    });

    const cancel = () => {
        if (!todo) return;

        form.reset({
            name: todo.name,
            listId: todo.listId,
            description: todo.description,
            priority: todo.priority as TodoPriority,
            dueDate: todo.dueDate ?? (null as string | null),
            tags: todo.tags ?? [],
            status: todo.status as TodoStatus,
        });

        setEditingField(null);
    };

    const toggle = () => {
        toggleMutation.mutate(todoId);
    };

    const toggleMutation = useMutation({
        mutationFn: toggleTodo,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
            await queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const remove = () => {
        deleteMutation.mutate(todoId);
    };

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["todos"] });
            router.push("/");
        },
    });

    const form = useForm({
        defaultValues: {
            name: todo?.name ?? "",
            listId: todo?.listId ?? 0,
            description: todo?.description ?? "",
            priority: todo?.priority ?? ("low" as TodoPriority),
            dueDate: todo?.dueDate ?? (null as string | null),
            tags: todo?.tags ?? ([] as string[]),
            status: todo?.status ?? ("open" as TodoStatus),
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
        return <CircularProgress />;
    }

    if (isError) {
        return <Alert severity="error">{t("error")}</Alert>;
    }

    if (!todo) {
        notFound();
    }

    const isDone = todo.status === "done";

    return (
        <>
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        margin: 2,
                        minWidth: "400px",
                        maxWidth: "600px",
                        borderColor: isDone ? "divider" : priorityBorder[todo.priority],
                        opacity: isDone ? 0.6 : 1,
                    }}
                >
                    <CardHeader
                        title={
                            <form.Field
                                name="name"
                                asyncDebounceMs={400}
                                validators={{
                                    onChangeAsync: async ({ value }) => {
                                        if (typeof value === "string" && value.trim().length >= 3) {
                                            if (await todoNameExists(value, todoId)) {
                                                return { message: t("nameTaken") };
                                            }
                                        }
                                        return undefined;
                                    },
                                }}
                            >
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
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    textDecoration: isDone
                                                        ? "line-through"
                                                        : "none",
                                                }}
                                            >
                                                {field.state.value}
                                            </Typography>
                                            <Tooltip title={tActions("editName")}>
                                                <IconButton onClick={() => setEditingField("name")}>
                                                    <EditIcon fontSize="small" color="action" />
                                                </IconButton>
                                            </Tooltip>
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
                                                    label={t("priority")}
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value as TodoPriority,
                                                        )
                                                    }
                                                    fullWidth
                                                    error={field.state.meta.errors.length > 0}
                                                    helperText={field.state.meta.errors[0]?.message}
                                                >
                                                    {todoPriorities.map((s) => (
                                                        <MenuItem key={s} value={s}>
                                                            {tPriority(s)}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            ) : (
                                                <Chip
                                                    size="small"
                                                    color={
                                                        isDone
                                                            ? "default"
                                                            : priorityChipColor[
                                                            field.state.value as TodoPriority
                                                            ]
                                                    }
                                                    label={tPriority(field.state.value)}
                                                />
                                            )
                                        }
                                    </form.Field>
                                    {editingField === "priority-status" && (
                                        <Typography>{" - "}</Typography>
                                    )}
                                    <form.Field name="status">
                                        {(field) =>
                                            editingField === "priority-status" ? (
                                                <TextField
                                                    select
                                                    label={t("status")}
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value as TodoStatus,
                                                        )
                                                    }
                                                    fullWidth
                                                    error={field.state.meta.errors.length > 0}
                                                    helperText={field.state.meta.errors[0]?.message}
                                                >
                                                    {todoStatuses.map((s) => (
                                                        <MenuItem key={s} value={s}>
                                                            {tStatus(s)}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            ) : (
                                                <Chip
                                                    size="small"
                                                    color={
                                                        statusChipColor[
                                                        field.state.value as TodoStatus
                                                        ]
                                                    }
                                                    label={tStatus(field.state.value)}
                                                />
                                            )
                                        }
                                    </form.Field>

                                    {editingField !== "priority-status" ? (
                                        <Tooltip title={tActions("editPriorityStatus")}>
                                            <IconButton
                                                onClick={() => setEditingField("priority-status")}
                                            >
                                                <EditIcon fontSize="small" color="action" />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <></>
                                    )}
                                </Box>
                                <form.Field name="dueDate">
                                    {(field) =>
                                        editingField === "dueDate" ? (
                                            <TextField
                                                type="date"
                                                fullWidth
                                                value={field.state.value ?? ""}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                error={field.state.meta.errors.length > 0}
                                                helperText={field.state.meta.errors[0]?.message}
                                            />
                                        ) : (
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography>
                                                    {field.state.value
                                                        ? format.dateTime(
                                                            new Date(field.state.value),
                                                            { dateStyle: "long" },
                                                        )
                                                        : t("no-due-date")}
                                                </Typography>
                                                <Tooltip title={tActions("editDueDate")}>
                                                    <IconButton
                                                        onClick={() => setEditingField("dueDate")}
                                                    >
                                                        <EditIcon fontSize="small" color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        )
                                    }
                                </form.Field>
                            </>
                        }
                    ></CardHeader>

                    <CardContent>
                        <form.Field name="description">
                            {(field) =>
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
                                        <Typography
                                            sx={{
                                                whiteSpace: "pre-wrap",
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {field.state.value || t("no-description")}
                                        </Typography>
                                        <Tooltip title={tActions("editDescription")}>
                                            <IconButton
                                                onClick={() => setEditingField("description")}
                                            >
                                                <EditIcon fontSize="small" color="action" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                )
                            }
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
                                                label={t("tag.placeholder")}
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                slotProps={{ htmlInput: { maxLength: 20 } }}
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
                                                {t("tag.add")}
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
                                                <Typography>{t("no-tags")}</Typography>
                                            ) : (
                                                field.state.value.map((tag) => (
                                                    <Chip key={tag} label={tag} />
                                                ))
                                            )}
                                        </Stack>
                                        <Tooltip title={tActions("editTags")}>
                                            <IconButton onClick={() => setEditingField("tags")}>
                                                <EditIcon fontSize="small" color="action" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                );
                            }}
                        </form.Field>
                    </CardContent>

                    <CardActions>
                        {editingField === null ? (
                            <>
                                <Tooltip title={tActions("toggleStatus")}>
                                    <IconButton color="success" onClick={toggle}>
                                        <ToggleStatusIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={tActions("deleteTodo")}>
                                    <IconButton
                                        color="error"
                                        onClick={() => setOpenDeletionConformation(true)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        ) : (
                            <>
                                <Tooltip title={tActions("save")}>
                                    <IconButton color="success" onClick={() => form.handleSubmit()}>
                                        <SaveIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={tActions("cancel")}>
                                    <IconButton onClick={cancel}>
                                        <CancelIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </CardActions>
                </Card>
            </Box>

            <ConfirmDialog
                open={openDeletionConformation}
                title={tConf("deleteTodoTitle")}
                description={tConf("deleteTodoText", { name: todo.name })}
                onClose={() => setOpenDeletionConformation(false)}
                onConfirm={() => {
                    remove();
                    setOpenDeletionConformation(false);
                }}
            />
        </>
    );
}
