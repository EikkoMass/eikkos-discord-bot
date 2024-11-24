const {Client, Presence, ActivityType} = require('discord.js');
const MuteByGame = require('../../models/muteByGame');

/**
 *  @param {Client} client
 *  @param {Presence} oldPresence
 *  @param {Presence} newPresence
*/
module.exports = async (client, oldPresence, newPresence) => {
  try{
    //TODO testes
    if(true) return;

    // tentar verificar apenas mudancas de atividade relacionadas a jogo
    if(newPresence.user.bot || !newPresence.activities.find(activity => activity.type === ActivityType.Playing)) return;

    let channel = newPresence.member?.voice?.channel;
    if(channel && oldPresence.activities !== newPresence.activities)
    {
      //buscar users que estao no voice channel
      // buscar no banco quais desses users possuem registro para mutar habilitado (por guilda e jogo)
      // mutar os users que possuirem registro

      // se presenceUpdate disparar quando algum user fechar o jogo, verificar se ainda nao possui ninguem com o jogo aberto na call
      console.log(channel.members);
      newPresence.activities.filter(newP => !oldPresence.activities.some(oldP => oldP.name === newP.name)).forEach(n => {
        console.log(`${newPresence.user.username} started playing ${n.name}`);
      });

      oldPresence.activities.filter(oldP => !newPresence.activities.some(newP => newP.name === oldP.name)).forEach(o => {
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
            newPresence.activities.filter(newP => !oldPresence.activities.some(oldP => oldP.name === newP.name)).forEach(activity => {
              if(mutedMember.gameName === activity.name)
              {
                //mute
                let currentMember = members.find(m => m.user.id === mutedMember.userId);
                
                if(!currentMember.activities.find(ac => ac.name === mutedMember.gameName))
                {
                  currentMember.voice.setDeaf(true);
                  currentMember.voice.setMute(true);
                }

              }
            });

            // stopped playing
            oldPresence.activities.filter(oldP => !newPresence.activities.some(newP => newP.name === oldP.name)).forEach(activity => {
              if(mutedMember.gameName === activity.name)
              {
                //check if has more people playing this game, if not, unmute
                if(!members.filter(m => m.activities.find(ac => ac.name === activity.name) && m.user.id !== newPresence.member.user.id))
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