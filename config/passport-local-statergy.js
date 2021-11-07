const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')
var currUserEmail = '';

//using loacal statergy to find user if he/she is signed-in
//here we authenticated the user
passport.use(new LocalStrategy({
  usernameField: 'email',
  },
  function (email, password, done) {
    User.findOne({email: email}, function(err, user){
      if(err){
        console.log('Error in finding user ( -> in Passport ).')
        return done(err);
      }
      if(!user || user.password != password){
        console.log('invalid username or password');
        return done(null, false);
      }
      currUserEmail = user.email;
      return done(null, user);
    });
  }
));

// now setting that user into the cookie
// serializing the user i.e. we find the id send it to the cookie then the cookie is sent to the browser
passport.serializeUser(function(user, done){
  // currUserEmail = user.email;
  done(null, user.id);
});

// when it comes back from the browser we need to deserialize it
//when browser makes a req. we desrialize it and find the user again
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if(err){
      console.log('Error in finding user ( -> in Passport ).')
      return done(err);
    }
    return done(null, user);
  });
});

module.exports = {passport, currUserEmail};