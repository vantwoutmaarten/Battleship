var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http'); 
var websocket = require("ws");
var messages = require("./public/javascripts/messages");

//var BattleShip = require("./public/javascripts/battleship");
//var Game = require("./public/javascripts/game");

var indexRouter = require('./routes/index');

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

var websockets = {};//property: websocket, value: game
var connectionID = 0;//each websocket receives a unique ID


//GAMEE
var Game = function (gameID) {
  this.playerA = null;
  this.playerB = null;
  this.id = gameID;
  this.players = 0;

};


Game.prototype = {
  /**
   * Start
   */
  start: function() {
      this.initPlayer1Field();
      this.initPlayer2Field();
      $(this.gameStatusContainer).text("User turn");
  },
 
  addPlayer: function(p) {
      console.log(this.players);
      this.players++;
      console.log(this.players);
      if (this.playerA == null) {
          this.playerA = p;
          return "A";
      }
      else {
          this.playerB = p;
          return "B";
      }
  }
}



var currentGame = new Game(0);

wss.on("connection", function(ws) {  // new connection
  ws.send(messages.S_PLAYER_A);
  //game.start();
 // var currentGame = new Game(gameStatus.gamesInitialized++);
   
  let con = ws; 
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log("Player %s placed in game %s as %s", con.id, currentGame.id, playerType);

   users++;
   console.log("Number of connections: " + users); 
  

   if(currentGame.players == 2) {
    game.start();
    console.log('we have 2 players, lets start!');
    ws.send('Hello');
   }
  
    //ws.on("message", function incoming(message) {
   //     console.log("[LOG] " + message);
    //});

    ws.onmessage = function(event) {

     // let incomingMsg = JSON.parse(event.data);
     //   console.log(incomingMsg.data);
     //   set player type
     //   if (incomingMsg.type == messages.T_PLAYER_TYPE) {
     //       console.log("Succes");
     //   }

         console.log("[LOG] " + message);
         //create a JSON object
         //var msg = JSON.parse(message);
         let gameObj = websockets[con.id];
         let isPlayerA = (gameObj.playerA == con) ? true : false;
       
         if (isPlayerA) {
           console.log("player A send a messsage"); 
           /*
             * player A: What move?
             
            if(msg.type == messages.T_MAKE_A_GUESS){
              gameObj.playerB.send(message);
              gameObj.setStatus("CHAR GUESSED");
          }*/

                 

         }else {
          console.log("player B send a messsage"); 
            /*
             * player B: What move?
              
            if(msg.type == messages.T_MAKE_A_GUESS){
              gameObj.playerA.send(message);
              gameObj.setStatus("CHAR GUESSED");
          }       */    

         }


         console.log("hello");
      };
   

  
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