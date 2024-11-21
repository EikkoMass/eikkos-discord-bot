const { Schema, model } = require('mongoose');

const dirtyWordSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  word: {
    type: String,
    required: true
  }
});

module.exports = model('DirtyWord', dirtyWordSchema)