var express = require('express');
var router = express.Router();
var Image = require('../model/image');
var Admin = require('../model/admin');
var Imagecensor =  require('../model/imagecensor');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var mv = require('mv');
var Schema = mongoose.Schema;
const fs = require('fs');


passport.use(new LocalStrategy({passReqToCallback: true},
  function(req,username, password, done) {
    Admin.findOne({ admin: username }, function (err, admin) {
      if (err) { return done(err); }
      if (!admin) {
        return done(null, false,{message:'Incorrect name or password!'});
      }
      if (!admin.validPassword(password)) {
        console.log("asjdaskdjsaldjlasjkdlasjdlsadas");
        return done(null, false, {message:'Incorrect name or password!'});   
      }
      if(!req.session.admin){
        req.session.admin = true;
      }
      return done(null, admin);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Admin.findById(id, function(err, user) {
    done(err, user);
  });
});


router.post("/",passport.authenticate('local', { successRedirect: '/admin/management',
                                   failureRedirect: '/admin/login',
                                   failureFlash: true }))

router.get('/login', function(req, res, next) {
  var message = req.flash('error');
  res.render('admin/login', {message: message, hasError: message.length > 0});
});

router.get('/management',isLoggedIn, function(req, res, next) {
    Image.find(function(err, docs){
       res.render('admin/management', { title: 'Admin management', images: docs });
   });
});

router.get('/logout', function(req, res, next) {
  if(req.session.admin){
    req.session.admin = null;
  }
  res.redirect("/");
});


router.get('/censor',isLoggedIn, function(req, res, next) {
    Imagecensor.find(function(err, docs){
       res.render('admin/censor', { imagecensors: docs });
   });
});


router.route('/updateimg').get(function(req, res){
      Image.findOne({_id: req.query.id}, function(err,result){
      var idtoupdate = req.query.id;
      if(err) throw err;
      else{
        res.render('admin/updateimg', {id_update:idtoupdate,update_image:result});
      }
    });
  });

router.route('/delimage')
.delete(function(req, res){
	if(req.body.imagetodelete){
		  //console.log("ket qua " + req.body.result_product)
		  Image.remove({'_id': req.body.imagetodelete}, function(err, product){
    		if(err) 
    			return res.send(err);
   			else
     			res.send({notify: "deleted successfully " + req.body.imagetodelete });
  
		});
	}

})
router.route('/updateimg/:_id')
.put(function(req, res){
	Image.findOneAndUpdate({_id:req.params._id},
		{"$set": {"title": req.body.title, "describe": req.body.description}}, 
		function (err) {
        if (err) res.send(err);
        res.json({notify: "updated successfully "});       
        console.log('Record updated');
    })
})

router.get('/login', function(req, res, next) {
  var message = req.flash('error');
  res.render('admin/login', {message: message, hasError: message.length > 0});
});

router.route('/censordetail').get(function(req, res){
      Imagecensor.findOne({_id: req.query.id}, function(err,result){
      var idtocensor = req.query.id;
      if(err) throw err;
      else{
        res.render('admin/censordetail', {id_censor:idtocensor,censor_image:result});
      }
    });
  });

router.post('/censored',isLoggedIn, function(req, res, next){



  Imagecensor.findOne({_id: req.body.imagetocensor}, function(err, censorimg){

    Imagecensor.remove({'_id': censorimg._id}, function(err, img){
        if(err)  return err;
    });

    var array =  censorimg.imagecensorPath.split('r/');
    mv('./public/'+censorimg.imagecensorPath, './public/images/'+array[1], function(err) {
      if(err){ return err; }   
    });

    var image = new Image({
    imagePath: "/images/"+array[1],
    title: censorimg.title,
    describe: censorimg.describe,
    });
    image.save(function(error){
    if(error) return error;
    console.log("save successfully");
    })

    res.json({message: "censored successfully "});   
  })
})


router.delete('/delsensorimage',isLoggedIn,function(req, res){
    if(req.body.imagetodelete){
      // var pathunlink = './public/imagecensor/'+
      //   fs.unlink('/12.jpg', (err) => {
      //   if (err) throw err;
      //     console.log('successfully deleted');
      //   });
      Imagecensor.remove({'_id': req.body.imagetodelete}, function(err, product){
        if(err) 
          return res.send(err);
        else
          res.send({message: "deleted successfully " + req.body.imagetodelete });
      });
  }
})




module.exports = router;

function isLoggedIn(req, res, next){
  if (!req.session.admin) {
        res.redirect('/admin/login');
    } else {
        next();
    }
}

// router.post("/login",passport.authenticate('local', { successRedirect: '/admin/management',
//                                    failureRedirect: '/admin/login',
//                                    failureFlash: true }))



// router.get('/management', isLoggedIn , function(req, res, next) {
//   Image.find(function(err, docs){
//      res.render('admin/management', { title: 'Shopping Cart', images: docs });
//   });
// });


// router.get('/' , function(req, res, next) {
//   if(req.user){
//     Image.find(function(err, docs){
//      res.render('admin/management', { title: 'Shopping Cart', images: docs });
//   });
//   }else{
//     console.log("something run here!");
//      res.redirect('/admin/login');
//   }
  
// });

// module.exports = router;

// function isLoggedIn(req, res, next){
//   if(req.isAuthenticated()){
//     console.log("fuck this shit");
//     return next();
//   }
//   console.log("fucking this shit2");
//   res.redirect('/admin/login');
// }