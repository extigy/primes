var divCoords = {left:0,top:0,width:0,height:0,bl:0,br:0}

function CanvasDrawer() {
  this.canvas = document.getElementById('fg-canvas');
  this.bgcanvas = document.createElement('canvas');
  this.prepareCanvas(this.canvas);
  this.prepareCanvas(this.bgcanvas);
  this.animManager = new AnimationManager(this);
  this.ctx = this.canvas.getContext('2d');
  this.bgctx = this.bgcanvas.getContext('2d');
  this.setUpUIAR();
}

CanvasDrawer.prototype.prepareCanvas = function(dcanvas) {
  dcanvas.style.width ='100%';
  dcanvas.style.height='100%';
  dcanvas.width  = this.canvas.offsetWidth;
  dcanvas.height = this.canvas.offsetHeight;
  document.getElementById('canvas-container').style.left=Math.round(window.innerWidth-this.canvas.width)/2 + "px";
}


CanvasDrawer.prototype.setUpUIAR = function() {
  divCoords={left:Math.round(window.innerWidth-this.canvas.width)/2,
           top:document.getElementById('canvas-container').offsetTop,
           width:this.canvas.width,height:this.canvas.height,
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

  //Do queued Animations
  this.animManager.doAnimFrames();

  for (i = 0;i<board.sizex;i++) {
    for (j = 0;j<board.sizex;j++) {
      if(board.boxes[i][j].type == "number" && board.boxes[i][j].inAnim == 1)this.drawBox(this.ctx,board.boxes[i][j]);
    }
  }

  for (i = 0;i<board.sizex;i++) {
    for (j = 0;j<board.sizex;j++) {
      if(board.boxes[i][j].type == "number" && board.boxes[i][j].inAnim == 0)this.drawBox(this.ctx,board.boxes[i][j]);
    }
  }
  //draw MENU if not in game
  if(window.lManager)if(window.lManager.inGame == 0 && window.lManager.showCredits == 0) this.drawMainMenu();
};


CanvasDrawer.prototype.drawGO = function (board){
  this.ctx.globalAlpha = 0.5;
  this.ctx.fillStyle = "#333333";
  this.roundRect(this.ctx,0,0,  divCoords.width,  divCoords.height,divCoords.width/20,true,false);
  this.ctx.globalAlpha = 0.9;
  this.roundRect(this.ctx,0.1*divCoords.width, 0.1*divCoords.width, 0.8*divCoords.width, 0.8*divCoords.width, divCoords.width/20,true,false);
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = "white";
  this.ctx.font = divCoords.width/11+"px DaysOne";
  this.ctx.textAlign = "center";
  this.ctx.fillText("Game Over", 0.5*divCoords.width, 0.3*divCoords.height);
  this.ctx.font = divCoords.width/18+"px DaysOne";
  this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(3,[3]),0.3,0.95);
  this.ctx.fillText("Score: "+ board.totalScore(), 0.5*divCoords.width, 0.5*divCoords.height);
  this.ctx.font = divCoords.width/16+"px DaysOne";
  this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(2,[2]),0.3,0.95);
  this.ctx.fillText("Play Again", 0.5*divCoords.width, 0.7*divCoords.height);
   this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(5,[5]),0.3,0.95);
  this.ctx.fillText("Change Difficulty", 0.5*divCoords.width, 0.8*divCoords.height);
  this.ctx.textAlign = "left";
};

CanvasDrawer.prototype.drawMainMenu = function () {
  this.ctx.globalAlpha = 0.5;
  this.ctx.fillStyle = "#333333";
  this.roundRect(this.ctx,0,0,  divCoords.width,  divCoords.height,divCoords.width/20,true,false);
  this.ctx.globalAlpha = 0.9;
  this.roundRect(this.ctx,0.1*divCoords.width, 0.1*divCoords.width, 0.8*divCoords.width, 0.8*divCoords.width, divCoords.width/20,true,false);
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = "#FFFFFF";
  this.ctx.textAlign = "center";
  this.ctx.font = divCoords.width/11+"px DaysOne";
  this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(3,[3]),0.3,0.95);
  this.ctx.fillText("EASY", 0.5*divCoords.width, 0.3*divCoords.height);
  this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(2,[2]),0.3,0.95);
  this.ctx.fillText("MEDIUM", 0.5*divCoords.width, 0.45*divCoords.height);
  this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(5,[5]),0.3,0.95);
  this.ctx.fillText("HARD", 0.5*divCoords.width, 0.6*divCoords.height);
  this.ctx.font = divCoords.width/19+"px DaysOne";
  this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(7,[7]),0.3,0.95);
  this.ctx.fillText("CREDITS", 0.5*divCoords.width, 0.8*divCoords.height);
  this.ctx.textAlign = "left";
};

