"use client"

import { useState } from "react"
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query"

interface Props { children: React.ReactNode }

export default function QueryProvider({ children }: Props) {
    const [client] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}