"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateTodoDialog from "@/components/todos/CreateTodoDialog";
import { addTodo } from "@/actions";
import { TodoInput } from "@/schemas/Todo";

export default function NewTodoPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: addTodo,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    return (
        <CreateTodoDialog
            open
            close={(): void => {
                router.push("/");
            }}
            defaultValues={{}}
            onSubmit={(value: TodoInput) => createMutation.mutateAsync(value)}
            redirectTo="/"
        />
    );
}
