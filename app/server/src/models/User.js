const Schema = require('mongoose').Schema;
const SchemaTypes = require('mongoose').SchemaTypes;

const UserSchema = new Schema({
  password: {
    type: SchemaTypes.String,
    required: [true, 'Password required !']
  },
  username: {
    type: SchemaTypes.String,
    required: [true, 'Username required !']
  },
  email: {
    type: SchemaTypes.String,
    required: [ true, 'Email require !']
  }
});

class User {}

UserSchema.loadClass(User);
module.exports.User = UserSchema;


