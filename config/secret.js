module.exports = {
  database: 'mongodb://localhost:27017/amazon',
  port: 3030,
  secretKey: 'niraj@N9',
  facebook: {
    clientID: process.env.FACEBOOK_ID || '1191402410978514',
    clientSecret: process.env.FACEBOOK_SECRET || '945fc834c0c4393e46b943c738c798ed',
    profileFields: ['emails', 'displayNames'],
    callbackURL: 'http://localhost:3030/auth/facebook/callback'
  }
}
