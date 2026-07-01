export const truncate = (text: string, max: number): string =>
    text.length > max ? text.slice(0, max) + "..." : text;

const URL_REGEX = /\bhttps?:\/\/[^\s<>"')]+/gi;

export const extractUrls = (text: string): string[] => {
    const matches = text.match(URL_REGEX) ?? [];
    const cleaned = matches.map((url) => url.replace(/[.,;:!?)\]]+$/, ""));
    return Array.from(new Set(cleaned));
};
