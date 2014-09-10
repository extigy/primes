//some cheekly little globals
var loaded = [];
var canvaswh = 0;
var divCoords = {left:0,top:0,width:0,height:0}
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
  canvaswh = this.canvas.width;
}


CanvasDrawer.prototype.setUpUIAR = function() {
  this.UISpec = {};
  this.UISpec.buttonShift = 0.0;
  divCoords = {left:9,top:9,width:this.canvas.width-18,height:this.canvas.height-18};
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
  this.ctx.fillStyle = "#5561B2";
  this.roundRect(0, 0, this.canvas.width,this.canvas.height,20,true,false);
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
  //if(window.lManager)if(window.lManager.inGame == 0 && window.lManager.showCredits == 0) this.drawMainMenu();
};

CanvasDrawer.prototype.drawButtons = function (){
    //TODO
  }


CanvasDrawer.prototype.drawGO = function (maze){
  this.ctx.fillStyle = "#333333";
  this.ctx.fillRect(0,0,  this.canvas.width,  this.canvas.height);
  this.ctx.globalAlpha = 0.9;
  this.roundRect(divCoords.left-10, (divCoords.top+divCoords.height)/2 - 250*this.scaled, divCoords.width+20, 500*this.scaled, 5*this.scaled,true,false);
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = "white";
  this.ctx.font = 50*this.scaled+"px DaysOne";
  this.ctx.textAlign = "center";
  this.ctx.fillText("Out of Time", divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 250*this.scaled + 80*this.scaled);
  this.ctx.textAlign = "left";
};

CanvasDrawer.prototype.drawMainMenu = function () {
  this.ctx.globalAlpha = 0.5;
  this.ctx.fillStyle = "#333333";
  this.ctx.fillRect(0,0,  this.canvas.width,  this.canvas.height);
  this.ctx.globalAlpha = 0.9;
  this.roundRect(divCoords.left-10, (divCoords.top+divCoords.height)/2 - 300*this.scaled, divCoords.width+20, 700*this.scaled, 5*this.scaled,true,false);
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = ColorManager.mainColor;
  this.ctx.font = 90*this.scaled+"px DaysOne";
  this.ctx.textAlign = "center";
  this.ctx.fillText("TapTrax", divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 300*this.scaled + 120*this.scaled);
  this.ctx.font = 48*this.scaled+"px DaysOne";
  this.ctx.fillText("Classic Mode", divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 300*this.scaled + 350*this.scaled);
  this.ctx.fillText("Zen Mode", divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 300*this.scaled + 460*this.scaled);
  this.ctx.fillText("Credits", divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 300*this.scaled + 600*this.scaled);
  this.ctx.textAlign = "left";
};

CanvasDrawer.prototype.drawCredits = function () {
  this.ctx.globalAlpha = 0.3;
  this.ctx.fillStyle = "#333333";
  this.ctx.fillRect(0,0,  this.canvas.width,  this.canvas.height);
  this.ctx.globalAlpha = 0.9;
  this.roundRect(divCoords.left-10, (divCoords.top+divCoords.height)/2 - 200*this.scaled, divCoords.width+20, 480*this.scaled, 5*this.scaled,true,false);
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = "white";
  this.ctx.font = 48*this.scaled+"px DaysOne";
  this.ctx.textAlign = "center";
  this.ctx.fillStyle = "#dddddd";
  this.ctx.fillText("Credits", divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 200*this.scaled + 80*this.scaled);
  this.ctx.fillStyle = "#ffffff";
  this.ctx.font = 28*this.scaled+"px DaysOne";
  this.ctx.fillText("Music: ", divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 200*this.scaled + 160*this.scaled);
  this.ctx.fillStyle = "#dddddd";
  this.ctx.fillText('"Ouroboros"', divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 200*this.scaled + 200*this.scaled);
  this.ctx.fillText('Kevin MacLeod (incompetech.com)', divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 200*this.scaled + 240*this.scaled);
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillText("Everything else: ", divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 200*this.scaled + 320*this.scaled);
  this.ctx.fillStyle = "#dddddd";
  this.ctx.fillText('George Stagg (teggers.eu)', divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 200*this.scaled + 360*this.scaled);
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillText('Tap to Return', divCoords.left+divCoords.width/2, (divCoords.top+divCoords.height)/2 - 200*this.scaled + 440*this.scaled);
  this.ctx.textAlign = "left";
};

CanvasDrawer.prototype.drawBox = function (box,deadDraw) {
   this.ctx.globalAlpha = 1.0;
   borderSc = 3*box.width/100 - (box.scale-1)*box.width;

   switch(box.type){
      case "empty":
        this.ctx.fillStyle = '#CFD5FF';
        this.roundRect((box.x*box.width)+divCoords.left+borderSc,box.y*box.width+divCoords.top+borderSc,box.width-borderSc*2,box.width-borderSc*2,box.width/20,true,false);
        break;
      case "test":
        this.ctx.fillStyle = box.color;
        bx = (box.x*box.width)+divCoords.left+borderSc
        by = box.y*box.width+divCoords.top+borderSc
        bw = box.width-borderSc*2
        bh = box.width-borderSc*2
        this.roundRect(bx,by,bw,bh,box.width/30,true,false);
        fs = 60;
        this.ctx.font = fs+"px DaysOne";
        while(this.ctx.measureText(box.number).width > bw-25){
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
   this.ctx.globalAlpha = 1.0;
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

CanvasDrawer.prototype.getButtonSpec = function(){
    buttonsize = this.lineheight*2-2;
    lastdist = (divCoords.top-this.lineheight*3-this.UISpec.elemSep*3)/2;
    return({"back":{"x":this.UISpec.UIleft+this.UISpec.UIwidth*this.UISpec.buttonShift,"y":lastdist,"size":buttonsize},
            "pause":{"x":this.UISpec.UIleft+this.UISpec.UIwidth-buttonsize-this.UISpec.UIwidth*this.UISpec.buttonShift,"y":lastdist,"size":buttonsize}});

}
