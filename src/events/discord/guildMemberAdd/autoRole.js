import { Client, GuildMember } from "discord.js";
import AutoRole from "../../../models/autorole.js";

/**
 *  @param {Client} client
 *  @param {GuildMember} member
 */
export default async (client, member) => {
  try {
    let guild = member.guild;
    if (!guild) return;

    const autoRole = await AutoRole.findOne({ guildId: guild.id });
    if (!autoRole) return;

    await member.roles.add(autoRole.roleId);
  } catch (e) {
    console.log(`Error giving role automatically ${e}`);
  }
};
