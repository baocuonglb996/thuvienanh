var express = require('express');
var router = express.Router();
var User = require('../model/user');
var session = require('express-session');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var Image = require('../model/image');
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

router.post('/',upload.single("file"),function(req,res){

  var image = new Image({
    imagePath: "/images/"+ req.file.originalname,
  });
  image.save(function(error){
    if(error){
      console.log(error);
    }else{
      res.redirect('/');
    }
  })
})
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      console.log("line 1");
      if (err) { return done(err); }
      if (!user) {
        return done(null, false,{message:'Sai tài khoản hoặc mật khẩu'});
      }
      if (user.password != password) {
        return done(null, false, {message:'Sai tài khoản hoặc mật khẩu'});   
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log("line2");
	console.log(user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
  	console.log("line 3");
    done(err, user);
  });
});


router.post("/",passport.authenticate('local', { successRedirect: '/userprofile',
                                   failureRedirect: '/login',
                                   failureFlash: true }))

router.get("/relation", function(req, res, next){
  var item = new Item({name: 'somethingfun'});
  item.save(function(err) {

    // Store.findOne({_id:"59d79177c7acfa10acfbe2ca"}, function(err, myStore){
    //   if(err) throw err;
    //   console.log("this line run");
    //   console.log(myStore);
    if(err) throw err;
    console.log("this line has run!");
    // })
    Store.update(
     { _id: "59d79177c7acfa10acfbe2ca"}, 
     { $push : { itemsInStore: {_id: item._id}}},{new: true},
     function(err){
            if(err){
                res.send(err);
            }else{
                console.log("successfully!");
            }
    });
  });
  res.redirect("/");
})
router.get("/store",function(req, res, next){
    var store = new Store({name:"myStore"});
    store.save(function(err){
      if(err) throw err;
      else{
        console.log("ok successfully");
         res.redirect('/');
      }
    })
})


//deleting a item associates to id
router.get("/delete",function(req, res, next){
  Item.remove({_id: "59e19caf4dea8b07cc8d4295"}, function(err, removed){
    if(err) return err;
    console.log("removed successfully!");
     res.redirect("/");
  })
})

// delete id of item in store.
router.get("/deleteidinstore",function(req, res, next){
  Store.update({_id: "59d79177c7acfa10acfbe2ca"},{ $pull: { 'itemsInStore': { $in : ["59e19caf4dea8b07cc8d4295"] } } },
     function(err, obj){
            if(err){
                res.send(err);
            }else{
                console.log(" removed successfully!");
                console.log(obj);
                 res.redirect("/");
            }
    })
})


router.get("/getid",function(req, res, next){
  Item.find(function(err, result){
    console.log(result);
    res.render('getid', { result: result });
  })
})

// password user is hashed 
router.get("/hashpassword",function(req, res, next){
  var user = new User();
  user.username = "gicungduoc";
  user.password = user.encryptPassword("haihk123");
  user.save(function(err, result){
      if(err) return err;
      console.log("created successfully")
      res.redirect("/");
  })
})
// get items in store that 
router.get("/itemsinstore",function(req, res, next){
    
  Store.find({}) // all
  .populate('itemsInStore')
  .exec(function (err, stores) {
    if (err) return handleError(err);
    console.log(stores);
    console.log("...............................");
    console.log(stores.length);
    console.log("...............................");
    console.log(stores[1].itemsInStore.length);
    stores[0].itemsInStore.forEach(function(key){
      console.log(key._id);
    });
    var numberRepeat = stores.length;
    for(var i = 0; i < numberRepeat; ++i){
      if(stores[i].itemsInStore.length > 0){
          stores[i].itemsInStore.forEach(function(key){
            console.log(key.name);
          })
      }
      
    }
    res.redirect("/"); 
});
})


// test image model

router.get('/imagemodel',function(req, res, next){
  var image = new Image();
  image.imagePath = "path of image2";
  image.describe  = "describe of image2";
  image.comment = [{_id:"59d7971d77839f13ecb2af61",content:"it so funny haha"}];

  image.save(function(err, result){
      if(err) return err;
      console.log(" image has been created successfully");
      res.redirect("/");
  })
});

module.exports = router;

