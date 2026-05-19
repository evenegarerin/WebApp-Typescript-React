import { useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import TodoListSection from "./components/TodoListSection"
import { ExampleTodoLists, ExampleTodos } from "./data"
import type { Todo } from "./models"
import { Box, Grid } from "@mui/material"
import Statistics from "./components/Statistics"

const getTodosByList = (todos: Todo[], listId: number): Todo[] => {
  return todos.filter(
    todo => todo.listId === listId
  )
}

const App = () => {
  const [todos, setTodos] = useState(ExampleTodos)
  const [lists] = useState(ExampleTodoLists)

  const addTodo = (todo: Todo) => {
    setTodos([...todos, todo])
  }

  const updateTodo = (todo: Todo) => {
    setTodos(todos.map(t =>
      t.id === todo.id ? { ...todo } : t
    ))
  }

  const dropTodo = (todo: Todo) => {
    setTodos(todos.filter(t => t !== todo))
  }

  return (
    <Box display='flex' flexDirection="column" width='100vw' height='100vh'>
      <Header title={"your cool todo list"} todoCount={todos.length} />

      <Box display='flex' flexDirection="column" justifyContent='center' width='100%' flex='1'>
        <Grid container spacing={2} sx={{ maxWidth: 1100 }} alignSelf="center">
          {lists.map(todoList => (
            <Grid key={todoList.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <TodoListSection list={todoList} todos={getTodosByList(todos, todoList.id)} addTodo={addTodo} updateTodo={updateTodo} dropTodo={dropTodo} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Statistics todos={todos}>

      </Statistics>

      <Footer author={"me"} />
    </Box >
  )
}



export default App
