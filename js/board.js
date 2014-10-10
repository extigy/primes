function Box(px,py,bwidth) {
  this.x                = px;
  this.y                = py;
  this.type             = "empty";
  this.scale            = 1;
  this.width            = bwidth;
  this.number           = 1;
  this.color            = 0;
  this.delMark          = 0;
  this.shiftx           = 0;
  this.shifty           = 0;
  this.nextno           = 0;
  this.inAnim           = 0;
}

Box.prototype.doColor = function() {
  fcs = factor(this.number);
  this.color = cManager.HSV2RGB(cManager.numberHue(this.number,fcs),
                            0.95-0.7*tanh((fcs.length-1)/2),
                            0.95-0.5*tanh((fcs.length-1)/2));
}


function Board(sizex) {
  this.sizex = sizex;
  this.boxwidth = (canvasDraw.canvas.width - canvasDraw.canvas.width/22)/sizex;
  this.boxes = this.makeBoxes();
}

Board.prototype.redoBoxSize = function () {
  this.boxwidth = (canvasDraw.canvas.width - canvasDraw.canvas.width/22)/this.sizex;
  for (x = 0; x < this.sizex; x++) {
    for (y = 0; y < this.sizex; y++) {
      this.boxes[x][y].width = this.boxwidth;
    }
  }
};

Board.prototype.makeBoxes = function () {
  var boxes = [];
  for (x = 0; x < this.sizex; x++) {
    boxes[x] = [];
    for (y = 0; y < this.sizex; y++) {
      boxes[x].push(new Box(x,y,this.boxwidth));
    }
  }
  return boxes;
};

Board.prototype.makeRandomNumbers = function(psmooth,sx,sy,wx,wy) {
  for (i=sx;i<sx+wx;i++){
    for(j=sy;j<sy+wy;j++){
      this.boxes[i][j].type = "number";
      this.boxes[i][j].inAnim = 0;
      this.boxes[i][j].number = psmooth[Math.floor(Math.random()*psmooth.length)];
      this.boxes[i][j].doColor();
    }
  }
  this.checkDoubles();
}

Board.prototype.isInside = function (loc) {
  return loc.x >= 0 && loc.x < this.sizex && loc.y >= 0 && loc.y < this.sizex;
};

Board.prototype.getNeighbors = function (box) {
  nboxes = [];
  if(this.isInside({x:box.x+1,y:box.y})){
    this.boxes[box.x+1][box.y].rel = "left"
    nboxes.push(this.boxes[box.x+1][box.y]);
  }
  if(this.isInside({x:box.x,y:box.y+1})){
    this.boxes[box.x][box.y+1].rel = "up"
    nboxes.push(this.boxes[box.x][box.y+1])
  }
  if(this.isInside({x:box.x-1,y:box.y})){
    this.boxes[box.x-1][box.y].rel = "right"
    nboxes.push(this.boxes[box.x-1][box.y]);
  }
  if(this.isInside({x:box.x,y:box.y-1})){
    this.boxes[box.x][box.y-1].rel = "down"
    nboxes.push(this.boxes[box.x][box.y-1]);
  }
  return nboxes;
};

Board.prototype.getEmptyNeighbors = function (box) {
  nboxes = this.getNeighbors(box);
  oboxes = [];
  for(i=0;i<nboxes.length;i++){
    if(nboxes[i].type == "empty"){
      oboxes.push(nboxes[i]);
    }
  }
  return oboxes;
};

Board.prototype.getPushableNeighbors = function (box) {
  nboxes = [];
  for(i=0;i<box.x;i++){
    if(this.boxes[i][box.y].type=="empty"){
      nboxes.push("left");
      break;
    }
  }

  for(i=box.x+1;i<this.sizex;i++){
    if(this.boxes[i][box.y].type=="empty"){
      nboxes.push("right");
      break;
    }
  }

  for(i=0;i<box.y;i++){
    if(this.boxes[box.x][i].type=="empty"){
      nboxes.push("up");
      break;
    }
  }
  return nboxes;
};

