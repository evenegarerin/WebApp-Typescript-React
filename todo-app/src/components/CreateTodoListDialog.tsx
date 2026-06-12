"use client"

import { TodoListInput, todoListInputSchema } from "@/schemas/TodoList";
import { TodoList } from "@/types/TodoList";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Box } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import FormTextField from "@/components/FormTextField";

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
                                <FormTextField field={field} label={t("name")} />
                            )}
                        />

                        <form.Field
                            name="description"
                            children={(field) => (
                                <FormTextField
                                    field={field}
                                    label={t("description")}
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