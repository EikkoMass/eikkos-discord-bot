const { Schema, model } = require('mongoose');

const muteByGameSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  gameName: {
    type: String,
    required: true
  }
});

module.exports = model('MuteByGame', muteByGameSchema)