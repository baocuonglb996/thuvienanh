var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = Schema({
    content : String,
    user_comment: { type: Schema.Types.ObjectId, ref: 'User' },
    username: String,
    created_at: Date,
  	updated_at: Date
});

commentSchema.pre('save',function(next){
  var currentDate = new Date().toISOString()
  this.updated_at = currentDate;
  if(!this.created_at){
    this.created_at = currentDate;
    next();
  }
})

module.exports = mongoose.model("Comment", commentSchema);