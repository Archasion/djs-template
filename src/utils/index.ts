export function pluralize(count: number, singular: string, plural?: string): string {
    plural ??= `${singular}s`;
    return count === 1 ? singular : plural;
}