"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardActions, CardContent, Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import TodoCard from "@/components/TodoCard"
import { TodoList } from "@/types/TodoList";
import { Todo } from "@/types/Todo";
import { TodoStatus, todoStatuses } from "@/types/TodoStatus";
import ConfirmDialog from "./ConfirmDialog";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import CreateTodoDialog from "@/components/CreateTodoDialog";

interface TodoListSectionProps {
    list: TodoList;
    todos: Array<Todo>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    addTodo: (Todo: Todo) => void;
    toggleTodo: (id: number) => void;
    dropTodo: (id: number) => void;
    dropTodoList: (id: number) => void;
}

const TodoListSection = ({ list, todos, open, setOpen, addTodo, toggleTodo, dropTodo, dropTodoList }: TodoListSectionProps) => {
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

                            <FormControl fullWidth sx={{
                                mb: 2,
                                marginInlineStart: 6,
                                marginBlockStart: 1,
                                width: 260
                            }}>
                                <InputLabel id="filter-input-label">Filter</InputLabel>
                                <Select
                                    labelId="filter-input-label"
                                    value={filter}
                                    label="Filter"
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    {filterOptions.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
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
                            {filterTodos(todos, filter).map(todo => (
                                <TodoCard
                                    key={todo.id}
                                    todo={todo}
                                    toggleTodo={toggleTodo}
                                    dropTodo={dropTodo}
                                />
                            ))}
                        </Box>

                    </Box>
                </Collapse>
            </Box>

            <ConfirmDialog
                open={openDeletionConformation}
                title="Delete TodoList"
                description={`Are you sure you want to delete TodoList: "${list.name}"? This action cannot be undone.`}
                onClose={() => setOpenDeletionConformation(false)}
                onConfirm={() => {
                    handleConfirmDelete();
                    setOpenDeletionConformation(false);
                }}
            />

            <CreateTodoDialog
                open={openCreateTodoDialog}
                close={(): void => {
                    setOpenCreateTodoDialog(false)
                }}
                addTodo={addTodo}
                listId={list.id} />
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