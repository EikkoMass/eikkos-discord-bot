const Note = require('../../../models/note');

module.exports = async (client, interaction) => {
  try {
      if(!interaction.isButton()) return;
      if(!interaction.customId?.startsWith('noteManager;')) return;
      
      await interaction.deferReply({ ephemeral: true }) ;
  
      if(interaction.customId.contains('delete;'))
      {
        const splittedId = interaction.customId.split(';');

        const note = await Note.findOne({ _id: splittedId[splittedId.length - 1] });
  
        if(!note)
        {
          await interaction.editReply(
            { 
              content: "I couldn't find that note!",   
              ephemeral: true
            }
          );
          return;
        }
    
        note.deleteOne({ _id: interaction.customId });
    
        await interaction.editReply(`Your note has been deleted.`);
      }
    } catch (err) {
        console.log(err);
    }
}