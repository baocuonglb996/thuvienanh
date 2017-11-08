var express = require('express');
var router = express.Router();
var Image = require('../model/image');
var User = require('../model/user');


/* GET home page. */
router.get('/', function(req, res, next) {

	//tìm hết id của img chứa comment: có 5 id chứa comment;
	// mỗi img chứa comment tìm hết tất cả các id comment để lấy nội dung.
	// object hội tụ kết quả các truy vấn cần đạt được có dạng
	// result = [{id_img_hascmt: ObjectId, comments:[{usercomment:data, content,data},{usercomment:data, content,data},..]}];
 var userid = null;
  if(req.session.user){
  	userid = req.session.userid;
  }
   result = [];

  Image.find({}) // all
  .populate('comments')
  .exec(function (err, img) {
    if (err) return handleError(err);
    
    var numberRepeat = img.length;
    for(var i = 0; i < numberRepeat; ++i){
		if(img[i].comments.length > 0){
      	// console.log(img[i]._id);
      	var obj_img = {};//object in result array'
      	var comments = [];// array in obj_img;
      	 obj_img.id_img_hascmt = img[i]._id; // each id of img that has comment will be copyed into this object.	 
          img[i].comments.forEach(function(key){
          var day_date = key.created_at.toISOString().substring(0,10).split("-").reverse().join('-');
          var hour_date = key.created_at.toISOString().substring(11,19);
          var user_content = {};// object in array comments.
    	   user_content.day_date = day_date;
    	   user_content.hour_date = hour_date;
           user_content.usercomment = key.user_comment;
           user_content.content = key.content;
           user_content.username = key.username;
   
            // try to use callback custome;
            comments.push(user_content);
          })
           obj_img.comments = comments;
           // console.log(obj_img);
           result.push(obj_img);
      }  
    }
   		Image.find(function(err, docs){

     		res.render('index', {results:result, images: docs, userlogin: req.session.user != null, userid: userid });
  		});
  });
});
router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Express' });
});


router.get('/test', function(req, res, next) {

 Image.find({},{ skip: 5, limit: 5 }, function(err, results) {
  console.log(results);
 });
  res.redirect('/');
});
// router.get('/login', function(req, res, next) {
// 	var message = req.flash('error');
// 	console.log(message);
//   res.render('login', {message: message, hasError: message.length > 0});
// });
// router.get('/userprofile',isLoggedIn, function(req, res, next) {
//   res.render('profileUser', { title: 'Express' });
// });


module.exports = router;

// function isLoggedIn(req, res, next){
//   if(req.isAuthenticated()){
//     return next();
//   }
//   res.redirect('/admin/login');
// }