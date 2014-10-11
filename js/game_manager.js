function GameManager(size) {
  this.inputManager   = new InputManager(this.handleEvent.bind(this));
  this.adManager      = new AdManager();
  this.boardsize = 5;
  this.board      = new Board(this.boardsize);
  this.gameover;
  this.touchcounter = 0;
  this.inGame;
  this.psmooth = numbers.elevensmooth;
  //this.best = window.localStorage.getItem("best"+this.curModeID);
  //if(this.best == null) this.best = 0;
  this.mainMenu(0);
}

GameManager.prototype.mainMenu = function (modeID) {
  this.gameover = 0;
  this.gamepaused = 0;
  this.inGame = 0;
  canvasDraw.drawBGinit(this.board);
}

GameManager.prototype.restart = function () {
    this.gameover = 0;
    this.board = new Board(this.boardsize);
    canvasDraw.drawBGinit(this.board);
    this.makeLevel();
};

GameManager.prototype.makeLevel = function () {
    this.board.makeBoxes();
    this.board.makeRandomNumbers(this.psmooth,1,2,this.boardsize-2,this.boardsize-2);
    this.drawAll();
};

GameManager.prototype.drawAll = function () {
  canvasDraw.draw(this.board);
  if(this.gameover && canvasDraw.animManager.animFinished() && !lManager.inputManager.locked)canvasDraw.drawGO(this.board);
};

GameManager.prototype.update = function () {
  this.drawAll();
  if(canvasDraw.animManager.animFinished()){
    lManager.inputManager.locked = 0;
    lManager.board.checkDoubles();
  }
};

GameManager.prototype.handleTouch = function (mousePos) {
  var bx = Math.floor((mousePos.x - divCoords.bl/window.devicePixelRatio)/(this.board.boxwidth/window.devicePixelRatio));
  var by = Math.floor((mousePos.y - divCoords.br/window.devicePixelRatio)/(this.board.boxwidth/window.devicePixelRatio));
  if(bx >= 0 && bx < this.boardsize && by >= 0 && by < this.boardsize){
    window.lManager.inputManager.locked = 1;
    bn = this.board.boxes[bx][by].number;
    bfs= factor(bn);
    if(bfs.length>1){
      //we are gonna try and split now
      var split = [bfs[0],bn/bfs[0]];
      emptyN = this.board.getEmptyNeighbors(this.board.boxes[bx][by]);
      if(emptyN.length>0){
        //we can expand into an empty block
        geb = emptyN[Math.floor(Math.random()*emptyN.length)];
        this.board.animatePull(this.board.boxes[geb.x][geb.y],this.board.boxes[bx][by],split[0],split[1],this.board.boxes[geb.x][geb.y].rel,1);
      } else {
        //ok we're gonna have to push a block out.
        possDirs = this.board.getPushableNeighbors(this.board.boxes[bx][by]);
        if(possDirs.length>0){
        //we can push into an empty block
          gdir = possDirs[Math.floor(Math.random()*possDirs.length)];
          this.board.pushBoxes(this.board.boxes[bx][by],gdir,split[0],split[1]);
        } else {
          //can't do anything :(
        }
      }
      //window.sManager.pops.play({playAudioWhenScreenIsLocked : false });
      canvasDraw.animManager.addBoxPop(this.board.boxes[bx][by]);
      if(!this.canMove()){
        this.gameover = 1;
      }
    }
  }
}

GameManager.prototype.canMove = function(){
  for (bx = 0; bx < this.board.sizex; bx++) {
    for (by = 0; by < this.board.sizex; by++) {
      bn = this.board.boxes[bx][by].number;
      bfs= factor(bn);
      if(bfs.length>1){
        var split = [bfs[0],bn/bfs[0]];
        emptyN = this.board.getEmptyNeighbors(this.board.boxes[bx][by]);
        if(emptyN.length>0){
          return (1);
        } else {
          possDirs = this.board.getPushableNeighbors(this.board.boxes[bx][by]);
          if(possDirs.length>0){
            return (1);
          }
        }
      }
    }
  }
  return(0);
}

GameManager.prototype.handleEvent = function (mousePos,event) {
  if(lManager.inputManager.locked == 0)requestAnimFrame(animloop);
  //touch inside gamearea
  if(this.gameover == 0 && this.inGame == 1 && mousePos.x > (divCoords.left) && mousePos.x < (divCoords.left+divCoords.vwidth) && mousePos.y > divCoords.top && mousePos.y < (divCoords.top+divCoords.vheight)){
    mousePos = {x:mousePos.x - divCoords.left,y:mousePos.y-divCoords.top};
    this.handleTouch(mousePos);
  }
  //gameover Screen
  else if(this.gameover==1 && event == "touchstart") {
    if(mousePos.x > divCoords.left && mousePos.x < divCoords.left+divCoords.vwidth){
      if(mousePos.y > divCoords.top+0.63*divCoords.vheight && mousePos.y < divCoords.top+0.7*divCoords.vheight){
        console.log("restart");
        this.restart();
      }
      if(mousePos.y > divCoords.top+0.73*divCoords.vheight && mousePos.y < divCoords.top+0.8*divCoords.vheight){
        console.log("restart");
        this.mainMenu();
      }
    }
  }

  //main menu choices
  else if(this.inGame==0 && event == "touchstart") {
    if(mousePos.x > divCoords.left && mousePos.x < divCoords.left+divCoords.vwidth){
      if (mousePos.y > divCoords.top+0.2*divCoords.vheight && mousePos.y < divCoords.top+0.4*divCoords.vheight){
        this.inGame = 1;
        this.boardsize = 5;
        this.psmooth = numbers.threesmooth;
        this.restart();
      }
      if(mousePos.y > divCoords.top+0.4*divCoords.vheight && mousePos.y < divCoords.top+0.6*divCoords.vheight){
        this.inGame = 1;
        this.boardsize = 5;
        this.psmooth = numbers.elevensmooth;
        this.restart();
      }

      if(mousePos.y > divCoords.top+0.6*divCoords.vheight && mousePos.y < divCoords.top+0.8*divCoords.vheight){
        this.inGame = 1;
        this.psmooth = numbers.seventeensmooth;
        this.boardsize = 7;
        this.restart();
      }
    }

  }
};


window.animloop = function () {
  var interval = 1000/60;
  now = Date.now();
  delta = now - then;
  //console.log("updating");
  if (delta > interval) {
        then = now - (delta % interval);
        window.lManager.update();
    } else {
      //console.log("animating");
      //console.log(canvasDraw.animManager.animFinished())
      if(!canvasDraw.animManager.ready || !canvasDraw.animManager.animFinished()){
        requestAnimFrame(animloop);
      }
    }
  }

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 /40);
          };
})();
