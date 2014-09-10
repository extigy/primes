function tanh(x) {
  return (Math.exp(x) - Math.exp(-x))/(Math.exp(x)+Math.exp(-x));
}

function Box(px,py,bwidth) {
  this.x                = px;
  this.y                = py;
  this.type             = "test";
  this.scale            = 1;
  this.width            = bwidth;
  this.number           = Math.round(Math.random()*500);
  this.color            = window.cManager.HSV2RGB(window.cManager.numberHue(this.number),1-tanh(this.number/200),1.0-0.7*tanh(this.number/200));
}


function Board(sizex) {
  this.sizex = sizex;
  this.sizey = sizex;
  this.boxwidth = (divCoords.width)/sizex;
  this.boxes = this.makeBoxes();
}

Board.prototype.makeBoxes = function () {
  var boxes = [];
  for (x = 0; x < this.sizex; x++) {
    boxes[x] = [];
    for (y = 0; y < this.sizey; y++) {
      boxes[x].push(new Box(x,y,this.boxwidth));
    }
  }
  return boxes;
};

Board.prototype.isInside = function (loc) {
  return loc.x >= 0 && loc.x < this.sizex && loc.y >= 0 && loc.y < this.sizey;
};

Board.prototype.addBox = function (box) {
  this.boxes[box.x][box.y] = box;
};

Board.prototype.removeBox = function (box) {
  this.boxes[box.x][box.y] = new Box({'x':box.x,'y':box.y},this.boxwidth);
};

Board.prototype.getNeighbors = function (box) {
  nboxes = [];
  if(this.isInside({x:box.x+1,y:box.y})){
    nboxes.push(this.boxes[box.x+1][box.y]);
  }
  if(this.isInside({x:box.x,y:box.y+1})){
    nboxes.push(this.boxes[box.x][box.y+1])
  }
  if(this.isInside({x:box.x-1,y:box.y})){
    nboxes.push(this.boxes[box.x-1][box.y]);
  }
  if(this.isInside({x:box.x,y:box.y-1})){
    nboxes.push(this.boxes[box.x][box.y-1]);
  }
  return nboxes;
};