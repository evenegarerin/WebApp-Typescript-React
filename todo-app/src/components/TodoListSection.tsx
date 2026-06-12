"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Card, CardActions, CardContent, Chip, Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useTranslations } from "next-intl"
import { TodoPriority } from "@/types/TodoPriority";
import { matchesQuery } from "@/lib/search";
import { truncate } from "@/lib/text";
import TodoCard from "@/components/TodoCard"
import { TodoList } from "@/types/TodoList";
import { Todo } from "@/types/Todo";
import { TodoStatus, todoStatuses } from "@/types/TodoStatus";
import ConfirmDialog from "./ConfirmDialog";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import CreateTodoDialog from "@/components/CreateTodoDialog";
import { TodoInput } from "@/schemas/Todo";
import { useQueryClient } from "@tanstack/react-query";

interface TodoListSectionProps {
    list: TodoList;
    todos: Array<Todo>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    addTodo: (value: TodoInput) => Promise<void>;
    toggleTodo: (id: number) => void;
    dropTodo: (id: number) => Promise<void>;
    dropTodoList: (id: number) => void;
    searchQuery: string;
    searchActive: boolean;
}

const TodoListSection = ({ list, todos, open, setOpen, addTodo, toggleTodo, dropTodo, dropTodoList, searchQuery, searchActive }: TodoListSectionProps) => {
    const queryClient = useQueryClient();

    const t = useTranslations("TodoList");
    const tTodo = useTranslations("Todo");
    const tStatus = useTranslations("Status");
    const tConf = useTranslations("Conformation");

    const filterOptions = ["all", ...todoStatuses] as const;
    const sortOptions = ["default", "priority", "dueDate"] as const;

    const [filter, setFilter] = useState(filterOptions[0]);
    const [sort, setSort] = useState<(typeof sortOptions)[number]>("default");

    // Derived State: gefilterte + sortierte Liste wird direkt berechnet, kein eigener State
    const sortedTodos = sortTodos(filterTodos(todos, filter), sort);

    // Treffer der globalen Suche stehen links/vorne in der Liste
    const visibleTodos = searchQuery.trim()
        ? [
            ...sortedTodos.filter(t => matchesQuery(t, searchQuery)),
            ...sortedTodos.filter(t => !matchesQuery(t, searchQuery)),
        ]
        : sortedTodos;

    const hasSearchMatch =
        searchQuery.trim().length > 0 &&
        todos.some(t => matchesQuery(t, searchQuery));

    const highlight = searchActive && hasSearchMatch;

    const [openDeletionConformation, setOpenDeletionConformation] = useState(false);

    const handleDeleteClick = () => {
        setOpenDeletionConformation(true);
    };

    const handleConfirmDelete = () => {
        dropTodoList(list.id);
    };

    const [openCreateTodoDialog, setOpenCreateTodoDialog] = useState(false);

    return (
        <>
            <Box sx={{
                border: highlight
                    ? "2px solid darkred"
                    : open ? "1px solid #ddd" : "none",
                borderRadius: open || highlight ? 2 : 0,
                mb: 2
            }}>

                <Collapse in={!open} timeout="auto" unmountOnExit>
                    <Box
                        onClick={() => setOpen(prev => !prev)}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            cursor: "pointer",
                            userSelect: "none",
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        <Box>
                            <Typography variant="h4">
                                {list.name}
                            </Typography>

                            {list.description && (
                                <Typography color="text.secondary">
                                    {truncate(list.description, 30)}
                                </Typography>
                            )}
                        </Box>

                        <Chip label={t("count", { n: todos.length })} />
                    </Box>

                </Collapse>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2 }}>

                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            borderBottom: "1px solid #ddd",
                            paddingInlineStart: 3
                        }}>
                            <Box>
                                <Typography
                                    variant="h4"
                                    onClick={() => setOpen(prev => !prev)}
                                >
                                    {list.name}
                                </Typography>

                                {list.description && (
                                    <Typography color="text.secondary">
                                        {list.description}
                                    </Typography>
                                )}
                            </Box>

                            <FormControl sx={{
                                mb: 2,
                                marginInlineStart: 2,
                                marginBlockStart: 1,
                                width: 170
                            }}>
                                <InputLabel id="filter-input-label">{t("filter")}</InputLabel>
                                <Select
                                    size="small"
                                    labelId="filter-input-label"
                                    value={filter}
                                    label={t("filter")}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    {filterOptions.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option === "all" ? t("filterAll") : tStatus(option)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl sx={{
                                mb: 2,
                                marginInlineStart: 2,
                                marginBlockStart: 1,
                                width: 170
                            }}>
                                <InputLabel id="sort-input-label">{t("sort")}</InputLabel>
                                <Select
                                    size="small"
                                    labelId="sort-input-label"
                                    value={sort}
                                    label={t("sort")}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <MenuItem value="default">{t("sortDefault")}</MenuItem>
                                    <MenuItem value="priority">{t("sortPriority")}</MenuItem>
                                    <MenuItem value="dueDate">{t("sortDueDate")}</MenuItem>
                                </Select>
                            </FormControl>

                            <IconButton
                                onClick={() => setOpenCreateTodoDialog(true)}
                                sx={{
                                    marginInlineStart: "auto",
                                    marginInlineEnd: 1
                                }}
                            >
                                <AddIcon />
                            </IconButton>

                            <IconButton
                                onClick={handleDeleteClick}
                                sx={{
                                    marginInlineEnd: 4
                                }}
                            >
                                <DeleteForeverIcon />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 2
                            }}
                        >
                            {visibleTodos.length === 0 ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        gap: 2,
                                        height: "200px",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Alert severity="info">
                                        {t("empty")}
                                    </Alert>

                                    <Button
                                        variant="contained"
                                        onClick={() => setOpenCreateTodoDialog(true)}
                                        sx={{
                                            height: "fit-content",
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {tTodo("addFirst")}
                                        </Typography>
                                    </Button>
                                </Box>
                            ) : (
                                visibleTodos.map(todo => (
                                    <TodoCard
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        dropTodo={dropTodo}
                                        highlight={searchActive && matchesQuery(todo, searchQuery)}
                                    />
                                )))}
                        </Box>

                    </Box>
                </Collapse>
            </Box>

            <ConfirmDialog
                open={openDeletionConformation}
                title={tConf("deleteListTitle")}
                description={tConf("deleteListText", { name: list.name })}
                onClose={() => setOpenDeletionConformation(false)}
                onConfirm={async () => {
                    await handleConfirmDelete();
                    setOpenDeletionConformation(false);
                    await queryClient.invalidateQueries({ queryKey: ["lists"] });
                }}
            />

            <CreateTodoDialog
                open={openCreateTodoDialog}
                close={(): void => {
                    setOpenCreateTodoDialog(false)
                }}
                defaultValues={
                    { listId: list.id }
                }
                onSubmit={async (value: TodoInput) => {
                    await addTodo(value);
                    await queryClient.invalidateQueries({ queryKey: ["todos"] });
                }}
                redirectTo="/"
            />
        </>
    )
}

const filterTodos = (todos: Todo[], filter: TodoStatus | "all"): Todo[] => {
    return filter === "all" ? todos : todos.filter(t => t.status === filter);
}

const priorityRank: Record<TodoPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
}

const sortTodos = (todos: Todo[], sort: "default" | "priority" | "dueDate"): Todo[] => {
    if (sort === "priority") {
        return todos.toSorted((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
    }

    if (sort === "dueDate") {
        return todos.toSorted((a, b) => {
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return a.dueDate.localeCompare(b.dueDate)
        })
    }

    return todos
}

export default TodoListSection