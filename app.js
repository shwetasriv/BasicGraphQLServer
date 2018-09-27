import schema from './graphql/Schema/Schema';
import ToDo from  "./mongoose/todo";
import graphqlHTTP from 'express-graphql';


var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');

var app = express();

mongoose.connect('mongodb://localhost:27017/local')
var db = mongoose.connection;
db.on('error', ()=> {console.log( '---FAILED to connect to mongoose')})
db.once('open', () => {
 console.log( '+++Connected to mongoose')
});

app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/index.html')
 });

 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/quotes',(req,res)=>{
  // Insert into TodoList Collection
  var todoItem = new ToDo({
   itemId:1,
   item:req.body.item,
   completed: false
  })
 todoItem.save((err,result)=> {
   if (err) {console.log("---TodoItem save failed " + err)}
   console.log("+++TodoItem saved successfully "+todoItem.item)
 res.redirect('/')
  })
 });

 app.use('/graphql', graphqlHTTP (req => ({
  schema
  //,graphiql:true
 })))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
