"use client"

import { getTodoLists } from "@/actions";
import { Todo } from "@/types/Todo";
import { TodoList } from "@/types/TodoList";
import { todoPriorities, TodoPriority } from "@/types/TodoPriority";
import { TodoStatus, todoStatuses } from "@/types/TodoStatus";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem, Box, Chip, } from "@mui/material";
import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { useEffect, useState } from "react";

import { useForm } from "@tanstack/react-form"
import { todoInputSchema, type TodoInput } from "@/schemas";
import { useRouter } from "next/navigation";

type ConfirmDialogProps = {
    open: boolean;
    close: () => void;
    defaultValues?: Partial<Todo>;
    onSubmit: (value: TodoInput) => void;
    submitLabel?: string;
    redirectTo?: string;
};

export default function CreateTodoDialog({ open, close, defaultValues, onSubmit, submitLabel, redirectTo }: ConfirmDialogProps) {
    const router = useRouter();

    const [lists, setLists] = useState<TodoList[]>([]);
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        const loadLists = async () => {
            const lists = await getTodoLists();
            setLists(lists);
        };

        loadLists();
    }, []);

    const form = useForm({
        defaultValues: {
            name: defaultValues?.name ?? "",
            listId: defaultValues?.listId ?? 0,
            description: defaultValues?.description ?? "",
            priority: defaultValues?.priority ?? "low",
            dueDate: defaultValues?.dueDate ?? null,
            tags: defaultValues?.tags ?? [],
            status: defaultValues?.status ?? "open",
        },

        validators: {
            onChange: todoInputSchema
        },

        onSubmit: async ({ value }) => {
            const result = await onSubmit(value)

            if (redirectTo) router.push(redirectTo)
        },
    })

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
            <DialogTitle>Create Todo</DialogTitle>

            <DialogContent>
                <Box component="form" onSubmit={e => {
                    e.preventDefault()
                    form.handleSubmit()
                }}>
                    <Stack spacing={2} mt={1}>

                        <form.Field
                            name="name"
                            children={(field) => (
                                <TextField
                                    label="Name"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    error={field.state.meta.errors.length > 0}
                                    helperText={field.state.meta.errors[0]?.message}
                                    fullWidth
                                />
                            )}
                        />

                        <form.Field
                            name="description"
                            children={(field) => (
                                <TextField
                                    label="Description"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    error={field.state.meta.errors.length > 0}
                                    helperText={field.state.meta.errors[0]?.message}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                />
                            )}
                        />

                        <form.Field
                            name="listId"
                            children={(field) => (
                                <TextField
                                    select
                                    label="Todo List"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(Number(e.target.value))
                                    }
                                    fullWidth
                                >
                                    {lists.map((list) => (
                                        <MenuItem key={list.id} value={list.id}>
                                            {list.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <form.Field
                            name="status"
                            children={(field) => (
                                <TextField
                                    select
                                    label="Status"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value as TodoStatus)
                                    }
                                    fullWidth
                                >
                                    {todoStatuses.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <form.Field
                            name="priority"
                            children={(field) => (
                                <TextField
                                    select
                                    label="Priority"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value as TodoPriority)
                                    }
                                    fullWidth
                                >
                                    {todoPriorities.map((p) => (
                                        <MenuItem key={p} value={p}>
                                            {p}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <form.Field
                            name="dueDate"
                            children={(field) => (
                                <TextField
                                    label="Due Date"
                                    type="date"
                                    value={field.state.value ?? ""}
                                    onChange={(e) =>
                                        field.handleChange(
                                            e.target.value === "" ? null : e.target.value
                                        )
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            )}
                        />

                        <form.Field
                            name="tags"
                            children={(field) => {
                                const addTag = () => {
                                    const trimmed = tagInput.trim()

                                    if (!trimmed) return

                                    if (!field.state.value.includes(trimmed)) {
                                        field.handleChange([
                                            ...field.state.value,
                                            trimmed,
                                        ])
                                    }

                                    setTagInput("")
                                }

                                const removeTag = (tag: string) => {
                                    field.handleChange(
                                        field.state.value.filter((t) => t !== tag)
                                    )
                                }

                                return (
                                    <Box>
                                        <Stack direction="row" spacing={1}>
                                            <TextField
                                                label="Add tag"
                                                value={tagInput}
                                                onChange={(e) =>
                                                    setTagInput(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault()
                                                        addTag()
                                                    }
                                                }}
                                                fullWidth
                                            />

                                            <Button
                                                onClick={addTag}
                                                variant="outlined"
                                            >
                                                Add
                                            </Button>
                                        </Stack>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            mt={1}
                                            flexWrap="wrap"
                                        >
                                            {field.state.value.map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    onDelete={() => removeTag(tag)}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                )
                            }}
                        />

                        <DialogActions>
                            <Button onClick={close}>
                                Cancel
                            </Button>

                            <form.Subscribe
                                selector={(state) => [
                                    state.canSubmit,
                                    state.isSubmitting,
                                ]}
                                children={([canSubmit, isSubmitting]) => (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={!canSubmit || isSubmitting}
                                    >
                                        {submitLabel ?? "Save"}
                                    </Button>
                                )}
                            />
                        </DialogActions>

                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    )
}