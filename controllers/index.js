const express = require('express');
const path = require('path');
// const port = 8000;
const db = require('../config/mongoose');
const todo = require('../models/todo');
const cookieParser = require('cookie-parser');
const User = require('../models/user');
// const session = require('express-session');
const passport = require('passport')
const passportLocal = require('../config/passport-local-statergy');
// const MongoStore = require('connect-mongo');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const sign_up_func = function(req, res){
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
}

const sign_in_func = function(req, res){
  return res.render('profile.ejs', {name: req.body.name, email: req.body.email});
};

const sign_out_func = function(req, res){
  // console.log(req.user);
  // delete req.user;
  req.logout();
  // console.log(res);
  return res.redirect('/todos');
}

const main_todos = function(req, res){
  todo.find({
    // insert a filter if any
    // if you want to access filtered or only a specific part of all data.
  }, function(err, todos){
    if(err){
      console.log('error in fetching todos from db.');
      return;
    }
    // console.log(req.user);
    if(req.user != undefined){
      return res.render('home', { 
        title: "Todo List",
        todo_list: todos,
        currUserEmail: req.user.email
      });
    }
    else{
      // alert('you need to sign-in first');
      // return res.render('signin');
      return res.render('home', { 
        title: "Todo List",
        todo_list: todos,
        currUserEmail: ''
      });
    }
  });
}

const create_todo = function(req, res){
  // console.log(req);
  if(req.user == undefined || req.user == undefined)
    return res.redirect('/todos');
  todo.create({
    name: req.body.name,
    createdby: req.user.email
  },function(err, newtodo){
    if(err){
      console.log('error in creating todo.');
      return;
    }
    // console.log(newtodo);
    return res.redirect('back');
  });
}

const del_todo = function (req, res) {
  let id = req.query.id;
  todo.findByIdAndDelete(id, function(err){
    if(err){
      console.log('error in deleting data from database.');
      return;
    }
    return res.redirect('back');
  });
}

const home = function(req, res){
  // if(req.user != undefined || req.user.email != '')
  //   return res.render('profile', {name: req.body.name, email: req.body.email});
  // else
  return res.redirect('/todos');
}

module.exports = {sign_up_func, sign_in_func, sign_out_func, main_todos, create_todo, del_todo, home};