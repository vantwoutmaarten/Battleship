var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http'); 
var websocket = require("ws");

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// setting up server
var port = 3000; 
var server = http.createServer(app);

//Static Path
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
//
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
//app.use('/users', usersRouter);

///WEBSOCKETS
var users = 0;
const wss = new websocket.Server({ server });




wss.on("connection", function(ws) {  // new connection
   users++;
   console.log("Number of connections: " + users); 
    //let's slow down the server response time a bit to make the change visible on the client side
  
    ws.on("message", function incoming(message) {
        console.log("[LOG] " + message);
    });

    setInterval(
      () => ws.send(`${new Date()}`),
      1000
    )
});











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

server.listen(port, () => console.log('server started'));
module.exports = app;
