import { Snowflake } from "discord.js";
import { db } from "@/index";

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

export function isWhitelisted(id: Snowflake): boolean {
    const query = db.query(`
        SELECT *
        FROM whitelist
        WHERE alt_id = $id
    `);

    return Boolean(query.get(id));
}