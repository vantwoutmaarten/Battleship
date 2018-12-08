
//jQuery(function($) {
 //   var game = new BattleShip.Game(1);
//game.start();
//});




var ws = new WebSocket("ws://localhost:3000");
    // event emmited when connected
    ws.onopen = function () {
        console.log('websocket is connected ...')
        // sending a send event to websocket server
        ws.send(JSON.stringify({ 'ready': 'true', 'player': 'A' }));
    }
    // event emmited when receiving message 
    ws.onmessage = function (ev) {
        var game = new BattleShip.Game(1);
        game.start();
    }
    
/**
 * Game constructor
 * @param {jQuery obj} player1Container
 * @param {jQuery obj} player2Container
 * @param {jQuery obj} gameStatusContainer
 */ 
BattleShip.Game = function(gameID) {
        this.playerA = null;
        this.playerB = null;
        this.id = gameID;
        this.players = 0;

    this.player1Container = $('#gridleft');
    this.player2Container = $('#gridright');
    this.gameStatusContainer = $('.game-status');
    this.fieldWidth = 10;
    this.fieldHeight = 10;
    /**
     * Player1 field
     * @type {BattleShip.Field}
     */
    this.player1Field;
    /**
     * Player2 field
     * @type {BattleShip.Field}
     */
    this.player2Field;

    this.player1turn = true;
    this.player2turn = false;
}
/**
 * Game methods
 */
