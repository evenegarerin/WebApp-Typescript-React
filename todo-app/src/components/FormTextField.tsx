"use client"

import { TextField } from "@mui/material"
import type { AnyFieldApi } from "@tanstack/react-form"

interface FormTextFieldProps {
    field: AnyFieldApi
    label: string
    multiline?: boolean
    minRows?: number
}

// Kapselt das form.Field + TextField-Boilerplate (Wert, onChange, onBlur,
// Fehleranzeige) in eine wiederverwendbare Komponente.
export default function FormTextField({ field, label, multiline, minRows }: FormTextFieldProps) {
    return (
        <TextField
            label={label}
            value={field.state.value ?? ""}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors.length > 0}
            helperText={field.state.meta.errors[0]?.message}
            fullWidth
            multiline={multiline}
            minRows={minRows}
        />
    )
}
