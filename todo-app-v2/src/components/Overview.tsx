"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import TodoListSection from "@/components/TodoListSection"
import type { Todo } from "@/types/Todo"
import { getTodos, addTodo, deleteTodo, toggleTodo, getTodoLists, deleteTodoList, addTodoList } from "@/actions"
import { TodoList } from "@/types/TodoList";
import CreateTodoListDialog from "./CreateTodoListDialog";
import { TodoInput } from "@/schemas/Todo";
import { TodoListInput } from "@/schemas/TodoList";

const getTodosByList = (todos: Todo[], listId: number): Todo[] => {
    return todos.filter(todo => todo.listId === listId)
}

export default function Overview() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [lists, setLists] = useState<TodoList[]>([]);

    useEffect(() => {
        const loadTodos = async () => {
            const todos = await getTodos();
            setTodos(todos);
        }
        const loadLists = async () => {
            const lists = await getTodoLists();
            setLists(lists);

            if (lists.length > 0) {
                setOpenListId(lists[0].id);
            }
        };

        loadTodos();
        loadLists();
    }, []);

    const handleAddTodo = async (newTodo: TodoInput) => {
        const result = await addTodo(newTodo);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        const updatedTodos = await getTodos();
        setTodos(updatedTodos);
    };

    const handleAddTodoList = async (newTodoList: TodoListInput) => {
        const result = await addTodoList(newTodoList);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        const updatedLists = await getTodoLists();
        setLists(updatedLists);
    }

    const handleDeleteTodo = async (id: number) => {
        const result = await deleteTodo(id);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        const updatedTodos = await getTodos();
        setTodos(updatedTodos);
    };

    const handleToggleTodo = async (id: number) => {
        const result = await toggleTodo(id);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        const updatedTodos = await getTodos();
        setTodos(updatedTodos);
    };

    const handleDeleteTodoList = async (id: number) => {
        const result = await deleteTodoList(id);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        const updatedLists = await getTodoLists();
        const updatedTodos = await getTodos();

        setLists(updatedLists);
        setTodos(updatedTodos);
    }

    const [openListId, setOpenListId] = useState<number | null>(null);

    const [query, setQuery] = useState("")

    const [openCreateTodoListDialog, setOpenCreateTodoListDialog] = useState(false);

    const sortedLists = useMemo(() => {
        if (!query.trim()) return lists;

        return [...lists].sort(
            (a, b) =>
                similarityScore(b.name, query) -
                similarityScore(a.name, query)
        );
    }, [lists, query]);

    const prevQueryRef = useRef("");

    useEffect(() => {
        const prev = prevQueryRef.current;
        const curr = query;

        const queryGotMoreSpecific = curr.length > prev.length;

        prevQueryRef.current = curr;

        if (!queryGotMoreSpecific) return;
        if (!curr.trim()) return;
        if (sortedLists.length === 0) return;

        setOpenListId(sortedLists[0].id);
    }, [query, sortedLists]);

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: "column", width: '100%', flex: '1', padding: 5 }}>

                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", marginBlockEnd: 3 }}>
                    <TextField
                        variant="outlined"
                        placeholder="fuzzy find"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                        }}
                        sx={{ width: 300 }}
                    />

                    <IconButton
                        onClick={() => setOpenCreateTodoListDialog(true)}
                        sx={{
                            marginInlineStart: "auto",
                            marginInlineEnd: 2
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>



                {lists.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            height: "100%",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => setOpenCreateTodoListDialog(true)}
                            sx={{
                                height: "fit-content",
                            }}
                        >
                            <Typography variant="h4">
                                Create first Todo List
                            </Typography>
                        </Button>
                    </Box>
                ) : (
                    sortedLists.map(todoList => (
                        <TodoListSection
                            key={todoList.id}
                            list={todoList}
                            todos={getTodosByList(todos, todoList.id)}
                            open={openListId === todoList.id}
                            setOpen={() => {
                                setOpenListId(prev =>
                                    prev === todoList.id ? null : todoList.id
                                );
                            }}
                            addTodo={handleAddTodo}
                            toggleTodo={handleToggleTodo}
                            dropTodo={handleDeleteTodo}
                            dropTodoList={handleDeleteTodoList}
                        />
                    ))
                )}

            </Box>

            <CreateTodoListDialog
                open={openCreateTodoListDialog}
                close={(): void => {
                    setOpenCreateTodoListDialog(false)
                }}
                defaultValues={{}}
                onSubmit={handleAddTodoList}
            />
        </>
    )
}

const similarityScore = (a: string, b: string) => {
    const x = a.toLowerCase().trim();
    const y = b.toLowerCase().trim();

    if (!y) return 0;
    if (x === y) return 100;

    let score = 0;

    if (x.startsWith(y)) score += 30;
    if (x.includes(y)) score += 20;

    // small bonus for matching characters in order
    let i = 0;
    for (const char of y) {
        i = x.indexOf(char, i);
        if (i === -1) break;
        score += 2;
        i++;
    }

    return score;
};