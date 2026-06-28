"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    Collapse,
    Fade,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Tooltip,
    Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { TodoPriority } from "@/types/TodoPriority";
import { matchesQuery } from "@/lib/search";
import { truncate } from "@/lib/text";
import TodoCard from "@/components/todos/TodoCard";
import { TodoList } from "@/types/TodoList";
import { Todo } from "@/types/Todo";
import { TodoStatus, todoStatuses } from "@/types/TodoStatus";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DeleteIcon, AddIcon, EditIcon } from "@/components/common/icons";
import CreateTodoDialog from "@/components/todos/CreateTodoDialog";
import UpdateTodoListDialog from "@/components/todoLists/UpdateTodoListDialog";
import { TodoInput } from "@/schemas/Todo";
import { TodoListInput } from "@/schemas/TodoList";
import { updateTodoList } from "@/actions";
import type { ActionResult } from "@/actions";
import { useQueryClient } from "@tanstack/react-query";

interface TodoListSectionProps {
    list: TodoList;
    todos: Array<Todo>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    addTodo: (value: TodoInput) => Promise<ActionResult>;
    toggleTodo: (id: number) => void;
    dropTodo: (id: number) => Promise<void>;
    dropTodoList: (id: number) => void;
    searchQuery: string;
    searchActive: boolean;
}

