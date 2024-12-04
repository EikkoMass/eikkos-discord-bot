const { Schema, model } = require('mongoose');

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

module.exports = model('MinecraftServer', minecraftServerSchema)