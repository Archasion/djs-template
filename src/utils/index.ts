/**
 * Pluralize a word based on a count.
 *
 * @param count The count to check.
 * @param singular The singular form of the word.
 * @param [plural={singular}s] The plural form of the word.
 */
export function pluralize(count: number, singular: string, plural?: string): string {
    plural ??= `${singular}s`;
    return count === 1 ? singular : plural;
}

/**
 * Partition an array based on a predicate.
 *
 * @param array The array to partition.
 * @param predicate The predicate function to partition by.
 * @returns The partitioned arrays: [pass, fail].
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
    return array.reduce(([pass, fail], item) => {
        return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
    }, [[], []] as [T[], T[]]);
}