const TodoListSection = ({
    list,
    todos,
    open,
    setOpen,
    addTodo,
    toggleTodo,
    dropTodo,
    dropTodoList,
    searchQuery,
    searchActive,
}: TodoListSectionProps) => {
    const queryClient = useQueryClient();

    const t = useTranslations("TodoList");
    const tTodo = useTranslations("Todo");
    const tStatus = useTranslations("Status");
    const tConf = useTranslations("Conformation");
    const tActions = useTranslations("Actions");

    const filterOptions = ["all", ...todoStatuses] as const;
    const sortOptions = ["default", "priority", "dueDate"] as const;

    const [filter, setFilter] = useState(filterOptions[0]);
    const [sort, setSort] = useState<(typeof sortOptions)[number]>("default");

    const sortedTodos = sortTodos(filterTodos(todos, filter), sort);

    const visibleTodos = searchQuery.trim()
        ? [
            ...sortedTodos.filter((t) => matchesQuery(t, searchQuery)),
            ...sortedTodos.filter((t) => !matchesQuery(t, searchQuery)),
        ]
        : sortedTodos;

    const hasSearchMatch =
        searchQuery.trim().length > 0 && todos.some((t) => matchesQuery(t, searchQuery));

    const highlight = searchActive && hasSearchMatch;

    const [openDeletionConformation, setOpenDeletionConformation] = useState(false);

    const handleDeleteClick = () => {
        setOpenDeletionConformation(true);
    };

    const handleConfirmDelete = () => {
        dropTodoList(list.id);
    };

    const [openCreateTodoDialog, setOpenCreateTodoDialog] = useState(false);
    const [openUpdateTodoListDialog, setOpenUpdateTodoListDialog] = useState(false);

    const toggle = () => setOpen((prev) => !prev);

    return (
        <>
            <Box
                sx={{
                    border: highlight ? "2px solid" : "1px solid",
                    borderColor: highlight ? "darkred" : open ? "divider" : "transparent",
                    borderRadius: open || highlight ? 2 : 0,
                    mb: 2,
                }}
            >
                <Box
                    onClick={!open ? toggle : undefined}
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                        p: 2,
                        paddingInlineStart: 5,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        cursor: open ? "default" : "pointer",
                        userSelect: "none",
                    }}
                >
                    <Box
                        onClick={open ? toggle : undefined}
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            paddingInlineEnd: 3,
                            flexGrow: 1,
                            minWidth: 0,
                            cursor: "pointer",
                        }}
                    >
                        <Box sx={{ minWidth: "100%" }}>
                            <Typography variant="h4" sx={{ textAlign: { xs: "center", lg: "left" } }}>{list.name}</Typography>

                            <Typography color="text.secondary" sx={{ textAlign: { xs: "center", lg: "left" } }}>
                                {list.description
                                    ? (open ? list.description : truncate(list.description, 30))
                                    : "\u00A0"}
                            </Typography>
                        </Box>

                        <Fade in={!open} unmountOnExit timeout={{ enter: 600, exit: 0 }}>
                            <Box
                                sx={{
                                    transform: { xs: "", sm: "translate(-100%, 25%)" },
                                    alignSelf: { xs: "center", sm: "normal" }
                                }}
                            >
                                <Chip
                                    color="success"
                                    variant="outlined"
                                    label={t("count", { n: todos.length })}
                                />
                            </Box>
                        </Fade>
                    </Box>



                    <Fade in={open} unmountOnExit timeout={{ enter: 600, exit: 0 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: "center",
                                flexGrow: 1,
                                marginInlineStart: 2,
                                flexShrink: 0,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    alignItems: "center",
                                    flexGrow: 1,
                                    marginInlineStart: 2,
                                    flexShrink: 0,
                                }}
                            >
                                <FormControl
                                    sx={{
                                        m: 1,
                                        width: 170,
                                    }}
                                >
                                    <InputLabel id={`filter-input-label-${list.id}`}>
                                        {t("filter")}
                                    </InputLabel>
                                    <Select
                                        size="small"
                                        labelId={`filter-input-label-${list.id}`}
                                        value={filter}
                                        label={t("filter")}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        {filterOptions.map((option) => (
                                            <MenuItem
                                                key={option}
                                                value={option}
                                                sx={{ color: filterOptionColor[option] }}
                                            >
                                                {option === "all" ? t("filterAll") : tStatus(option)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl
                                    sx={{
                                        m: 1,
                                        width: 170,
                                    }}
                                >
                                    <InputLabel id={`sort-input-label-${list.id}`}>
                                        {t("sort")}
                                    </InputLabel>
                                    <Select
                                        size="small"
                                        labelId={`sort-input-label-${list.id}`}
                                        value={sort}
                                        label={t("sort")}
                                        onChange={(e) => setSort(e.target.value)}
                                    >
                                        <MenuItem value="default">{t("sortDefault")}</MenuItem>
                                        <MenuItem value="priority">{t("sortPriority")}</MenuItem>
                                        <MenuItem value="dueDate">{t("sortDueDate")}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box>
                                <Tooltip title={tActions("addTodo")}>
                                    <IconButton
                                        color="success"
                                        onClick={() => setOpenCreateTodoDialog(true)}
                                        sx={{
                                            marginInlineStart: "auto",
                                            marginInlineEnd: 1,
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={tActions("editList")}>
                                    <IconButton
                                        onClick={() => setOpenUpdateTodoListDialog(true)}
                                        sx={{
                                            marginInlineEnd: 1,
                                        }}
                                    >
                                        <EditIcon color="action" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={tActions("deleteList")}>
                                    <IconButton
                                        color="error"
                                        onClick={handleDeleteClick}
                                        sx={{
                                            marginInlineEnd: 4,
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Fade>
                </Box>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 2,
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
                                    <Alert severity="info">{t("empty")}</Alert>

                                    <Button
                                        variant="contained"
                                        onClick={() => setOpenCreateTodoDialog(true)}
                                        sx={{
                                            height: "fit-content",
                                        }}
                                    >
                                        <Typography variant="h6">{tTodo("addFirst")}</Typography>
                                    </Button>
                                </Box>
                            ) : (
                                visibleTodos.map((todo) => (
                                    <TodoCard
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        dropTodo={dropTodo}
                                        highlight={searchActive && matchesQuery(todo, searchQuery)}
                                    />
                                ))
                            )}
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
                    setOpenCreateTodoDialog(false);
                }}
                defaultValues={{ listId: list.id }}
                onSubmit={(value: TodoInput) => addTodo(value)}
                redirectTo="/"
            />

            <UpdateTodoListDialog
                open={openUpdateTodoListDialog}
                close={(): void => {
                    setOpenUpdateTodoListDialog(false);
                }}
                defaultValues={list}
                onSubmit={(value: TodoListInput) => updateTodoList(list.id, value)}
            />
        </>
    );
};

const filterTodos = (todos: Todo[], filter: TodoStatus | "all"): Todo[] => {
    return filter === "all" ? todos : todos.filter((t) => t.status === filter);
};

const filterOptionColor: Record<"all" | TodoStatus, string | undefined> = {
    all: undefined,
    open: undefined,
    "in-progress": "info.main",
    done: "success.main",
};

const priorityRank: Record<TodoPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
};

const sortTodos = (todos: Todo[], sort: "default" | "priority" | "dueDate"): Todo[] => {
    if (sort === "priority") {
        return todos.toSorted((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
    }

    if (sort === "dueDate") {
        return todos.toSorted((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
        });
    }

    return todos;
};

export default TodoListSection;
