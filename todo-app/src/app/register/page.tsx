"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material"
import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"

export default function RegisterPage() {
    const router = useRouter()
    const t = useTranslations("Auth")
    const queryClient = useQueryClient()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const { error } = await authClient.signUp.email({
            name, email, password,
        })
        if (error) {
            setError(error.message ?? t("registerFailed"))
            return
        }
        // Cache leeren, damit keine Daten des vorherigen Nutzers angezeigt werden
        queryClient.clear()
        router.push("/")
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flex: '1' }}>
            <Card variant="outlined" sx={{ width: 400 }}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <Typography variant="h5">
                                {t("register")}
                            </Typography>

                            {error && (
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                label={t("name")}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                fullWidth
                            />

                            <TextField
                                label={t("email")}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                            />

                            <TextField
                                label={t("password")}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                            />

                            <Button type="submit" variant="contained">
                                {t("register")}
                            </Button>

                            <Button component={Link} href="/login" size="small">
                                {t("haveAccount")}
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}
