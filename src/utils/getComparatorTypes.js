export default {
    includes: (a,b) =>
    {
      return a.includes(b);
    },
    equals: (a,b) => {
      return a === b;
    },
    regex: (message, pattern) => {
      return pattern.test(message);
    },
    custom: (message, callback) => {
      return callback(message);
    }
  }