CanvasDrawer.prototype.drawCredits = function () {
  /*this.ctx.globalAlpha = 0.3;
  this.ctx.fillStyle = "#333333";
  this.ctx.fillRect(0,0,  divCoords.width,  divCoords.height);
  this.ctx.globalAlpha = 0.9;
  this.roundRect(this.ctx,0.1*divCoords.width, 0.1*divCoords.width, 0.8*divCoords.width, 0.8*divCoords.width, divCoords.width/20,true,false);
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = "white";
  this.ctx.font = divCoords.width/11+"px DaysOne";
  this.ctx.textAlign = "center";
  this.ctx.fillStyle = "#dddddd";
  this.ctx.fillText("Credits", divCoords.width/2, (divCoords.height)/2 - 200*this.scaled + 80*this.scaled);
  this.ctx.fillStyle = "#ffffff";
  this.ctx.font = divCoords.width/22+"px DaysOne";
  this.ctx.fillText("Music: ", divCoords.width/2, (divCoords.height)/2 - 200*this.scaled + 160*this.scaled);
  this.ctx.fillStyle = "#dddddd";
  this.ctx.fillText('"Ouroboros"',divCoords.width/2, (divCoords.height)/2 - 200*this.scaled + 200*this.scaled);
  this.ctx.fillText('Kevin MacLeod (incompetech.com)', divCoords.width/2, (divCoords.top+divCoords.height)/2 - 200*this.scaled + 240*this.scaled);
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillText("Everything else: ", divCoords.width/2, (divCoords.height)/2 - 200*this.scaled + 320*this.scaled);
  this.ctx.fillStyle = "#dddddd";
  this.ctx.fillText('George Stagg (teggers.eu)', divCoords.width/2, (divCoords.height)/2 - 200*this.scaled + 360*this.scaled);
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillText('Tap to Return', divCoords.width/2, (divCoords.height)/2 - 200*this.scaled + 440*this.scaled);
  this.ctx.textAlign = "left";
  */
};

CanvasDrawer.prototype.drawBox = function (ctx,box) {
  borderSc = 3*box.width/100;
  bx = (box.x*box.width)+borderSc + divCoords.bl - ((box.scale-1)*box.width)/2
  by = box.y*box.width+borderSc + divCoords.bl - ((box.scale-1)*box.width)/2
  bw = box.scale*box.width-borderSc*2;
  bh = box.scale*box.width-borderSc*2;

  bx = bx + box.shiftx*box.width;
  by = by + box.shifty*box.width;

  ctx.fillStyle = box.color;
  this.roundRect(ctx,bx,by,bw,bh,box.width/30,true,false);
  ctx.font = box.fontsize*box.scale+"px DaysOne";
  if(box.fontsize == 0){
    fs = 60;
    ctx.font = fs+"px DaysOne";
    while(ctx.measureText(box.number+'  ').width > (box.width-borderSc*2)){
      fs--;
      ctx.font = fs+"px DaysOne";
    }
    box.fontsize = fs;
  }
  this.lineheight =  ctx.measureText('E').width+1;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(box.number, bx+bw/2, (by+bh)-(bh-this.lineheight)/2);
  ctx.textAlign = "left";
};

CanvasDrawer.prototype.drawBGBox = function (ctx,box) {
   borderSc = 3*box.width/100;
   bx = (box.x*box.width)+borderSc + divCoords.bl - ((box.scale-1)*box.width)/2
   by = box.y*box.width+borderSc + divCoords.bl - ((box.scale-1)*box.width)/2
   bw = box.scale*box.width-borderSc*2
   bh = box.scale*box.width-borderSc*2

   ctx.fillStyle = '#CFD5FF';
   this.roundRect(ctx,bx+1,by+1,bw-2,bh-2,box.width/30,true,false);  
};
/**
 *Based on http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
 * Draws a rounded rectangle using the current state of the canvas.
 */
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
