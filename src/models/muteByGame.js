import { Schema, model } from 'mongoose';

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

export default model('MuteByGame', muteByGameSchema);