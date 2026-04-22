import type { Todo } from "../models"

interface StatisticsProps {
    todos: Todo[]
}

const Statistics = ({ todos }: StatisticsProps) => {
    const total = todos.length
    const open = todos.filter(t => t.status === "open").length
    const inProgress = todos.filter(t => t.status === "in-progress").length
    const done = todos.filter(t => t.status === "done").length

    return (
        <p>
            <span>total: {total} - </span>
            <span>open: {open} - </span>
            <span>in progress: {inProgress} - </span>
            <span>done: {done} </span>
        </p>
    )
}

export default Statistics