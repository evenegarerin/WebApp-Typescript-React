"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Link as MuiLink,
    Skeleton,
    Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { fetchLinkPreview } from "@/actions";

interface Props {
    url: string;
}

const IMAGE_SIZE = 96;

const safeHostname = (url: string): string => {
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
};

const ellipsisLine = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
} as const;

export default function LinkPreview({ url }: Props) {
    const t = useTranslations("LinkPreview");

    const { data, isLoading } = useQuery({
        queryKey: ["link-preview", url],
        queryFn: () => fetchLinkPreview(url),
        staleTime: 1000 * 60 * 60,
        retry: false,
    });

    if (isLoading) {
        return (
            <Card
                variant="outlined"
                sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, height: IMAGE_SIZE }}
            >
                <Skeleton variant="rounded" width={IMAGE_SIZE - 16} height={IMAGE_SIZE - 16} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton width="40%" />
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                </Box>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card variant="outlined" sx={{ p: 1 }}>
                <MuiLink
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ overflowWrap: "anywhere" }}
                >
                    {url}
                </MuiLink>
                <Typography variant="caption" color="text.secondary" display="block">
                    {t("unavailable")}
                </Typography>
            </Card>
        );
    }

    const host = data.siteName ?? safeHostname(data.url);

    return (
        <Card variant="outlined">
            <CardActionArea
                component="a"
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    display: "flex",
                    alignItems: "stretch",
                    justifyContent: "flex-start",
                    height: IMAGE_SIZE,
                    overflow: "hidden",
                }}
            >
                {data.image && (
                    <CardMedia
                        component="img"
                        image={data.image}
                        alt={data.title ?? host}
                        sx={{
                            width: IMAGE_SIZE,
                            height: IMAGE_SIZE,
                            objectFit: "cover",
                            flexShrink: 0,
                        }}
                    />
                )}

                <CardContent
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        py: 1,
                        "&:last-child": { pb: 1 },
                    }}
                >
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}
                    >
                        {data.favicon && (
                            <img
                                src={data.favicon}
                                alt=""
                                width={14}
                                height={14}
                                style={{ borderRadius: 2, flexShrink: 0 }}
                            />
                        )}
                        <Box component="span" sx={ellipsisLine}>
                            {host}
                        </Box>
                    </Typography>

                    <Typography variant="subtitle2" sx={ellipsisLine}>
                        {data.title ?? data.url}
                    </Typography>

                    {data.description && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                overflow: "hidden",
                                minHeight: 0,
                            }}
                        >
                            {data.description}
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
