function cell(x, y){
    this.x = x;
    this.y = y;
    this.getx = function(){ return this.x; };
    this.setx = function(x){ this.x = x; };
    this.gety = function(){ return this.y; };
    this.sety = function(y){ this.y = y; };

    var isWater = false;
    var isClicked = false;
    var isHIT = false;
}