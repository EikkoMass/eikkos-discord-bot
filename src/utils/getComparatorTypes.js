export default {

    includes: (message, fraction)   => message.content.includes(fraction),

    equals:   (message, reference)  => message.content === reference,

    regex:    (message, pattern)    => pattern.test(message.content),

    custom:   (message, callback)   => callback(message)
  
  }