var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');



// create a schema
var adminSchema = new Schema({
  admin: String,
  password:  String ,
  created_at: Date,
  updated_at: Date
});
adminSchema.pre('save',function(next){
  var currentDate = new Date().toISOString()
  this.updated_at = currentDate;
  if(!this.created_at){
    this.created_at = currentDate;
    next();
  }
})

adminSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
}
adminSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
}
  

// the schema is useless so far
// we need to create a model using it
// var admin = mongoose.model('admin', adminSchema);

// // make this available to our admins in our Node applications
// module.exports = {
//   admin     : admin
// }

module.exports = mongoose.model("Admin", adminSchema);