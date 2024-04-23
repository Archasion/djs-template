import { ChatInputCommandInteraction, Collection, EmbedBuilder, Snowflake, userMention } from "discord.js";
import { db, WhitelistEntry } from "@/index";

import Command from "@/handlers/commands/Command";

export default class ListAltAccounts extends Command<ChatInputCommandInteraction> {
    constructor() {
        super({
            name: "list-alt-accounts",
            description: "List a mapping of alt accounts and their owners."
        });
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const query = db.query<WhitelistEntry, []>(`
            SELECT *
            FROM whitelist
        `);

        const result = query.all();

        if (!result.length) {
            await interaction.reply({
                content: "No alt accounts found.",
                ephemeral: true
            });
            return;
        }

        const mappedAccounts = new Collection<Snowflake, Snowflake[]>();

        for (const account of result) {
            const list = mappedAccounts.get(account.owner_id);

            if (list) {
                list.push(account.alt_id);
                continue;
            }

            mappedAccounts.set(account.owner_id, [account.alt_id]);
        }

        const description = mappedAccounts.map((alts, ownerId) => {
            return `${userMention(ownerId)} → ${alts.map(userMention).join(", ")}`;
        });

        const embed = new EmbedBuilder()
            .setTitle("Owner → Alt")
            .setDescription(description.join("\n"));

        await interaction.reply({
            embeds: [embed],
            allowedMentions: { parse: [], repliedUser: true },
            ephemeral: true
        });
    }
}