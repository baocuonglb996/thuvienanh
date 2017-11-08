var express = require('express');
var router = express.Router();
var app = express();
var multer= require('multer');
var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './public/images')
	  },
	  filename: function (req, file, cb) {
	    cb(null, file.originalname);
	  }
	})
var upload = multer({ storage: storage })
router.route('/')
.get(function(req,res){
	res.render('index');
});

router.post('/',upload.single("file"),function(req,res){

	// var product = new Product({
	// 	imagePath: "/image/"+ req.file.originalname,
	// 	title: req.body.title,
	// 	description: req.body.description,
	// 	price: req.body.price
	// });
	// product.save(function(error){
	// 	if(error){
	// 		console.log(error);
	// 	}else{
	// 		res.redirect('/user/home');
	// 	}
	// })
	console.log("successfull upload file");
	res.redirect('/');
})
module.exports = router;