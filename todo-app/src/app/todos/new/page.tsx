import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import NewTodo from "@/components/NewTodo"

export default async function NewTodoPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) redirect("/login")

    return <NewTodo />
}
