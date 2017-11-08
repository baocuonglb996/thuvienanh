var User = require("../model/user");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('localhost:27017/studying_nodejs');

var user = 
	new User({
		username: "lebaocuog",
		password: "haihk123",
	})

// var done = 0;
// for(var i = 0; i < products.length; ++i){
// 	products[i].save(function(err,result){
// 		++done;
// 		if(done === products.length){
// 			exit();
// 		}
// 	});
// }
// function exit(){
// 	mongoose.disconnect();
// }
user.save(function(err,result){
	if(err) console.log("get error")
	console.log("something run!");
});

