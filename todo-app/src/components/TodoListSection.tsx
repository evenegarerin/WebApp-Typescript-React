"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, CardContent, Chip, Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { useTranslations } from "next-intl"
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
}

const TodoListSection = ({ list, todos, open, setOpen, addTodo, toggleTodo, dropTodo, dropTodoList }: TodoListSectionProps) => {
    const queryClient = useQueryClient();

    const t = useTranslations("TodoList");
    const tTodo = useTranslations("Todo");
    const tStatus = useTranslations("Status");
    const tConf = useTranslations("Conformation");

    const filterOptions = ["all", ...todoStatuses] as const;

    const [filter, setFilter] = useState(filterOptions[0]);

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
                border: open ? "1px solid #ddd" : "none",
                borderRadius: open ? 2 : 0,
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
                        <Typography variant="h4">
                            {list.name}
                        </Typography>

                        <Chip label={t("count", { n: todos.length })} />
                    </Box>

                </Collapse>

                <Collapse in={open} timeout="auto" unmountOnExit>-
                    <Box sx={{ p: 2 }}>

                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            borderBottom: "1px solid #ddd",
                            paddingInlineStart: 3
                        }}>
                            <Typography
                                variant="h4"
                                onClick={() => setOpen(prev => !prev)}
                            >
                                {list.name}
                            </Typography>

                            <Chip
                                label={t("count", { n: todos.length })}
                                sx={{ marginInlineStart: 2 }}
                            />

                            <FormControl fullWidth sx={{
                                mb: 2,
                                marginInlineStart: 6,
                                marginBlockStart: 1,
                                width: 260
                            }}>
                                <InputLabel id="filter-input-label">{t("filter")}</InputLabel>
                                <Select
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
                            {filterTodos(todos, filter).length === 0 ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        height: "200px",
                                        alignItems: "center",
                                    }}
                                >
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
                                filterTodos(todos, filter).map(todo => (
                                    <TodoCard
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        dropTodo={dropTodo}
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
    if (filter === "all") {
        return todos
    }

    return todos.filter(t => t.status === filter)
}

export default TodoListSection