Board.prototype.pushBoxes= function (box,dir,nn,on) {
  var temp;
  var temp2;
  switch(dir){
    case "left":
      temp = this.boxes[box.x-1][box.y].number
      temp2 = nn;
      this.boxes[box.x-1][box.y].shiftx = 1;
      this.animatePull(this.boxes[box.x-1][box.y],this.boxes[box.x][box.y],temp2,on,"right",1);
      for(i=box.x-1;i>0;i--){
        this.boxes[i-1][box.y].shiftx = 1;
        temp3 = this.boxes[i-1][box.y].number;
        temp2 = this.boxes[i][box.y].number
        this.animatePull(this.boxes[i-1][box.y],this.boxes[i][box.y],temp,temp2,"right",0);
        temp = temp3;
        if(this.boxes[i-1][box.y].type=="empty"){
          break;
        }
        this.boxes[i-1][box.y].type = "moving";
      }
      break;
    case "right":
      temp = this.boxes[box.x+1][box.y].number
      temp2 = nn;
      this.boxes[box.x+1][box.y].shiftx = -1;
      this.animatePull(this.boxes[box.x+1][box.y],this.boxes[box.x][box.y],temp2,on,"left",1);
      for(i=box.x+1;i<this.sizex-1;i++){
        this.boxes[i+1][box.y].shiftx = -1;
        temp3 = this.boxes[i+1][box.y].number;
        temp2 = this.boxes[i][box.y].number
        this.animatePull(this.boxes[i+1][box.y],this.boxes[i][box.y],temp,temp2,"left",0);
        temp = temp3;
        if(this.boxes[i+1][box.y].type=="empty"){
          break;
        }
        this.boxes[i+1][box.y].type = "moving";
      }
      break;
    case "up":
      temp = this.boxes[box.x][box.y-1].number
      temp2 = nn;
      this.boxes[box.x][box.y-1].shifty = 1;
      this.animatePull(this.boxes[box.x][box.y-1],this.boxes[box.x][box.y],temp2,on,"down",1);
      for(i=box.y-1;i>0;i--){
        this.boxes[box.x][i-1].shifty = 1;
        temp3 = this.boxes[box.x][i-1].number;
        temp2 = this.boxes[box.x][i].number
        this.animatePull(this.boxes[box.x][i-1],this.boxes[box.x][i],temp,temp2,"down",0);
        temp = temp3;
        if(this.boxes[box.x][i-1].type=="empty"){
          break;
        }
        this.boxes[box.x][i-1].type = "moving";
      }
  }
}

Board.prototype.animatePull= function (box,sourcebox,nn,on,rel,scaler) {
  box.number = nn;
  box.doColor();
  sourcebox.number = on;
  sourcebox.doColor();
  window.canvasDraw.animManager.addBoxPull(box,sourcebox,rel,scaler,function(box,sourcebox){
    box.shifty = 0;
    box.shiftx = 0;
    sourcebox.shifty = 0;
    sourcebox.shiftx = 0;
    box.scale = 1
    box.type = "number";
    sourcebox.type = "number"
    lManager.board.applyGravity()
  })
}



Board.prototype.animateDrop= function (oldbox,newbox,nn) {
  newbox.type = "moving"
  newbox.nextno = nn;
  window.canvasDraw.animManager.addBoxDrop(oldbox,newbox,"down",function(topbox,botbox){
    botbox.type = "number";
    topbox.type = "empty";
    botbox.number = botbox.nextno;
    botbox.nn = 0;
    topbox.number = 0;
    topbox.shifty = 0;
    topbox.shiftx = 0;
    botbox.shifty = 0;
    botbox.shiftx = 0;
    botbox.doColor();
    lManager.board.applyGravity()
  })
}

Board.prototype.applyGravity= function () {
  var flag = 0
  for (x = 0; x < this.sizex; x++) {
    for (y = this.sizex-2; y>=0; y--) {
      if(this.boxes[x][y+1].type == "empty" && this.boxes[x][y].type == "number"){
        this.animateDrop(this.boxes[x][y],this.boxes[x][y+1],this.boxes[x][y].number);
        flag = 1
      }
    }
  }
  return(flag);
}

Board.prototype.checkDoubles= function () {
  var flag = 0
  for (x = 0; x < this.sizex; x++) {
    for (y = 0; y < this.sizex; y++) {
      if(this.boxes[x][y].type == "number" && this.doesBoxHaveADouble(this.boxes[x][y])){
          flag = 1
          this.boxes[x][y].delMark = 1
      }
    }
  }
  if(flag){
    lManager.inputManager.locked = 1;
    this.removeMarkedforDel();
  }
}

Board.prototype.doesBoxHaveADouble =  function (box) {
  nboxes = this.getNeighbors(box);
  for(i=0;i<nboxes.length;i++){
    if(nboxes[i].type == "number"){
      if(nboxes[i].number == box.number && (numbers.primes.indexOf(box.number) > -1)){
        return 1;
      }
    }
  }
}

Board.prototype.removeMarkedforDel= function () {
  for (x = 0; x < this.sizex; x++) {
    for (y = 0; y < this.sizex; y++) {
      if(this.boxes[x][y].delMark){
        if(!this.boxes[x][y].inAnim){
          canvasDraw.animManager.shrinkBox(this.boxes[x][y],function(box){
            box.number = 0;
            box.type = "empty";
            box.delMark = 0;
            box.scale = "1.0";
            if(canvasDraw.animManager.animFinished()){
             lManager.board.applyGravity()
           }
          });
        }
      }
    }
  }
}



Board.prototype.totalScore= function () {
  var score = 1;
  for (x = 0; x < this.sizex; x++) {
    for (y = 0; y < this.sizex; y++) {
        if(this.boxes[x][y].number>0 && this.boxes[x][y].type=="number") score *= this.boxes[x][y].number;
    }
  }
  score = Math.ceil(Math.log(score) / Math.LN10);
  //return Math.max(5-score,0);
  score = Math.max(5 - score/(2*(this.sizex^1.5/11.2)),0);
  return score;
}
