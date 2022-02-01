const express = require('express');
const path = require('path');
const port = process.env.PORT || 8000;
const db = require('./config/mongoose');
const todo = require('./models/todo');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
// const session = require('express-session');
const passport = require('passport')
const passportLocal = require('./config/passport-local-statergy');
// const MongoStore = require('connect-mongo');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
// var alert = require('alert');
const cors = require("cors");

var bodyParser = require('body-parser');
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
  },
  store: new MongoStore(
    {
      mongooseConnection: db,
      autoRemove: 'disabled'
    },
    function(err){
      console.log(err || 'connect-mongo setup ok');
    }
  )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
const { sign_up_func, sign_in_func, sign_out_func, main_todos, create_todo, del_todo, home } = require('./controllers/index');

app.get('/', cors(), home);

app.get('/todos', main_todos);

app.get('/sign-up', function(req, res){
  return res.render('signup');
});

app.get('/sign-in', function(req, res){
  return res.render('signin');
});

app.post('/create', sign_up_func);

app.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/sign-up'},
  ), sign_in_func);

app.get('/sign-out', sign_out_func);

app.get('/practice', function(req, res){
  return res.render('practice', {title : "lets play.."});
})

app.post('/create-todo', create_todo);

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

app.get('/delete-todo', del_todo);

app.post("/post_name", function (req, res) {
  // console.log("here");
  console.log(req.body.name);
});

app.listen(port, function(err){
  if(err)
    console.log("Error Occured");
  else
    console.log("Server Running on port: ", port);
});