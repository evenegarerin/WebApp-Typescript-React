"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import CreateTodoDialog from "@/components/CreateTodoDialog"
import { addTodo } from "@/actions"
import { TodoInput } from "@/schemas/Todo"

// Variante B: Das Anlegen läuft über eine useMutation, die im onSuccess den
// ["todos"]-Cache invalidiert, bevor zur Liste navigiert wird. Variante A
// (nur redirect) würde wegen der konfigurierten staleTime von 5 Minuten die
// alte Liste aus dem Cache zeigen — die Invalidierung garantiert frische Daten.
export default function NewTodo() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: addTodo,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["todos"] })
        },
    })

    return (
        <CreateTodoDialog
            open
            close={(): void => {
                router.push("/")
            }}
            defaultValues={{}}
            onSubmit={async (value: TodoInput) => {
                await createMutation.mutateAsync(value)
            }}
            redirectTo="/"
        />
    )
}
