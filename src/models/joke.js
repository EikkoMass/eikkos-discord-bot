const {Schema, model} = require('mongoose');

const jokeScheme = new Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  targetUserId: {
    type: String,
    required: true
  },
  message: {
    type: String
  }
});

module.exports = model('Joke', jokeScheme);