BattleShip.Game.prototype = {
    /**
     * Start
     */
    start: function() {
        this.initPlayer1Field();
        this.initPlayer2Field();
        $(this.gameStatusContainer).text("User turn");
    },
   
    addPlayer: function(p) {
        console.log(players);
        players++;
        console.log(players);
        if (this.playerA == null) {
            this.playerA = p;
            return "A";
        }
        else {
            this.playerB = p;
            return "B";
        }
    },

    /**
     * Init player2 field
     */
    initPlayer2Field: function() {
        var tableR = this.player2Container
          , self = this;

        var onShotMissedHandler = function(pos) {
            $(self.gameStatusContainer).text("Other turn");
            var s1 = "#"+ pos.x + "\\|" + pos.y;
            tableR.find(s1).addClass('miss').removeClass('water');
        }

        var onShipDamagedHandler = function(pos) {
           self.markShipDamaged( tableR, pos );
        }

        var onShipDiedHandler = function(shipPositions) {
            self.markShipDied( tableR, shipPositions );
            self.markAroundShipDied( tableR, shipPositions );
        }

        var onPlayer2LostHandler = function() {
            $(self.gameStatusContainer).text('Game over');
            alert( "You win! Repeat that." );
            //what does this does again?
            location.reload();
        };

        this.player2Field = new BattleShip.Field (
              onShotMissedHandler
            , onShipDamagedHandler
            , onShipDiedHandler
            , onPlayer2LostHandler
            , this.fieldHeight
            , this.fieldWidth );

        // tableR.on('click', 'td', function() {
        //     var xCoordinate = this.cellIndex;
        //     var yCoordinate = this.parentNode.rowIndex;
        //     self.player2Field.makeShot( new BattleShip.Position( xCoordinate, yCoordinate ) );
        // });
        var player2turn = false;
        var player1turn = true;

        tableR.on('click', 'div', function() {
        //    if(this.player2turn == true){
            ws.send('this player1 shooting/player2 gets shot');
                var selected = $(this).attr("id");
                var res = selected.split("|");

            var xCoordinate = parseInt(res[0]);
            var yCoordinate = parseInt(res[1]);
                self.player2Field.makeShot( new BattleShip.Position( xCoordinate, yCoordinate ) ); // dit moeten we sturen naar de server, en dan weer naar de andere player;
                this.player2turn = false;
                this.player1turn = true;
            // }
        });

        // show ships on player2 field
        for ( var i = 0; i < this.player2Field.ships.length; i++ ) {        
            var shipPositions = this.player2Field.ships[i].getPositions();
            for ( var j = 0; j < shipPositions.length; j++ ) {
                var pos = shipPositions[j];
                var s1 = "#"+ pos.x + "\\|" + pos.y;
                tableR.find(s1).addClass('liveship').removeClass('water');
            }
        }


        // $("#gridright").children("div").click(function(){
        //         //if top one does not work this is a alternative;
        // });

    },

    /**
     * Init player1 field
     */
    initPlayer1Field: function() {

        var tableL = this.player1Container
          , self = this;

        var onShotMissedHandler = function(pos) {
            $(self.gameStatusContainer).text("User turn");
            var s1 = "#"+ pos.x + "\\|" + pos.y;
            tableL.find(s1).addClass('miss').removeClass('water');
            console.log("hello");
        }

        var onShipDamagedHandler = function(pos) {
            self.markShipDamaged( tableL, pos );
        }

        var onShipDiedHandler = function(shipPositions) {
            self.markShipDied( tableL, shipPositions );
            self.markAroundShipDied( tableL, shipPositions );
        }
        
        var onPlayer1LostHandler = function() {
            $(self.gameStatusContainer).text('Game over');
            alert( "You lose. Repeat that." );
            location.reload();
        };

        this.player1Field = new BattleShip.Field (
              onShotMissedHandler
            , onShipDamagedHandler
            , onShipDiedHandler
            , onPlayer1LostHandler
            , this.fieldHeight
            , this.fieldWidth );

        // show ships on player1 field
        for ( var i = 0; i < this.player1Field.ships.length; i++ ) {
            var shipPositions = this.player1Field.ships[i].getPositions();
            for ( var j = 0; j < shipPositions.length; j++ ) {
                var pos = shipPositions[j];
                var s1 = "#"+ pos.x + "\\|" + pos.y;
                tableL.find(s1).addClass('liveship').removeClass('water');
            }
        }
        
    tableL.on('click', 'div', function() {
     //   if(this.player1turn == true){
        ws.send('this player2 shooting/player1 gets shot');

            var selected = $(this).attr("id");
            var res = selected.split("|");

           var xCoordinate = parseInt(res[0]);
           var yCoordinate = parseInt(res[1]);
            self.player1Field.makeShot( new BattleShip.Position( xCoordinate, yCoordinate ) );
            this.player1turn = false;
            this.player2turn = true;
       //     }
        });
    },


    /**
     * Color damaged cell
     * @param {jQuery obj} table
     * @param {BattleShip.Position} pos cell position
     */
    markShipDamaged: function(table, pos) {
        var s1 = "#"+ pos.x + "\\|" + pos.y;
        table.find(s1).removeClass('liveship').addClass('hit');
        ws.send('this ship is damaged');

    },

    /**
     * Color died cell
     * @param {jQuery obj} table
     * @param {BattleShip.Position} shipPositions
     */
    markShipDied: function(table, shipPositions) {
        for ( var i = 0; i < shipPositions.length; i++ ) {
            var s1 = "#"+ shipPositions[i].x + "\\|" + shipPositions[i].y;
            table.find(s1).removeClass('hit').addClass('killed').removeClass('liveship');
        }
        ws.send('this ship died');
    },

    /**
     * Color arround cells from damaged cell
     * @param {jQuery obj} table
     * @param {BattleShip.Position} shipPositions
     */
    markAroundShipDied: function(table, shipPositions) {
        for ( var i = 0; i < shipPositions.length; i++ ) {
            for ( var x = shipPositions[i].x - 1; x <= shipPositions[i].x + 1; x++ ) {
                for ( var y = shipPositions[i].y - 1; y <= shipPositions[i].y + 1; y++ ) {
                    if ( x >= 0 && y >= 0 ) {
                        var s1 = "#"+ x + "\\|" + y;
                        table.find(s1).addClass('killed').removeClass('water');
                    }
                }
            }
        }
        ws.send('markships Around died');
    }
}