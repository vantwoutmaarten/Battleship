'use strict';
/**
 * Ship constructor
 */
BattleShip.Ship = function() {
    this.cellWidgets = [];
}

/**
 * Ship methods
 */
BattleShip.Ship.prototype = {

    /**
     * isDead
     * @returns {Boolean} is ship dead?
     */
    isDead: function() {
        var isDead = true;
        for ( var i =0; i < this.cellWidgets.length; i++ ) {
            if ( !this.cellWidgets[i].isFired ) {
                isDead = false;
                break;
            }
        }
        return isDead;
    },

    /**
     * Get ship positions
     * @return {BattleShip.Position}
     */
    getPositions: function() {
        var result = [];
        for ( var i = 0; i < this.cellWidgets.length; i++ ) {
            result.push( this.cellWidgets[i].pos );
        }
        return result;
    }
}


