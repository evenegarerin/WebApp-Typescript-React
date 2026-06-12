"use client"

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, } from "@mui/material";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onClose: () => void;
};

export default function ConfirmDialog({ open, title, description, onConfirm, onClose, }: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    {"Cancel"}
                </Button>

                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="primary"
                >
                    {"Confirm"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}