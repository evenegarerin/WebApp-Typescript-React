"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Grid, IconButton, TextField } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import TodoListSection from "@/components/TodoListSection"
import type { Todo } from "@/types/Todo"
import { getTodos, addTodo, deleteTodo, toggleTodo, getTodoLists, deleteTodoList, addTodoList } from "@/actions"
import { TodoList } from "@/types/TodoList";
import CreateTodoListDialog from "./CreateTodoListDialog";

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

    const handleAddTodo = async (newTodo: Todo) => {
        const updated = await addTodo(newTodo);
        setTodos(updated);
    };

    const handleAddTodoList = async (newTodoList: TodoList) => {
        const updated = await addTodoList(newTodoList);
        setLists(updated);
    }

    const handleDeleteTodo = async (id: number) => {
        const updated = await deleteTodo(id);
        setTodos(updated);
    };

    const handleToggleTodo = async (id: number) => {
        const updated = await toggleTodo(id);
        setTodos(updated);
    };

    const handleDeleteTodoList = async (id: number) => {
        const updated = await deleteTodoList(id);
        setLists(updated)
    }

    const [openListId, setOpenListId] = useState<number | null>(null);

    const [querry, setQuerry] = useState("")

    const [openCreateTodoListDialog, setOpenCreateTodoListDialog] = useState(false);

    const sortedLists = useMemo(() => {
        if (!querry.trim()) return lists;

        return [...lists].sort(
            (a, b) =>
                similarityScore(b.name, querry) -
                similarityScore(a.name, querry)
        );
    }, [lists, querry]);

    const prevQueryRef = useRef("");

    useEffect(() => {
        const prev = prevQueryRef.current;
        const curr = querry;

        const queryGotMoreSpecific = curr.length > prev.length;

        prevQueryRef.current = curr;

        if (!queryGotMoreSpecific) return;
        if (!curr.trim()) return;
        if (sortedLists.length === 0) return;

        setOpenListId(sortedLists[0].id);
    }, [querry, sortedLists]);

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: "column", width: '100%', flex: '1', padding: 5 }}>

                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", marginBlockEnd: 3 }}>
                    <TextField
                        variant="outlined"
                        placeholder="fuzzy find"
                        value={querry}
                        onChange={(e) => {
                            setQuerry(e.target.value)
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

                {sortedLists.map(todoList => (
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
                ))}

            </Box>

            <CreateTodoListDialog
                open={openCreateTodoListDialog}
                close={(): void => {
                    setOpenCreateTodoListDialog(false)
                }}
                addTodoList={handleAddTodoList}
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