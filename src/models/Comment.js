const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let commentSchema = new Schema({
   comment:{
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   transaction: {
      type: String,
      required: true
   }
},{
   timestamps: true,
   collection: 'comments'
})
module.exports = mongoose.model('comment', commentSchema);