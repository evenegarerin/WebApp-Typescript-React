import { useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import TodoListSection from "./components/TodoListSection"
import { ExampleTodoLists, ExampleTodos } from "./data"
import type { Todo, TodoList } from "./models"
import { Box, Container, Grid, Grow } from "@mui/material"

const getTodosByList = (todos: Todo[], listId: number): Todo[] => {
  return todos.filter(
    todo => todo.listId === listId
  )
}

const App = () => {
  const [todos, setTodos] = useState(ExampleTodos)
  const [lists, setLists] = useState(ExampleTodoLists)

  return (
    <Box display='flex' flexDirection={"column"} width='100vw' height='100vh'>
      <Header title={"your cool todo list"} todoCount={todos.length} />

      <Box display='flex' justifyContent='center' width='100%' flex='1'>
        <Grid container spacing={2} sx={{ maxWidth: 1100 }}>
          {lists.map(todoList => (
            <Grid key={todoList.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <TodoListSection list={todoList} todos={getTodosByList(todos, todoList.id)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer author={"me"} />
    </Box >
  )
}

export default App