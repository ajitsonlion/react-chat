import * as mongoose from 'mongoose'

const roomSchema = new mongoose.Schema({
  title: String
});

export default mongoose.model('Room', roomSchema)
