"use client"

import { TodoList } from "@/types/TodoList";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

type ConfirmDialogProps = {
    open: boolean;
    close: () => void;
    addTodoList: (todoList: TodoList) => void;
};

export default function CreateTodoListDialog({ open, close, addTodoList }: ConfirmDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const reset = () => {
        setName("");
        setDescription("");
    };

    const handleClose = () => {
        reset();
        close();
    };

    const handleConfirm = async () => {
        const newTodoList: TodoList = {
            id: Date.now(),
            name,
            description: description || undefined
        };

        addTodoList(newTodoList);

        reset();
        close();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Create TodoList</DialogTitle>

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