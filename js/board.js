function tanh(x) {
  return (Math.exp(x) - Math.exp(-x))/(Math.exp(x)+Math.exp(-x));
}

function Box(px,py,bwidth) {
  this.x                = px;
  this.y                = py;
  this.type             = "empty";
  this.scale            = 1;
  this.width            = bwidth;
  this.number           = 1;
  this.color            = 0;
  this.delMark          = 0;
  //this.number           = numbers.fivesmooth[Math.floor(Math.random()*86)];
  //this.number           = numbers.elevensmooth[Math.floor(Math.random()*192)];
  //this.color            = window.cManager.HSV2RGB(window.cManager.numberHue(this.number),
  //                          0.95-0.7*tanh((factor(this.number).length-1)/2),
  //                          0.95-0.5*tanh((factor(this.number).length-1)/2));
}

Box.prototype.doColor = function() {
  fcs = factor(this.number);
  this.color = window.cManager.HSV2RGB(window.cManager.numberHue(this.number,fcs),
                            0.95-0.7*tanh((fcs.length-1)/2),
                            0.95-0.5*tanh((fcs.length-1)/2));
}


function Board(sizex) {
  this.sizex = sizex;
  this.sizey = sizex;
  this.boxwidth = (canvasDraw.canvas.width - canvasDraw.canvas.width/22)/sizex;
  this.boxes = this.makeBoxes();
}

Board.prototype.redoBoxSize = function () {
  for (x = 0; x < this.sizex; x++) {
    for (y = 0; y < this.sizey; y++) {
      this.boxes[x][y].width = (canvasDraw.canvas.width - canvasDraw.canvas.width/22)/this.sizex;
    }
  }
};

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
      this.boxes[i][j].number = psmooth[Math.floor(Math.random()*psmooth.length)];
      this.boxes[i][j].doColor();
    }
  }
  this.checkDoubles();
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

Board.prototype.getEmptyNeighbors = function (box) {
  nboxes = this.getNeighbors(box);
  oboxes = [];
  for(var i=0;i<nboxes.length;i++){
    if(nboxes[i].type == "empty"){
      oboxes.push(nboxes[i]);
    }
  }
  return oboxes;
};

Board.prototype.getPushableNeighbors = function (box) {
  var i;
  nboxes = [];
  //Lets check left
  for(i=0;i<box.x;i++){
    if(this.boxes[i][box.y].type=="empty"){
      //nboxes.push(this.boxes[i][box.y]);
      nboxes.push("left");
      break;
    }
  }
  //Lets check right
  for(i=box.x+1;i<this.sizex;i++){
    if(this.boxes[i][box.y].type=="empty"){
      //nboxes.push(this.boxes[i][box.y]);
      nboxes.push("right");
      break;
    }
  }
  //Lets check up
  for(i=0;i<box.y;i++){
    if(this.boxes[box.x][i].type=="empty"){
      //nboxes.push(this.boxes[box.x][i]);
      nboxes.push("up");
      break;
    }
  }
  return nboxes;
};

Board.prototype.pushBoxes= function (box,dir,nn) {
  var temp;
  var temp2
  switch(dir){
    case "left":
      temp2 = nn;
      for(i=box.x-1;i>=0;i--){
        temp = this.boxes[i][box.y].number
        this.boxes[i][box.y].number = temp2;
        this.boxes[i][box.y].doColor();
        temp2 = temp;
        if(this.boxes[i][box.y].type=="empty"){
          this.boxes[i][box.y].type = "number";
          break;
        }
      }
    break;
    case "right":
      temp2 = nn;
      for(i=box.x+1;i<this.sizex;i++){
        temp = this.boxes[i][box.y].number
        this.boxes[i][box.y].number = temp2;
        this.boxes[i][box.y].doColor();
        temp2 = temp;
        if(this.boxes[i][box.y].type=="empty"){
          this.boxes[i][box.y].type = "number";
          break;
        }
      }
    break;
    case "up":
      temp2 = nn;
      for(i=box.y-1;i>=0;i--){
        temp = this.boxes[box.x][i].number
        this.boxes[box.x][i].number = temp2;
        this.boxes[box.x][i].doColor();
        temp2 = temp;
        if(this.boxes[box.x][i].type=="empty"){
          this.boxes[box.x][i].type = "number";
          break;
        }
      }
    break;
  }
}

Board.prototype.applyGravity= function () {
  for (x = 0; x < this.sizex; x++) {
    clear = 0
    while(clear == 0){
      clear = 1;
      for (y = this.sizey-2; y>=0; y--) {
        if(this.boxes[x][y+1].type == "empty" && this.boxes[x][y].type == "number"){
          clear = 0;
          this.boxes[x][y+1].type = "number";
          this.boxes[x][y].type = "empty";
          this.boxes[x][y+1].number = this.boxes[x][y].number;
          this.boxes[x][y].number = 0;
          this.boxes[x][y+1].doColor();
        }
      }
    }
  }
}

Board.prototype.checkDoubles= function () {
  var update = 0
  for (x = 0; x < this.sizex; x++) {
    for (y = 0; y < this.sizey; y++) {
      if(this.boxes[x][y].type == "number" && this.doesBoxHaveADouble(this.boxes[x][y])){
        this.boxes[x][y].delMark = 1;
        update = 1
      }
    }
  }
  if(update){
    this.removeMarkedforDel();
    this.applyGravity();
    this.checkDoubles();
  }
}

Board.prototype.doesBoxHaveADouble =  function (box) {
  nboxes = this.getNeighbors(box);
  for(var i=0;i<nboxes.length;i++){
    if(nboxes[i].type == "number"){
      if(nboxes[i].number == box.number && (numbers.primes.indexOf(box.number) > -1)){
        return 1;
      }
    }
  }
}

Board.prototype.removeMarkedforDel= function () {
  for (x = 0; x < this.sizex; x++) {
    for (y = 0; y < this.sizey; y++) {
      if(this.boxes[x][y].delMark == 1){
        this.boxes[x][y].number = 0;
        this.boxes[x][y].type = "empty";
        this.boxes[x][y].delMark = 0;
      }
    }
  }
}

Board.prototype.totalScore= function () {
  var score = 1;
  for (x = 0; x < this.sizex; x++) {
    for (y = 0; y < this.sizey; y++) {
        if(this.boxes[x][y].number>0 && this.boxes[x][y].type=="number") score *= this.boxes[x][y].number;
    }
  }
  if(score == 1) return 0;
  if(score > 1000000) return score.toExponential(5);
  return score;
}