const express = require('express');
const path = require('path');
const port = 8000;
const db = require('./config/mongoose');
const todo = require('./models/todo');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const session = require('express-session');
const passport = require('passport')
var {passportLocal, currUserEmail} = require('./config/passport-local-statergy');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use('/', require('./routes'));
app.use(session({
  name: 'codeial',
  secret: 'blahblah',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: (1000* 60 * 100)
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));

app.get('/', function(req, res){
  todo.find({
    // insert a filter if any
    // if you want to access filtered or only a specific part of all data.
  }, function(err, todos){
    if(err){
      console.log('error in fetching todos from db.');
      return;
    }
    return res.render('home', 
    { 
      title: "Todo List",
      todo_list: todos,
      currUserEmail: currUserEmail
    });
  });
});

app.get('/sign-up', function(req, res){
  return res.render('signup');
});

app.get('/sign-in', function(req, res){
  return res.render('signin');
});

app.post('/create', function(req, res){
  if(req.body.password != req.body.confirm_password){
    return res.redirect('back');
  }
  User.findOne({email: req.body.email}, function(err, user){
    if(err){
      console.log("error in finding the user");
      return;
    }
    if(!user){
      User.create(req.body, function(err, user){
        if(err){
          console.log("error in finding the user");
          return;
        }
        // console.log("user created & sign-in");
        return res.redirect('/sign-in');
      });
    }
    else{
      // console.log("back user exists");
      return res.redirect('back');
    }
  });
});

app.post('/create-session', passport.authenticate(
  'local',
  {failureRedirect: '/sign-up'},
), function(req, res){
  currUserEmail = req.body.email;
  return res.redirect('/');
});

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

app.get('/practice', function(req, res){
  return res.render('practice', {title : "lets play.."});
})

app.post('/create-todo', function(req, res){
  todo.create({
    name: req.body.name,
    createdby: currUserEmail
  },function(err, newtodo){
    if(err){
      console.log('error in creating todo.');
      return;
    }
    // console.log(newtodo);
    return res.redirect('back');
  });
});

// hello
// updating the todos
app.route("/update-todo/")
    .get((req, res) => {
        const id = req.query.id;
        todo.find({}, function (err, todos) {
            if(err){
                console.log("error while finding the todos in update-todo route");
                return;
            }
            res.render("edittodo.ejs", {
                title: "todo list",
                todoTasks: todos,
                idTask: id
            });
        });
    })
    .post((req, res) => {
        const id = req.query.id;
        todo.findByIdAndUpdate(id, {
            name: req.body.name
        }, function(err){
            if (err){ return res.send(500, err);}
            return res.redirect('/'); 
        });
});

app.get('/delete-todo', function (req, res) {
  let id = req.query.id;
  todo.findByIdAndDelete(id, function(err){
    if(err){
      console.log('error in deleting data from database.');
      return;
    }
    return res.redirect('back');
  });
});
  
app.listen(port, function(err){
  if(err)
    console.log("Error Occured");
  else
    console.log("Server Running on port: ", port);
});