var divCoords = {left:0,top:0,width:0,height:0,bl:0,br:0}

function CanvasDrawer() {
  this.canvas = document.getElementById('fg-canvas');
  this.bgcanvas = document.createElement('canvas');
  this.prepareCanvas(this.canvas);
  this.prepareCanvas(this.bgcanvas);
  this.animManager = new AnimationManager();
  this.ctx = this.canvas.getContext('2d');
  this.bgctx = this.bgcanvas.getContext('2d');
  this.setUpUIAR();
}

CanvasDrawer.prototype.prepareCanvas = function(dcanvas) {
  dcanvas.style.width ='100%';
  dcanvas.style.height='100%';
  dcanvas.width  = this.canvas.offsetWidth*devicePixelRatio;
  dcanvas.height = this.canvas.offsetHeight*devicePixelRatio;
  document.getElementById('canvas-container').style.left=Math.round(innerWidth-this.canvas.offsetWidth)/2 + "px";
}


CanvasDrawer.prototype.setUpUIAR = function() {
  divCoords={left:Math.round(innerWidth-this.canvas.offsetWidth)/2,
           top:document.getElementById('canvas-container').offsetTop,
           width:this.canvas.width,height:this.canvas.height,
           vwidth:this.canvas.offsetWidth,vheight:this.canvas.offsetWidth,
           bl: this.canvas.width/44,
           br: this.canvas.height/44}
}


CanvasDrawer.prototype.drawBGinit = function (board) {
  this.bgctx.fillStyle = "#EEF3E7";
  this.roundRect(this.bgctx,0, 0, divCoords.width,divCoords.height,0,true,false);
  this.bgctx.fillStyle = "#444466";
  this.roundRect(this.bgctx,0, 0, divCoords.width,divCoords.height,divCoords.width/20,true,false);

  for (i = 0;i<board.sizex;i++) {
    for (j = 0;j<board.sizex;j++) {
      this.drawBGBox(this.bgctx,board.boxes[i][j]);
    }
  }
}

CanvasDrawer.prototype.draw = function (board) {
  this.ctx.drawImage(this.bgcanvas,0, 0);
  this.animManager.doAnimFrames();

  //Animations underneath so need to be drawn first
  for (i = 0;i<board.sizex;i++) {
    for (j = 0;j<board.sizex;j++) {
      if(board.boxes[i][j].inAnim == 1)this.drawBox(this.ctx,board.boxes[i][j]);
    }
  }

  for (i = 0;i<board.sizex;i++) {
    for (j = 0;j<board.sizex;j++) {
      if(board.boxes[i][j].inAnim == 0)this.drawBox(this.ctx,board.boxes[i][j]);
    }
  }

  //draw MENU if not in game
  if(!lManager.inGame) this.drawMainMenu();
};


CanvasDrawer.prototype.drawGO = function (board){
  this.ctx.globalAlpha = 0.5;
  this.ctx.fillStyle = "#333333";
  this.roundRect(this.ctx,0,0,  divCoords.width,  divCoords.height,divCoords.width/20,true,false);
  this.ctx.globalAlpha = 0.95;
  this.roundRect(this.ctx,0.1*divCoords.width, 0.1*divCoords.width, 0.8*divCoords.width, 0.8*divCoords.width, divCoords.width/20,true,false);
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = "white";
  this.ctx.font = divCoords.width/11+"px DaysOne";
  this.ctx.textAlign = "center";
  score = board.totalScore();
  if(Math.floor(score) > 4){
    //this.ctx.shadowBlur = 10;
    //this.ctx.shadowColor = "#EEEE00";
    //this.ctx.fillStyle = "#EEEE00";
    this.ctx.font = divCoords.width/9+"px DaysOne";
    this.ctx.fillText("You Win!", 0.5*divCoords.width, 0.3*divCoords.height);
    this.ctx.shadowBlur = 0;
  } else {
    this.ctx.fillText("Game Over", 0.5*divCoords.width, 0.3*divCoords.height);
  }
  this.ctx.font = divCoords.width/18+"px DaysOne";
  this.ctx.fillStyle = cManager.HSV2RGB(cManager.numberHue(3,[3]),0.3,0.95);
  //this.ctx.fillText("Score"/*+ board.totalScore()*/, 0.5*divCoords.width, 0.42*divCoords.height);
  this.ctx.font = divCoords.width/16+"px DaysOne";
  this.ctx.fillStyle = cManager.HSV2RGB(cManager.numberHue(2,[2]),0.3,0.95);
  this.ctx.fillText("Play Again", 0.5*divCoords.width, 0.7*divCoords.height);
  this.ctx.fillStyle = cManager.HSV2RGB(cManager.numberHue(5,[5]),0.3,0.95);
  this.ctx.fillText("Change Difficulty", 0.5*divCoords.width, 0.8*divCoords.height);
  this.ctx.textAlign = "left";

  this.ctx.shadowBlur = 10;
  this.ctx.shadowColor = "#EEEE00";
  this.ctx.fillStyle = "#EEEE00";
  if(score < 1){
    this.ctx.fillStyle = "#666666";
    this.ctx.shadowBlur = 0;
  }
  this.star(this.ctx, 0.250*divCoords.width, 0.48*divCoords.height, 0.06*divCoords.width, 5, 0.5)
  if(score < 2){
    this.ctx.fillStyle = "#666666";
    this.ctx.shadowBlur = 0;
  }
  this.star(this.ctx, 0.375*divCoords.width, 0.48*divCoords.height, 0.06*divCoords.width, 5, 0.5)
  if(score < 3){
    this.ctx.fillStyle = "#666666";
    this.ctx.shadowBlur = 0;
  }
  this.star(this.ctx, 0.5*divCoords.width, 0.48*divCoords.height, 0.06*divCoords.width, 5, 0.5)
  if(score < 4){
    this.ctx.fillStyle = "#666666";
    this.ctx.shadowBlur = 0;
  }
  this.star(this.ctx, 0.625*divCoords.width, 0.48*divCoords.height, 0.06*divCoords.width, 5, 0.5)
  if(score < 5){
    this.ctx.fillStyle = "#666666";
    this.ctx.shadowBlur = 0;
  }
  this.star(this.ctx, 0.750*divCoords.width, 0.48*divCoords.height, 0.06*divCoords.width, 5, 0.5)
  this.ctx.shadowBlur = 0;
};

