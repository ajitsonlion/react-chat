import * as mongoose from 'mongoose'
// import imageSchema from './imageSchema'

const imageSchema = new mongoose.Schema({
   data: String,
   contentType: String
});

const messageSchema = new mongoose.Schema({
  user: String,
  content: String,
  room: String,
  image: String 
});

export default mongoose.model('Message', messageSchema)
