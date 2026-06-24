"use client";

import { getTodoLists, todoNameExists } from "@/actions";
import FormTextField from "@/components/common/FormTextField";
import { Todo } from "@/types/Todo";
import { TodoList } from "@/types/TodoList";
import { todoPriorities, TodoPriority } from "@/types/TodoPriority";
import { TodoStatus, todoStatuses } from "@/types/TodoStatus";
import {
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    TextField,
    MenuItem,
    Box,
    Chip,
} from "@mui/material";
import type { ActionResult } from "@/actions";
import { useEffect, useState } from "react";

import { useForm } from "@tanstack/react-form";
import { todoInputSchema, type TodoInput } from "@/schemas/Todo";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type ConfirmDialogProps = {
    open: boolean;
    close: () => void;
    defaultValues?: Partial<Todo>;
    onSubmit: (value: TodoInput) => Promise<ActionResult>;
    submitLabel?: string;
    redirectTo?: string;
};

export default function CreateTodoDialog({
    open,
    close,
    defaultValues,
    onSubmit,
    submitLabel,
    redirectTo,
}: ConfirmDialogProps) {
    const router = useRouter();

    const t = useTranslations("Todo");
    const tStatus = useTranslations("Status");
    const tPriority = useTranslations("Priority");
    const tConf = useTranslations("Conformation");

    const [lists, setLists] = useState<TodoList[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLists = async () => {
            const lists = await getTodoLists();
            setLists(lists);
        };

        loadLists();
    }, []);

    useEffect(() => {
        if (open) setError(null);
    }, [open]);

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
            onChange: todoInputSchema,
        },

        onSubmit: async ({ value }) => {
            setError(null);

            try {
                const result = await onSubmit(value);
                if (!result.success) {
                    setError(result.message ?? tConf("saveError"));
                    return;
                }
            } catch {
                setError(tConf("saveError"));
                return;
            }

            form.reset();

            if (redirectTo) router.push(redirectTo);

            close();
        },
    });

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
            <DialogTitle>{t("add")}</DialogTitle>

            <DialogContent>
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <Stack spacing={2} mt={1}>
                        {error && <Alert severity="error">{error}</Alert>}

                        <form.Field
                            name="name"
                            asyncDebounceMs={400}
                            validators={{
                                onChangeAsync: async ({ value }) => {
                                    if (typeof value === "string" && value.trim().length >= 3) {
                                        if (await todoNameExists(value)) {
                                            return { message: t("nameTaken") };
                                        }
                                    }
                                    return undefined;
                                },
                            }}
                        >
                            {(field) => <FormTextField field={field} label={t("name")} />}
                        </form.Field>

                        <form.Field name="description">
                            {(field) => (
                                <FormTextField
                                    field={field}
                                    label={t("description")}
                                    multiline
                                    minRows={2}
                                />
                            )}
                        </form.Field>

                        <form.Field name="listId">
                            {(field) => (
                                <TextField
                                    select
                                    label={t("list")}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                    fullWidth
                                    error={field.state.meta.errors.length > 0}
                                    helperText={field.state.meta.errors[0]?.message}
                                >
                                    {lists.map((list) => (
                                        <MenuItem key={list.id} value={list.id}>
                                            {list.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </form.Field>

                        <form.Field name="status">
                            {(field) => (
                                <TextField
                                    select
                                    label={t("status")}
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value as TodoStatus)
                                    }
                                    fullWidth
                                >
                                    {todoStatuses.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {tStatus(s)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </form.Field>

                        <form.Field name="priority">
                            {(field) => (
                                <TextField
                                    select
                                    label={t("priority")}
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value as TodoPriority)
                                    }
                                    fullWidth
                                >
                                    {todoPriorities.map((p) => (
                                        <MenuItem key={p} value={p}>
                                            {tPriority(p)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </form.Field>

                        <form.Field name="dueDate">
                            {(field) => (
                                <TextField
                                    label={t("due-date")}
                                    type="date"
                                    value={field.state.value ?? ""}
                                    onChange={(e) =>
                                        field.handleChange(
                                            e.target.value === "" ? null : e.target.value,
                                        )
                                    }
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    fullWidth
                                />
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

                                return (
                                    <Box>
                                        <Stack direction="row" spacing={1}>
                                            <TextField
                                                label={t("tag.placeholder")}
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                slotProps={{ htmlInput: { maxLength: 20 } }}
                                                error={field.state.meta.errors.length > 0}
                                                helperText={field.state.meta.errors[0]?.message}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addTag();
                                                    }
                                                }}
                                                fullWidth
                                            />

                                            <Button onClick={addTag} variant="outlined">
                                                {t("tag.add")}
                                            </Button>
                                        </Stack>

                                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                            {field.state.value.map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    onDelete={() => removeTag(tag)}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                );
                            }}
                        </form.Field>

                        <DialogActions>
                            <Button onClick={close}>{tConf("cancel")}</Button>

                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting]}
                            >
                                {([canSubmit, isSubmitting]) => (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={!canSubmit || isSubmitting}
                                    >
                                        {submitLabel ?? tConf("save")}
                                    </Button>
                                )}
                            </form.Subscribe>
                        </DialogActions>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
