/**
 * Pluralize a word based on a count.
 *
 * @param count The count to check.
 * @param singular The singular form of the word.
 * @param [plural={singular}s] The plural form of the word.
 */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
    return count === 1 ? singular : plural;
}