CanvasDrawer.prototype.drawMainMenu = function () {
  this.ctx.globalAlpha = 0.5;
  this.ctx.fillStyle = "#333333";
  this.roundRect(this.ctx,0,0,  divCoords.width,  divCoords.height,divCoords.width/20,true,false);
  this.ctx.globalAlpha = 0.95;
  this.roundRect(this.ctx,0.1*divCoords.width, 0.1*divCoords.width, 0.8*divCoords.width, 0.8*divCoords.width, divCoords.width/20,true,false);
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = "#FFFFFF";
  this.ctx.textAlign = "center";
  this.ctx.font = divCoords.width/9+"px DaysOne";
  this.ctx.shadowBlur = 20;
  this.ctx.shadowColor = "black";
  //this.ctx.fillStyle = "#EEF3E7"
  this.ctx.fillStyle = cManager.HSV2RGB(cManager.numberHue(3,[3]),0.3,0.95);
  this.ctx.fillText("EASY", 0.5*divCoords.width, 0.33*divCoords.height);
  this.ctx.fillStyle = cManager.HSV2RGB(cManager.numberHue(2,[2]),0.3,0.95);
  this.ctx.fillText("MEDIUM", 0.5*divCoords.width, 0.53*divCoords.height);
  this.ctx.fillStyle = cManager.HSV2RGB(cManager.numberHue(5,[5]),0.3,0.95);
  this.ctx.fillText("HARD", 0.5*divCoords.width, 0.73*divCoords.height);
  this.ctx.shadowBlur = 0;
  this.ctx.textAlign = "left";
};

CanvasDrawer.prototype.drawBox = function (ctx,box) {
  if(box.type != "number")return;
  borderSc = 3*box.width/100;
  bx = (box.x*box.width)+borderSc + divCoords.bl - ((box.scale-1)*box.width)/2 + box.shiftx*box.width;
  by = box.y*box.width+borderSc + divCoords.bl - ((box.scale-1)*box.width)/2 + box.shifty*box.width;
  bw = box.scale*box.width-borderSc*2;
  bh = box.scale*box.width-borderSc*2;

  ctx.fillStyle = box.color;
  this.roundRect(ctx,bx,by,bw,bh,box.width/30,true,false);
  ctx.font = box.fontsize*box.scale+"px DaysOne";
  if(box.fontsize == 0){
    fs = 60*devicePixelRatio;
    ctx.font = fs+"px DaysOne";
    while(ctx.measureText(box.number+'  ').width > (box.width-borderSc*2)){
      fs--;
      ctx.font = fs+"px DaysOne";
    }
    box.fontsize = fs;
  }
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  this.ctx.shadowBlur = 10;
  this.ctx.shadowColor = "#333333";
  ctx.fillText(box.number, bx+bw/2, (by+bh)-(bh-ctx.measureText('E').width+1)/2);
  this.ctx.shadowBlur = 0;
  ctx.textAlign = "left";
};

CanvasDrawer.prototype.drawBGBox = function (ctx,box) {
   borderSc = 3*box.width/100;
   bx = (box.x*box.width)+borderSc + divCoords.bl
   by = box.y*box.width+borderSc + divCoords.bl
   bw = box.width-borderSc*2
   bh = box.width-borderSc*2

   ctx.fillStyle = '#CFD5FF';
   this.roundRect(ctx,bx+1,by+1,bw-2,bh-2,box.width/30,true,false);
};

//Based on http://js-bits.blogspot.co.uk/2010/07/canvas-rounded-corner-rectangles.html
//Much thanks!
CanvasDrawer.prototype.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }
}

//FROM: http://programmingthomas.wordpress.com/2012/05/16/drawing-stars-with-html5-canvas/
//Much thanks!
CanvasDrawer.prototype.star = function(ctx, x, y, r, p, m)
{
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0,0-r);
    for (var i = 0; i < p; i++)
    {
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - (r*m));
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - r);
    }
    ctx.closePath()
    ctx.fill();
    ctx.restore();
}
