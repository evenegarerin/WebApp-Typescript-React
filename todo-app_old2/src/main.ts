import type { Status, Todo, TodoList } from "./models";


const getTodosByList = (todos: Todo[], listId: number): Todo[] => {
    return todos.filter(
        todo => todo.listId === listId
    )
}

const getTodosByStatus = (todos: Todo[], status: Status): Todo[] => {
    return todos.filter(
        todo => todo.status === status
    )
}

const getHighPriorityTodos = (todos: Todo[]): Todo[] => {
    return todos.filter(
        todo => todo.priority === "high"
    )
}

const formatTodo = (todo: Todo): string => {
    let description = ""

    if (todo.description) {
        description = `description: ${todo.description}; `
    }

    let dueDate = ""

    if (todo.dueDate) {
        dueDate = `dueDate: ${todo.dueDate}; `
    }

    return `Todo: (id: ${todo.id}; name: ${todo.name}; ${description}status: ${todo.status}; priority: ${todo.priority}; ${dueDate}tags: ${todo.tags.join(", ")}; listId: ${todo.listId})`
}

const getSummary = (todos: Todo[], lists: TodoList[]): void => {
    lists.forEach(list => {
        const listTodos = getTodosByList(todos, list.id)
        const countAll = listTodos.length
        const countOpen = getTodosByStatus(listTodos, "open").length
        const countInProgress = getTodosByStatus(listTodos, "in-progress").length
        const countDone = getTodosByStatus(listTodos, "done").length


        console.log(`${list.name} => total tasks: ${countAll}, open: ${countOpen}, in progress: ${countInProgress}, done: ${countDone}`)
    });
}