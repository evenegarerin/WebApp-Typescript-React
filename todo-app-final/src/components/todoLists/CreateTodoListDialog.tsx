"use client";

import { TodoListInput, todoListInputSchema } from "@/schemas/TodoList";
import { TodoList } from "@/types/TodoList";
import {
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Box,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import FormTextField from "@/components/common/FormTextField";
import type { ActionResult } from "@/actions";

type ConfirmDialogProps = {
    open: boolean;
    close: () => void;
    defaultValues?: Partial<TodoList>;
    onSubmit: (value: TodoListInput) => Promise<ActionResult>;
    submitLabel?: string;
    redirectTo?: string;
};

export default function CreateTodoListDialog({
    open,
    close,
    defaultValues,
    onSubmit,
    submitLabel,
    redirectTo,
}: ConfirmDialogProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const t = useTranslations("TodoList");
    const tConf = useTranslations("Conformation");

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) setError(null);
    }, [open]);

    const form = useForm({
        defaultValues: {
            name: defaultValues?.name ?? "",
            description: defaultValues?.description ?? null,
        },

        validators: {
            onChange: todoListInputSchema,
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

            await queryClient.invalidateQueries({ queryKey: ["lists"] });

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

                        <form.Field name="name">
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
