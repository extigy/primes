//some cheekly little globals
var loaded = [];
var divCoords = {left:0,top:0,width:0,height:0,bl:0,br:0}

function CanvasDrawer() {
  this.canvas = document.getElementById('game-canvas');
  this.prepareCanvas();
  this.animManager = new AnimationManager(this);
  this.scaled = 1;
  this.lineheight = 0;
  this.ctx = this.canvas.getContext('2d');
  this.setUpUIAR();
  this.loadedImages = new Array();
  this.loadImages();
}

CanvasDrawer.prototype.prepareCanvas = function() {
  this.canvas.style.width ='100%';
  this.canvas.style.height='100%';
  if(this.canvas.offsetWidth<this.canvas.offsetHeight){
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.style.height=this.canvas.offsetWidth+"px";
    this.canvas.height = this.canvas.offsetHeight;
  } else {
    this.canvas.width  = this.canvas.offsetHeight;
    this.canvas.style.width=this.canvas.offsetHeight+"px";
    this.canvas.height = this.canvas.offsetWidth;
  }
  document.getElementById('canvas-container').style.left=Math.round(window.innerWidth-this.canvas.width)/2 + "px";
  divCoords={left:Math.round(window.innerWidth-this.canvas.width)/2,
             top:document.getElementById('canvas-container').offsetTop,
             width:this.canvas.width,height:this.canvas.height,
             bl: this.canvas.width/44,
             br: this.canvas.height/44}
}


CanvasDrawer.prototype.setUpUIAR = function() {
  this.UISpec = {};
  this.UISpec.buttonShift = 0.0;
  this.UISpec.FS = 28 +"pt";
  this.ctx.font =  this.UISpec.FS+" DaysOne";
  this.lineheight =  this.ctx.measureText('E').width+1;
  this.UISpec.elemSep = 0;
}


CanvasDrawer.prototype.loadImages = function() {
    /*this.loadedImages.push(new Image());
    this.loadedImages[0].src = 'assets/bg.jpg';
    this.loadedImages[0].onload = function(){loaded[0] = 1;};
    */
};
CanvasDrawer.prototype.drawUI = function () {
    this.drawTimer();
};
CanvasDrawer.prototype.drawTimer = function () {
  //TODO
  /*
  this.ctx.fillStyle = "black";
  this.ctx.fillText(timeremain.toFixed(1), this.UISpec.UIleft+this.UISpec.UIwidth/2.0, divCoords.top-this.lineheight-this.UISpec.elemSep*2);
  this.ctx.fillStyle = "white";
  */

};

CanvasDrawer.prototype.draw = function (board) {

  //draw bg
  this.ctx.fillStyle = "#EEF3E7";
  this.roundRect(0, 0, divCoords.width,divCoords.height,0,true,false);
  this.ctx.fillStyle = "#444466";
  this.roundRect(0, 0, divCoords.width,divCoords.height,divCoords.width/20,true,false);
  //draw all boxes
  for (i = 0;i<board.sizex;i++) {
    for (j = 0;j<board.sizey;j++) {
      this.drawBox(board.boxes[i][j],0);
    }
  }

  //draw UI
  this.drawUI();

  //Do queued Animations
  this.animManager.doAnimFrames();

  this.drawButtons();
  //draw MENU if not in game
  if(window.lManager)if(window.lManager.inGame == 0 && window.lManager.showCredits == 0) this.drawMainMenu();
};

CanvasDrawer.prototype.drawButtons = function (){
    //TODO
  }


CanvasDrawer.prototype.drawGO = function (maze){
  this.ctx.fillStyle = "#333333";
  this.ctx.roundRect(0,0,  divCoords.width,  divCoords.height,divCoords.width/20,true,false);
  this.ctx.globalAlpha = 0.9;
  this.roundRect(0.1*divCoords.width, 0.1*divCoords.width, 0.8*divCoords.width, 0.8*divCoords.width, divCoords.width/20,true,false);
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = "white";
  this.ctx.font = 50*this.scaled+"px DaysOne";
  this.ctx.textAlign = "center";
  this.ctx.fillText("Out of Time", 0.5*divCoords.width, 0.3*divCoords.height);
  this.ctx.textAlign = "left";
};

