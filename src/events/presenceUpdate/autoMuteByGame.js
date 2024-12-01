const {Client, Presence, ActivityType} = require('discord.js');
const MuteByGame = require('../../models/muteByGame');

/**
 *  @param {Client} client
 *  @param {Presence} oldPresence
 *  @param {Presence} newPresence
*/
module.exports = async (client, oldPresence, newPresence) => {
  try{
    // TODO refatorar / inverter logica (buscar por user -> loop de atividades (inverter))

    // tentar verificar apenas mudancas de atividade relacionadas a jogo
    if(newPresence.user.bot || 
      (!(newPresence?.activities || []).find(activity => activity.type === ActivityType.Playing) 
        && !(oldPresence?.activities || []).find(activity => activity.type === ActivityType.Playing))) return;

    const oldActivities = oldPresence.activities?.filter(a => a.type === ActivityType.Playing);
    const newActivities = newPresence.activities?.filter(a => a.type === ActivityType.Playing);

    const startedActivities = newActivities?.filter(n => !oldActivities.some(o => o.name === n.name));
    const stoppedActivities = oldActivities?.filter(o => !newActivities.some(n => n.name === o.name));

    let channel = newPresence.member?.voice?.channel;
    if(channel && oldPresence.activities !== newPresence.activities)
    {
      //buscar users que estao no voice channel
      // buscar no banco quais desses users possuem registro para mutar habilitado (por guilda e jogo)
      // mutar os users que possuirem registro

      // se presenceUpdate disparar quando algum user fechar o jogo, verificar se ainda nao possui ninguem com o jogo aberto na call
      startedActivities.forEach(n => {
        console.log(`${newPresence.user.username} started playing ${n.name}`);
      });
      
      stoppedActivities.forEach(o => {
        console.log(`${newPresence.user.username} stopped playing ${o.name}`);
      });

      let members = channel.members.filter(m => m.user.id !== newPresence.user.id);
      let memberIds = members?.map(member => member.id);

      if(memberIds)
      {
        let mutedMembers = await MuteByGame.find({userId: {"$in": memberIds}, guildId: channel.guild.id });
  
        if(mutedMembers)
        {
          for(let mutedMember of mutedMembers)
          {
            // started playing
            startedActivities.forEach(activity => {
              if(mutedMember.gameName === activity.name)
              {

                //mute
                let currentMember = members.find(m => m.user.id === mutedMember.userId);
                
                if(!currentMember.presence?.activities?.find(ac => ac.name === mutedMember.gameName))
                {
                  currentMember.voice.setDeaf(true).catch(() => console.log('could not deaf the user'));
                  currentMember.voice.setMute(true).catch(() => console.log('could not mute the user'));
                }

              }
            });

            // stopped playing
            stoppedActivities.forEach(activity => {
              if(mutedMember.gameName === activity.name)
              {
                //check if has more people playing this game, if not, unmute
                if(!members.filter(m => m.presence?.activities?.find(ac => ac.name === activity.name))?.size)
                {
                  let currentMember = members.find(m => m.user.id === mutedMember.userId);

                  currentMember.voice.setDeaf(false);
                  currentMember.voice.setMute(false);
                }
              }
            });
          }
        }
      }
    }
  } catch(e) {
    console.log(e);
  }
}