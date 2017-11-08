var express = require('express');
var router = express.Router();
var User = require('../model/user');
var Comment = require('../model/comment');
var Image =  require('../model/image');
var Imagecensor =  require('../model/imagecensor');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var multer= require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/imagecensor')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
var upload = multer({ storage: storage })
router.post('/upload',upload.single("file"),function(req,res){

  var imagecensor = new Imagecensor({
    imagecensorPath: "/imagecensor/"+ req.file.originalname,
    title: req.body.title,
    describe: req.body.description,
    userupload: req.body.userupload
  });
  imagecensor.save(function(error){
    if(error){
      console.log(error);
    }else{
      req.flash("uploaded","Upload ảnh thành công!");
      res.redirect('/user/profile');
    }
  })
})




router.post('/register',function(req, res, next){
	if(req.body.password != req.body.retypepassword){
  		next();
  	}
  	var username = req.body.username;
  	var password = req.body.password;
  	User.findOne({ username: username }, function (err, user) {
      if (err) { return err; }
      if (user) {
        res.send({message_failure: "Name account has been used!"});
      }else{
      	 var newUser = new User();
	     newUser.username = username;
	     newUser.password = newUser.encryptPassword(password);
	     newUser.save(function(err, result){
      	if(err) return done(err);
      	console.log("registered successfully!");
      	res.send({message_success: "Sign in successfully!"});
      }); 

      }    
    });
});

router.get("/profile",isLoggedIn,function(req, res, next){
  User.findOne({_id:req.session.userid},function(err, user){
    if(err){
      return err;
    }else{
       var message = req.flash('uploaded');
      res.render("user/profile",{user: user, hasError: message.length > 0});
    }
  })
});

router.get("/login",function(req, res, next){
   var message = req.flash('error');
   res.render('user/login',{message: message, hasError: message.length > 0});
});
router.get("/logout",function(req, res, next){
  if(req.session.user){
    req.session.user = null;
  }else{
    res.redirect("/user/login");
  }
  res.redirect("/user/login");

})

router.post("/login",function(req, res, next){
  var username  = req.body.username;
  var password = req.body.password;
	if(username == "" || password == ""){
    next();
  }
  User.findOne({username:username},function(err, user){
     if(err) { return err;}
    if(!user){
       req.flash("error"," Retype username or password!");
       res.redirect("login");
    }else if(user.validPassword(password)){
      if(!req.session.user){
        req.session.user = true;
      }
        req.session.userid = user._id;
      res.redirect("/user/profile");
    }else{
      req.flash("error","retype username or password!");
       res.redirect("login");
    }
  });
});

router.post("/comment",function(req, res, next){
  var comment = new Comment();
  comment.content = req.body.comment;
  comment.user_comment = req.body.userid;
  comment.save(function(err, comment){
    if(err){ return err;}
    console.log("recorded comment successfully");
  });
  Image.update(
     { _id: req.body.imgid}, 
     { $push : { comments: {_id: comment._id}}},{new: true},
     function(err){
            if(err){
                res.send(err);
            }else{
                console.log("successfully!");
            }
  });
  User.findOne({_id: req.body.userid},function(err, user){
    if(err){ return err;}
    Comment.findByIdAndUpdate(comment._id,{username:user.username},{new: true},function(err, cmt){
      if(err) return err;
      console.log("add username successfully!");
    })
    res.send({username: user.username, avatar: user.avatar, comment: comment.content});
  });
});

function isLoggedIn(req, res, next){
  if (!req.session.user) {
        res.redirect('/user/login');
    } else {
        next();
    }
}

module.exports = router;



