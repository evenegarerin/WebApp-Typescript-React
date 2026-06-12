"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, IconButton, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import TodoListSection from "@/components/TodoListSection"
import type { Todo } from "@/types/Todo"
import { getTodos, addTodo, deleteTodo, toggleTodo, getTodoLists, deleteTodoList, addTodoList } from "@/actions"
import { TodoList } from "@/types/TodoList";
import CreateTodoListDialog from "./CreateTodoListDialog";
import { TodoInput } from "@/schemas/Todo";
import { TodoListInput } from "@/schemas/TodoList";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const getTodosByList = (todos: Todo[], listId: number): Todo[] => {
    return todos.filter(todo => todo.listId === listId)
}

export default function Overview() {
    const queryClient = useQueryClient()
    const t = useTranslations("Overview")
    const tList = useTranslations("TodoList")

    const results = useQueries({
        queries: [
            { queryKey: ["todos"], queryFn: getTodos },
            { queryKey: ["lists"], queryFn: getTodoLists },
        ],
    });

    const todos = results[0].data;
    const lists = results[1].data;

    const isLoading = results.some(r => r.isLoading);
    const isError = results.some(r => r.isError);

    const handleAddTodo = async (newTodo: TodoInput) => {
        addTodoMutation.mutate(newTodo)
    };

    const addTodoMutation = useMutation({
        mutationFn: addTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
        },
    })

    const handleAddTodoList = async (newTodoList: TodoListInput) => {
        addListMutation.mutate(newTodoList)
    }

    const addListMutation = useMutation({
        mutationFn: addTodoList,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lists"] })
        },
    })

    const handleDeleteTodo = async (id: number) => {
        deleteTodoMutation.mutate(id)
    };

    const deleteTodoMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
        },
    })

    const handleToggleTodo = async (id: number) => {
        toggleMutation.mutate(id)
    };

    const toggleMutation = useMutation({
        mutationFn: toggleTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
        },
    })

    const handleDeleteTodoList = async (id: number) => {
        deleteListMutation.mutate(id)
    }

    const deleteListMutation = useMutation({
        mutationFn: deleteTodoList,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lists"] })
        },
    })

    const [openListId, setOpenListId] = useState<number | null>(null);

    const [query, setQuery] = useState("")

    const [openCreateTodoListDialog, setOpenCreateTodoListDialog] = useState(false);

    const sortedLists = useMemo(() => {
        if (!lists) return [];

        const base = [...lists];

        if (!query.trim()) return base;

        return base.sort(
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

    useEffect(() => {
        if (!openListId && lists?.length) {
            setOpenListId(lists[0].id);
        }
    }, [lists]);

    if (isLoading) {
        return <CircularProgress />
    }

    if (isError || !todos || !lists) {
        return (
            <Alert severity="error">
                {t("error")}
            </Alert>
        )
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: "column", width: '100%', flex: '1', padding: 5 }}>

                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", marginBlockEnd: 3 }}>
                    <TextField
                        variant="outlined"
                        placeholder={t("find")}
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
                                {tList("addFirst")}
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