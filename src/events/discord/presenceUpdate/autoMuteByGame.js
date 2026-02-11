import {
  Client,
  Presence,
  ActivityType,
  GuildMember,
  Activity,
} from "discord.js";
import MuteByGame from "../../../models/muteByGame.js";

/**
 *  @param {Client} client
 *  @param {Presence} oldPresence
 *  @param {Presence} newPresence
 */
export default async (client, oldPresence, newPresence) => {
  try {
    // only changes with the 'Playing' ActivityType.
    if (
      newPresence.user.bot ||
      (!(newPresence?.activities || []).find(
        (activity) => activity.type === ActivityType.Playing,
      ) &&
        !(oldPresence?.activities || []).find(
          (activity) => activity.type === ActivityType.Playing,
        ))
    )
      return;

    const oldActivities = (oldPresence?.activities || []).filter(
      (a) => a.type === ActivityType.Playing,
    );
    const newActivities = (newPresence?.activities || []).filter(
      (a) => a.type === ActivityType.Playing,
    );

    const startedActivities = newActivities?.filter(
      (n) => !oldActivities.some((o) => o.name === n.name),
    );
    const stoppedActivities = oldActivities?.filter(
      (o) => !newActivities.some((n) => n.name === o.name),
    );

    let channel = newPresence.member?.voice?.channel;
    if (channel && oldPresence.activities !== newPresence.activities) {
      //All users in voice except the user who triggered the presence event
      let membersOnVoice = channel.members.filter(
        (m) => m.user.id !== newPresence.user.id,
      );
      let memberIds = membersOnVoice?.map((member) => member.id);

      if (memberIds?.length) {
        let mutedMembersByDB = await MuteByGame.find({
          userId: { $in: memberIds },
          guildId: channel.guild.id,
        });

        if (!mutedMembersByDB) return;

        // started playing
        startedActivities.forEach((activity) =>
          startedActivityCallback(
            membersOnVoice,
            mutedMembersByDB,
            activity,
            newPresence,
          ),
        );

        // stopped playing
        stoppedActivities.forEach((activity) =>
          stoppedActivityCallback(
            membersOnVoice,
            mutedMembersByDB,
            activity,
            newPresence,
          ),
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
};

/**
 *  @param {Array<GuildMember>} membersOnVoice
 *  @param {Array<MuteByGame>} mutedMembersByDB
 *  @param {Activity} mainActivity
 *  @param {Presence} presence
 */
function startedActivityCallback(
  membersOnVoice,
  mutedMembersByDB,
  mainActivity,
  presence,
) {
  console.log(`${presence.user.username} started playing ${mainActivity.name}`);

  //mute
  membersOnVoice
    .filter((member) =>
      mutedMembersByDB.some(
        (memberByDB) =>
          memberByDB.userId === member.user.id &&
          mainActivity.name === memberByDB.gameName,
      ),
    )
    .forEach((member) => {
      if (
        !member.presence?.activities?.find(
          (memberActivity) => memberActivity.name === mainActivity.name,
        )
      ) {
        member.voice
          .setDeaf(true)
          .catch(() => console.log("could not deaf the user"));
        member.voice
          .setMute(true)
          .catch(() => console.log("could not mute the user"));
      }
    });
}

/**
 *  @param {Array<GuildMember>} membersOnVoice
 *  @param {Array<MuteByGame>} mutedMembersByDB
 *  @param {Activity} mainActivity
 *  @param {Presence} presence
 */
function stoppedActivityCallback(
  membersOnVoice,
  mutedMembersByDB,
  mainActivity,
  presence,
) {
  console.log(`${presence.user.username} stopped playing ${mainActivity.name}`);

  const mutedMembersByGame = membersOnVoice.filter((member) =>
    mutedMembersByDB.some(
      (memberByDB) =>
        memberByDB.userId === member.user.id &&
        mainActivity.name === memberByDB.gameName,
    ),
  );

  //check if has more people playing this game, if not, unmute
  if (
    !membersOnVoice.filter((member) =>
      member.presence?.activities?.find(
        (memberActivity) => memberActivity.name === mainActivity.name,
      ),
    )?.size
  ) {
    mutedMembersByGame.forEach((memberToUnmute) => {
      memberToUnmute.voice.setDeaf(false);
      memberToUnmute.voice.setMute(false);
    });
  }
}
