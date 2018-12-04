function battleship(cellarray, length, status){
        this.length = length;
        this.cellarray = cellarray;
        this.status = {"damaged":1, "killed":2, "missed":3}
}