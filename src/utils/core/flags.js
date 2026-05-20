import { GuildMember, PermissionFlagsBits } from "discord.js";

/**
 *
 * @param {Array<PermissionFlagsBits> | PermissionFlagsBits} flags
 * @param {GuildMember} member
 * @returns
 */
export function validator(flags, member) {
  if (!member) return false;

  let isArray = Array.isArray(flags);

  if (flags === null || flags === undefined || (isArray && !flags.length))
    return true;
  if (!isArray) return member.permissions.has(flags);

  return flags.every((flag) => member.permissions.has(flag));
}

export default {
  validator,
};
