"use client"

import Overview from "@/components/Overview";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useQueryClient } from "@tanstack/react-query";


export default function Home() {
  const queryClient = useQueryClient();
  return <>
    <Overview />
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </>
}
