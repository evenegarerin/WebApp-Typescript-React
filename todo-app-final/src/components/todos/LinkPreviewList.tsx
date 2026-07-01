"use client";

import { useQueries } from "@tanstack/react-query";
import { Box } from "@mui/material";
import { fetchLinkPreview } from "@/actions";
import LinkPreview from "@/components/todos/LinkPreview";

interface Props {
    urls: string[];
}

const STALE_TIME = 1000 * 60 * 60;

export default function LinkPreviewList({ urls }: Props) {
    const queries = useQueries({
        queries: urls.map((url) => ({
            queryKey: ["link-preview", url],
            queryFn: () => fetchLinkPreview(url),
            staleTime: STALE_TIME,
            retry: false,
        })),
    });

    let renderIndex = -1;
    for (let i = 0; i < queries.length; i++) {
        if (queries[i].data != null) {
            renderIndex = i;
            break;
        }
        if (queries[i].isLoading) {
            renderIndex = i;
            break;
        }
    }

    if (renderIndex === -1) return null;

    return (
        <Box sx={{ mt: 2 }}>
            <LinkPreview url={urls[renderIndex]} />
        </Box>
    );
}
