"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { AddIcon } from "@/components/common/icons";
import TodoListSection from "@/components/todoLists/TodoListSection";
import type { Todo } from "@/types/Todo";
import { nextTodoStatus } from "@/types/TodoStatus";
import { matchesQuery } from "@/lib/search";
import {
    getTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    getTodoLists,
    deleteTodoList,
    addTodoList,
} from "@/actions";
import CreateTodoListDialog from "@/components/todoLists/CreateTodoListDialog";
import { TodoInput } from "@/schemas/Todo";
import { TodoListInput } from "@/schemas/TodoList";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const getTodosByList = (todos: Todo[], listId: number): Todo[] => {
    return todos.filter((todo) => todo.listId === listId);
};

const CLICK_SCROLL_OFFSET = 40;
const SEARCH_SCROLL_OFFSET = 120;

const getScrollParent = (node: HTMLElement): HTMLElement => {
    let el: HTMLElement | null = node.parentElement;
    while (el) {
        const { overflowY } = getComputedStyle(el);
        if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
            return el;
        }
        el = el.parentElement;
    }
    return document.scrollingElement as HTMLElement;
};

export default function Home() {
    const queryClient = useQueryClient();
    const t = useTranslations("Overview");
    const tList = useTranslations("TodoList");
    const tActions = useTranslations("Actions");

    const results = useQueries({
        queries: [
            { queryKey: ["todos"], queryFn: getTodos },
            { queryKey: ["lists"], queryFn: getTodoLists },
        ],
    });

    const todos = results[0].data;
    const lists = results[1].data;

    const isLoading = results.some((r) => r.isLoading);
    const isError = results.some((r) => r.isError);

    const handleAddTodo = async (newTodo: TodoInput) => {
        return addTodoMutation.mutateAsync(newTodo);
    };

    const addTodoMutation = useMutation({
        mutationFn: addTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const handleAddTodoList = async (newTodoList: TodoListInput) => {
        return addListMutation.mutateAsync(newTodoList);
    };

    const addListMutation = useMutation({
        mutationFn: addTodoList,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lists"] });
        },
    });

    const handleDeleteTodo = async (id: number) => {
        deleteTodoMutation.mutate(id);
    };

    const deleteTodoMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const handleToggleTodo = async (id: number) => {
        toggleMutation.mutate(id);
    };

    const toggleMutation = useMutation({
        mutationFn: toggleTodo,
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });

            const previous = queryClient.getQueryData<Todo[]>(["todos"]);

            queryClient.setQueryData<Todo[]>(["todos"], (old) =>
                old?.map((todo) =>
                    todo.id === id ? { ...todo, status: nextTodoStatus(todo.status) } : todo,
                ),
            );

            return { previous };
        },
        onError: (_error, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["todos"], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const handleDeleteTodoList = async (id: number) => {
        deleteListMutation.mutate(id);
    };

    const deleteListMutation = useMutation({
        mutationFn: deleteTodoList,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lists"] });
        },
    });

    const [openListId, setOpenListId] = useState<number | null>(null);

    const sectionRefs = useRef(new Map<number, HTMLElement | null>());

    const anchorTopRef = useRef<number | null>(null);
    const prevOpenRef = useRef<number | null>(null);

    const scrollToOpenedList = useCallback((id: number, offset: number) => {
        requestAnimationFrame(() => {
            const target = sectionRefs.current.get(id);
            if (!target) return;

            const container = getScrollParent(target);
            const nodeTop =
                container.scrollTop +
                target.getBoundingClientRect().top -
                container.getBoundingClientRect().top;
            const maxScroll = container.scrollHeight - container.clientHeight;

            const nextTop = Math.max(0, Math.min(nodeTop - offset, maxScroll));

            container.scrollTo({ top: nextTop, behavior: "smooth" });
            anchorTopRef.current = nodeTop - nextTop;
        });
    }, []);

    const [query, setQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    const [openCreateTodoListDialog, setOpenCreateTodoListDialog] = useState(false);

    const searchScrolledId = useRef<number | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            searchScrolledId.current = null;
            return;
        }
        if (!todos) return;

        const matches = todos.filter((todo) => matchesQuery(todo, query));
        if (matches.length === 0) return;

        const best = matches.reduce((a, b) =>
            similarityScore(b.name, query) > similarityScore(a.name, query) ? b : a,
        );

        setOpenListId(best.listId);

        if (searchScrolledId.current !== best.listId) {
            searchScrolledId.current = best.listId;
            scrollToOpenedList(best.listId, SEARCH_SCROLL_OFFSET);
        }
    }, [query, todos, scrollToOpenedList]);

    useEffect(() => {
        if (!openListId && lists?.length) {
            setOpenListId(lists[0].id);
        }
    }, [lists]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setQuery("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const searchActive = query.trim().length > 0;

    const listHasMatch = (listId: number) =>
        !!todos?.some((todo) => todo.listId === listId && matchesQuery(todo, query));

    const orderedLists =
        lists && searchActive
            ? [
                  ...lists.filter((l) => l.id === openListId),
                  ...lists.filter((l) => l.id !== openListId && listHasMatch(l.id)),
                  ...lists.filter((l) => l.id !== openListId && !listHasMatch(l.id)),
              ]
            : (lists ?? []);

    const listOrderById = new Map(orderedLists.map((list, index) => [list.id, index]));
    const orderSignature = orderedLists.map((list) => list.id).join(",");

    useLayoutEffect(() => {
        const id = openListId;
        const openChanged = prevOpenRef.current !== id;
        prevOpenRef.current = id;

        if (id === null) {
            anchorTopRef.current = null;
            return;
        }
        if (openChanged) return;
        if (anchorTopRef.current === null) return;

        const node = sectionRefs.current.get(id);
        if (!node) return;

        const container = getScrollParent(node);
        const top = node.getBoundingClientRect().top - container.getBoundingClientRect().top;
        container.scrollTop += top - anchorTopRef.current;
    }, [orderSignature, openListId]);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (isError || !todos || !lists) {
        return <Alert severity="error">{t("error")}</Alert>;
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    flex: "1",
                    padding: 5,
                }}
            >
                <Box
                    sx={{
                        order: -1,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBlockEnd: 3,
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder={t("find")}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                        }}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        slotProps={{
                            input: {
                                endAdornment:
                                    query && !searchFocused ? (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ whiteSpace: "nowrap", marginInlineStart: 1 }}
                                        >
                                            {t("clearHint")}
                                        </Typography>
                                    ) : null,
                            },
                        }}
                        sx={{ width: 300 }}
                    />

                    <Tooltip title={tActions("addList")}>
                        <IconButton
                            color="success"
                            onClick={() => setOpenCreateTodoListDialog(true)}
                            sx={{
                                marginInlineStart: "auto",
                                marginInlineEnd: 2,
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
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
                            <Typography variant="h4">{tList("addFirst")}</Typography>
                        </Button>
                    </Box>
                ) : (
                    lists.map((todoList) => (
                        <TodoListSection
                            key={todoList.id}
                            list={todoList}
                            order={listOrderById.get(todoList.id) ?? 0}
                            todos={getTodosByList(todos, todoList.id)}
                            open={openListId === todoList.id}
                            registerRef={(node) => {
                                sectionRefs.current.set(todoList.id, node);
                            }}
                            setOpen={() => {
                                const willOpen = openListId !== todoList.id;
                                setOpenListId(willOpen ? todoList.id : null);
                                if (willOpen) scrollToOpenedList(todoList.id, CLICK_SCROLL_OFFSET);
                            }}
                            addTodo={handleAddTodo}
                            toggleTodo={handleToggleTodo}
                            dropTodo={handleDeleteTodo}
                            dropTodoList={handleDeleteTodoList}
                            searchQuery={query}
                            searchActive={searchActive}
                        />
                    ))
                )}
            </Box>

            <CreateTodoListDialog
                open={openCreateTodoListDialog}
                close={(): void => {
                    setOpenCreateTodoListDialog(false);
                }}
                defaultValues={{}}
                onSubmit={handleAddTodoList}
            />
        </>
    );
}

// returns a score of how similar two strings are
// later used for querying
const similarityScore = (a: string, b: string) => {
    const x = a.toLowerCase().trim();
    const y = b.toLowerCase().trim();

    if (!y) return 0;
    if (x === y) return 100;

    let score = 0;

    if (x.startsWith(y)) score += 30;
    if (x.includes(y)) score += 20;

    let i = 0;
    for (const char of y) {
        i = x.indexOf(char, i);
        if (i === -1) break;
        score += 2;
        i++;
    }

    return score;
};
