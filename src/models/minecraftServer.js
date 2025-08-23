import { Schema, model } from 'mongoose';

const minecraftServerSchema = new Schema({
  guildId: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  edition: {
    type: Number,
    required: true
  },
  name: {
    type: String,
  }
});

export default model('MinecraftServer', minecraftServerSchema);