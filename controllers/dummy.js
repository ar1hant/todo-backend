// app.get('/profile', function(req, res){
//   User.findOne({email: currUserEmail}, function(err, user){
//       if(err)
//         console.log('Error in finding user ( -> in Passport ).');
//       if(!user || user.password != password)
//         console.log('invalid username or password');
//       return res.render('profile', {name: user.name, email: currUserEmail});
//     });
  // if(req.cookies.user_id){
  //   User.findById(req.cookies.user_id, function(err, user){
  //     if(err){
  //       console.log('error in profile page.');
  //       return;
  //     }
  //     if(user){
  //       // currUserEmail = user.email;
  //       return res.render('profile', {name: user.name, email: currUserEmail});
  //     }
  //     return res.redirect('/sign-in');
  //   });
  // }
  // else{
  //   // console.log('redirecting to sign-in.');
  //   return res.redirect('/sign-in');
  // }
  // return res.render('profile', {name: user.name, email: user.email});
// });

// app.post('/create-session', function(req, res){
//   User.findOne({email: req.body.email}, function(err, user){
//     if(err){
//       console.log("error in finding the user");
//       return;
//     }
//     if(user){
//       if(user.password != req.body.password){
//         return res.redirect('/sign-up');
//       }
//       else{
//         res.cookie('user_id', user._id);
//         currUserEmail = user.email;
//         return res.redirect('/profile');
//       }
//     }
//     else{
//       return res.redirect('/sign-up');
//     }
//   });
// });