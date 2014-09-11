function tanh(x) {
  return (Math.exp(x) - Math.exp(-x))/(Math.exp(x)+Math.exp(-x));
}

function Box(px,py,bwidth) {
  this.x                = px;
  this.y                = py;
  this.type             = "empty";
  this.scale            = 1;
  this.width            = bwidth;
  this.number           = 0;
  this.color            = 0;
  //this.number           = numbers.fivesmooth[Math.floor(Math.random()*86)];
  //this.number           = numbers.elevensmooth[Math.floor(Math.random()*192)];
  //this.color            = window.cManager.HSV2RGB(window.cManager.numberHue(this.number),
  //                          0.95-0.7*tanh((factor(this.number).length-1)/2),
  //                          0.95-0.5*tanh((factor(this.number).length-1)/2));
}


function Board(sizex) {
  this.sizex = sizex;
  this.sizey = sizex;
  this.boxwidth = (canvasDraw.canvas.width - canvasDraw.canvas.width/22)/sizex;
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

Board.prototype.makeRandomNumbers = function(psmooth,sx,sy,wx,wy) {
  for (var i=sx;i<sx+wx;i++){
    for(var j=sy;j<sy+wy;j++){
      this.boxes[i][j].type = "number";
      this.boxes[i][j].number = psmooth[Math.floor(Math.random()*192)];
      this.boxes[i][j].color = window.cManager.HSV2RGB(window.cManager.numberHue(this.boxes[i][j].number),
                            0.95-0.7*tanh((factor(this.boxes[i][j].number).length-1)/2),
                            0.95-0.5*tanh((factor(this.boxes[i][j].number).length-1)/2));
    }
  }
}

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