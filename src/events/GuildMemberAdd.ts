import { Events, GuildMember } from "discord.js";
import { isWhitelisted } from "@/utils";

import Staff from "@data/staff.json";
import Roles from "@data/roles.json";
import EventListener from "@/handlers/events/EventListener";

export default class GuildMemberAdd extends EventListener {
    constructor() {
        super(Events.GuildMemberAdd);
    }

    async execute(member: GuildMember): Promise<void> {
        if (Staff.list.includes(member.id)) {
            await member.roles.add(Roles.staff);
            return;
        }

        if (isWhitelisted(member.id)) {
            await member.roles.add(Roles.alt);
            return;
        }

        // Kick the user if they are not whitelisted
        await member.send("Your account is not whitelisted").catch(() => null);
        await member.kick("Not whitelisted");
    }
}