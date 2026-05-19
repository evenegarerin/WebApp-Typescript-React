"use client"

import { getTodoLists } from "@/actions";
import { Todo } from "@/types/Todo";
import { TodoList } from "@/types/TodoList";
import { todoPriorities, TodoPriority } from "@/types/TodoPriority";
import { TodoStatus, todoStatuses } from "@/types/TodoStatus";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem, Box, Chip, } from "@mui/material";
import { useEffect, useState } from "react";

type ConfirmDialogProps = {
    open: boolean;
    close: () => void;
    addTodo: (Todo: Todo) => void;
    listId: number | null;
};

export default function CreateTodoDialog({ open, close, addTodo, listId }: ConfirmDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [todoList, setTodoList] = useState("");
    const [status, setStatus] = useState<TodoStatus>("open");
    const [priority, setPriority] = useState<TodoPriority>("medium");
    const [dueDate, setDueDate] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const addTag = () => {
        const trimmed = tagInput.trim();
        if (!trimmed) return;
        if (!tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setTagInput("");
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const reset = () => {
        setName("");
        setDescription("");
        setTodoList(defaultTodoList)
        setStatus("open");
        setPriority("medium");
        setDueDate("");
        setTags([]);
        setTagInput("");
    };

    const handleClose = () => {
        reset();
        close();
    };

    const [defaultTodoList, setDefaultTodoList] = useState("")

    const [todoLists, setTodoLists] = useState<TodoList[]>([]);

    useEffect(() => {
        const load = async () => {
            const lists = await getTodoLists()

            setTodoLists(lists)

            const match = lists.find(list => list.id === listId);

            if (match) {
                setTodoList(match.name);
                setDefaultTodoList(match.name)
            }
        };

        load();
    }, [listId]);

    const handleConfirm = async () => {
        const list: TodoList | undefined = todoLists.find(
            (list) => list.name === todoList
        );

        if (!list) return;

        const newTodo: Todo = {
            id: Date.now(),
            name,
            description: description || undefined,
            status,
            priority,
            dueDate: dueDate || undefined,
            tags,
            listId: list.id,
        };

        addTodo(newTodo);

        reset();
        close();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Todo</DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                    />

                    <TextField
                        select
                        label="TodoList"
                        value={todoList}
                        onChange={(e) => setTodoList(e.target.value)}
                        fullWidth
                    >
                        {todoLists.map((list) => (
                            <MenuItem key={list.id} value={list.name}>
                                {list.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TodoStatus)}
                    >
                        {todoStatuses.map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Priority"
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value as TodoPriority)
                        }
                    >
                        {todoPriorities.map((p) => (
                            <MenuItem key={p} value={p}>
                                {p}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Box>
                        <Stack direction="row" spacing={1}>
                            <TextField
                                label="Add tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") addTag();
                                }}
                            />
                            <Button onClick={addTag} variant="outlined">
                                Add
                            </Button>
                        </Stack>

                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                            {tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => removeTag(tag)}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}