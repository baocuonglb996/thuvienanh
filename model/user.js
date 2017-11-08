var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');



// create a schema
var userSchema = new Schema({
  username: String,
  password:  String,
  avatar: String,
  created_at: Date,
  updated_at: Date
});
userSchema.pre('save',function(next){
  var currentDate = new Date().toISOString();
  this.avata = "./images/defalt_avatar";
  this.updated_at = currentDate;
  if(!this.created_at){
    this.created_at = currentDate;
    next();
  }
})

userSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
}
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
}
  

// the schema is useless so far
// we need to create a model using it
// var User = mongoose.model('User', userSchema);

// // make this available to our users in our Node applications
// module.exports = {
//   User     : User
// }

module.exports = mongoose.model("User", userSchema);