CanvasDrawer.prototype.drawMainMenu = function () {
  this.ctx.globalAlpha = 0.5;
  this.ctx.fillStyle = "#333333";
  this.roundRect(0,0,  divCoords.width,  divCoords.height,divCoords.width/20,true,false);
  this.ctx.globalAlpha = 0.9;
  this.roundRect(0.1*divCoords.width, 0.1*divCoords.width, 0.8*divCoords.width, 0.8*divCoords.width, divCoords.width/20,true,false);
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = "#FFFFFF";
  this.ctx.textAlign = "center";
  this.ctx.font = divCoords.width/11+"px DaysOne";
  this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(3),0.3,0.95);
  this.ctx.fillText("EASY", 0.5*divCoords.width, 0.3*divCoords.height);
  this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(2),0.3,0.95);
  this.ctx.fillText("MEDIUM", 0.5*divCoords.width, 0.45*divCoords.height);
  this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(5),0.3,0.95);
  this.ctx.fillText("HARD", 0.5*divCoords.width, 0.6*divCoords.height);
  this.ctx.fillStyle = window.cManager.HSV2RGB(window.cManager.numberHue(7),0.3,0.95);
  this.ctx.fillText("CREDITS", 0.5*divCoords.width, 0.8*divCoords.height);

  this.ctx.textAlign = "left";
};

CanvasDrawer.prototype.drawCredits = function () {
  this.ctx.globalAlpha = 0.3;
  this.ctx.fillStyle = "#333333";
  this.ctx.fillRect(0,0,  divCoords.width,  divCoords.height);
  this.ctx.globalAlpha = 0.9;
  this.roundRect(0.1*divCoords.width, 0.1*divCoords.width, 0.8*divCoords.width, 0.8*divCoords.width, divCoords.width/20,true,false);
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

};

CanvasDrawer.prototype.drawBox = function (box,deadDraw) {
   borderSc = 3*box.width/100;
   bx = (box.x*box.width)+borderSc + divCoords.bl
   by = box.y*box.width+borderSc + divCoords.bl
   bw = box.width-borderSc*2
   bh = box.width-borderSc*2

   switch(box.type){
      case "empty":
        this.ctx.fillStyle = '#CFD5FF';
        this.roundRect(bx,by,bw,bh,box.width/30,true,false);
        break;
      case "number":
        this.ctx.fillStyle = box.color;
        this.roundRect(bx,by,bw,bh,box.width/30,true,false);
        fs = 60;
        this.ctx.font = fs+"px DaysOne";
        while(this.ctx.measureText(box.number+'  ').width > bw){
          fs--;
          this.ctx.font = fs+"px DaysOne";
        }
        this.lineheight =  this.ctx.measureText('E').width+1;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.textAlign = "center";
        this.ctx.fillText(box.number, bx+bw/2, (by+bh)-(bh-this.lineheight)/2);
        this.ctx.textAlign = "left";
        break;
   }
};
/**
 *Based on http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
 * Draws a rounded rectangle using the current state of the canvas.
 */
CanvasDrawer.prototype.roundRect = function(x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  this.ctx.beginPath();
  this.ctx.moveTo(x + radius, y);
  this.ctx.lineTo(x + width - radius, y);
  this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.ctx.lineTo(x + width, y + height - radius);
  this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.ctx.lineTo(x + radius, y + height);
  this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.ctx.lineTo(x, y + radius);
  this.ctx.quadraticCurveTo(x, y, x + radius, y);
  this.ctx.closePath();
  if (stroke) {
    this.ctx.stroke();
  }
  if (fill) {
    this.ctx.fill();
  }
}
