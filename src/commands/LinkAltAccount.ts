import { ApplicationCommandOptionType, ChatInputCommandInteraction, roleMention } from "discord.js";
import { isWhitelisted } from "@/utils";
import { db } from "./..";

import Command from "@/handlers/commands/Command";
import Roles from "@data/roles.json";
import Staff from "@data/staff.json";

// noinspection JSUnusedGlobalSymbols
export default class LinkAltAccount extends Command<ChatInputCommandInteraction> {
    constructor() {
        super({
            name: "link-alt-account",
            description: "Whitelist an alt account in the testing server",
            options: [{
                name: "alt",
                description: "The alt account to link",
                type: ApplicationCommandOptionType.User,
                required: true
            }]
        }, []);
    }

    async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const member = interaction.options.getMember("alt");
        const user = member?.user ?? interaction.options.getUser("alt", true);

        if (Staff.list.includes(user.id)) {
            await interaction.reply({
                content: "You cannot link a staff member as an alt account!",
                ephemeral: true
            });

            return;
        }

        if (isWhitelisted(user.id)) {
            await interaction.reply({
                content: "This user is already linked as an alt account!",
                ephemeral: true
            });
            return;
        }

        // Insert the user into the whitelist table
        const insert = db.query(`
            INSERT OR IGNORE INTO whitelist
            VALUES ($alt_id, $owner_id)
        `);

        insert.run({
            $alt_id: user.id,
            $owner_id: interaction.user.id
        });

        if (member) {
            await member.roles.add(Roles.alt);
            await interaction.reply({
                content: `Successfully linked ${member} (\`${member.id}\`) as an alt account and added the ${roleMention(Roles.alt)} role!`,
                allowedMentions: { parse: [], repliedUser: true },
                ephemeral: true
            });
            return;
        }

        await interaction.reply({
            content: `Successfully linked ${user} (\`${user.id}\`) as an alt account!`,
            ephemeral: true
        });
    }
}