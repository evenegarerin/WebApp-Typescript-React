"use client"

import { TodoListInput, todoListInputSchema } from "@/schemas/TodoList";
import { TodoList } from "@/types/TodoList";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, Box } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type ConfirmDialogProps = {
    open: boolean;
    close: () => void;
    defaultValues?: Partial<TodoList>;
    onSubmit: (value: TodoListInput) => Promise<void>;
    submitLabel?: string;
    redirectTo?: string;
};

export default function CreateTodoListDialog({ open, close, defaultValues, onSubmit, submitLabel, redirectTo }: ConfirmDialogProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const t = useTranslations("TodoList");
    const tConf = useTranslations("Conformation");

    const form = useForm({
        defaultValues: {
            name: defaultValues?.name ?? "",
            description: defaultValues?.description ?? null,
        },

        validators: {
            onChange: todoListInputSchema
        },

        onSubmit: async ({ value }) => {
            const result = await onSubmit(value);

            form.reset();

            await queryClient.invalidateQueries({ queryKey: ["lists"] });

            if (redirectTo) router.push(redirectTo);

            close();
        },
    })

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
            <DialogTitle>{t("add")}</DialogTitle>

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
                                    label={t("name")}
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
                                    label={t("description")}
                                    value={field.state.value || undefined}
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

                        <DialogActions>
                            <Button onClick={close}>
                                {tConf("cancel")}
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
                                        {submitLabel ?? tConf("save")}
                                    </Button>
                                )}
                            />
                        </DialogActions>

                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}