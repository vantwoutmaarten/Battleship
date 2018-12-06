'use strict';

var game = new BattleShip.Game( $('#gridleft'), $('#gridright'), $('.game_status'), 10, 10 );
game.start();

/**
 * Game constructor
 * @param {jQuery obj} player1Container
 * @param {jQuery obj} player2Container
 * @param {jQuery obj} gameStatusContainer
 */ 
BattleShip.Game = function( player1Container, player2Container, gameStatusContainer) {

    this.player1Container = player1Container;
    this.player2Container = player2Container;
    this.gameStatusContainer = gameStatusContainer;
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
    /**
     * Init player2 field
     */
    initPlayer2Field: function() {

        var table = this.createTable( this.player2Container )
          , self = this;

        var onShotMissedHandler = function(pos) {
            $(self.gameStatusContainer).text("Other turn");
            table.find('tr').eq(pos.y).find('td').eq(pos.x).addClass('fired_cell');
        }

        var onShipDamagedHandler = function(pos) {
            self.markShipDamaged( table, pos );
        }

        var onShipDiedHandler = function(shipPositions) {
            self.markShipDied( table, shipPositions );
            self.markAroundShipDied( table, shipPositions );
        }

        var onPlayer2LostHandler = function() {
            $(self.gameStatusContainer).text('Game over');
            alert( "You win! Repeat that." );
            location.reload();
        };

        this.player2Field = new BattleShip.Field (
              onShotMissedHandler
            , onShipDamagedHandler
            , onShipDiedHandler
            , onPlayer2LostHandler
            , this.fieldHeight
            , this.fieldWidth );

        table.on('click', 'td', function() {
            var xCoordinate = this.cellIndex;
            var yCoordinate = this.parentNode.rowIndex;
            self.player2Field.makeShot( new BattleShip.Position( xCoordinate, yCoordinate ) );
        });

        $('#rightgrid').on('click', 'div', function() {
            var xCoordinate = this.index();
            var yCoordinate = this.parentNode.rowIndex;
            self.player2Field.makeShot( new BattleShip.Position( xCoordinate, yCoordinate ) );
        });
    },

    /**
     * Init player1 field
     */
    initPlayer1Field: function() {

        var table = this.createTable( this.player1Container )
          , self = this;

        var onShotMissedHandler = function(pos) {
            $(self.gameStatusContainer).text("User turn");
            table.find('tr').eq(pos.y).find('td').eq(pos.x).addClass('fired_cell');
        }

        var onShipDamagedHandler = function(pos) {
            self.markShipDamaged( table, pos );
        }

        var onShipDiedHandler = function(shipPositions) {
            self.markShipDied( table, shipPositions );
            self.markAroundShipDied( table, shipPositions );
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
                table.find('tr').eq(pos.y).find('td').eq(pos.x).addClass('live_ship');
            }
        }
    },


    /**
     * Color damaged cell
     * @param {jQuery obj} table
     * @param {BattleShip.Position} pos cell position
     */
    markShipDamaged: function(table, pos) {
        table.find('tr').eq(pos.y).find('td').eq(pos.x).removeClass('fired_cell').addClass('damaged_ship');
    },

    /**
     * Color died cell
     * @param {jQuery obj} table
     * @param {BattleShip.Position} shipPositions
     */
    markShipDied: function(table, shipPositions) {
        for ( var i = 0; i < shipPositions.length; i++ ) {
            table.find('tr').eq(shipPositions[i].y).find('td').eq(shipPositions[i].x).removeClass('fired_cell').addClass('died_ship');
        }
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
                        table.find('tr').eq(y).find('td').eq(x).addClass('fired_cell');
                    }
                }
            }
        }
    }
}