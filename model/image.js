var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// create a schema
var imageSchema = new Schema({
  imagePath: String,
  title: String,
  describe: String,
  comments: [{ type: Schema.Types.ObjectId ,content: String , ref: 'Comment' }],
  created_at: Date,
  updated_at: Date
});
imageSchema.pre('save',function(next){
  var currentDate = new Date().toISOString()
  this.updated_at = currentDate;
  if(!this.created_at){
    this.created_at = currentDate;
    next();
  }
})

imageSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
}
imageSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
}
// the schema is useless so far
// we need to create a model using it
// var User = mongoose.model('User', imageSchema);

// // make this available to our users in our Node applications
// module.exports = {
//   User     : User
// }
module.exports = mongoose.model("Image", imageSchema);