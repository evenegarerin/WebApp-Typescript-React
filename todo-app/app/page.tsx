import { getTodos } from "../src/actions"
import App from "../src/App"

export default async function Page() {
  const todos = await getTodos()

  return <App initialTodos={todos} />
}