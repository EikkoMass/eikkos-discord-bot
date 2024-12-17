const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = model('Note', noteSchema)