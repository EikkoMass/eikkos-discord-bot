import { GuildMember, PermissionFlagsBits } from "discord.js";

/**
 *
 * @param {Array<PermissionFlagsBits>} requiredFlags
 * @param {GuildMember} member
 * @returns
 */
export function validator(requiredFlags, member) {
  if (!member) return false;
  if (!requiredFlags || requiredFlags.length === 0) return true;

  return requiredFlags.every((flag) => member.permissions.has(flag));
}

export default {
  validator,
};
