function GameManager(size) {
  this.inputManager   = new InputManager(this.handleEvent.bind(this));
  this.adManager      = new AdManager();
  this.boardsize = 5;
  this.board      = new Board(this.boardsize);
  this.gameover;
  this.inGame;
  this.showCredits;
  this.playpop;
  this.psmooth = numbers.elevensmooth;
  //window.sManager.bg.setVolume(0.5);
  //window.sManager.bg.play({numberOfLoops: 100000, playAudioWhenScreenIsLocked : false });
  //this.best = window.localStorage.getItem("best"+this.curModeID);
  //if(this.best == null) this.best = 0;
  this.mainMenu(0);
}

GameManager.prototype.mainMenu = function (modeID) {
  this.gameover = 0;
  this.gamepaused = 0;
  this.inGame = 0;
  this.playpop = 0;
  this.showCredits = 0;
  window.canvasDraw.drawBGinit(this.board);
}

GameManager.prototype.restart = function () {
    this.gameover = 0;
    this.playpop = 0;
    this.board = new Board(this.boardsize);
    window.canvasDraw.drawBGinit(this.board);
    this.makeLevel();
};

GameManager.prototype.makeLevel = function () {
    this.playpop = 0;
    //Code for making initial set of primes to go here
    this.board.makeBoxes();
    this.board.makeRandomNumbers(this.psmooth,1,2,this.boardsize-2,this.boardsize-2);
    this.drawAll();
};

GameManager.prototype.drawAll = function () {
  canvasDraw.draw(this.board);
  if(this.gameover)canvasDraw.drawGO(this.board);
  if(this.showCredits)canvasDraw.drawCredits();
};

GameManager.prototype.update = function () {
  //ADD GAMEOVER CHECK
  //  this.gameover = 1;
  //  canvasDraw.animManager.clear();

  this.drawAll();
};

GameManager.prototype.handleTouch = function (mousePos) {
  var bx = Math.floor((mousePos.x - divCoords.bl)/this.board.boxwidth);
  var by = Math.floor((mousePos.y - divCoords.br)/this.board.boxwidth);
  if(bx >= 0 && bx < this.boardsize && by >= 0 && by < this.boardsize){
    bn = this.board.boxes[bx][by].number;
    bfs= factor(bn);
    if(bfs.length>1){
      //we are gonna try and split now
      var split = [bfs[0],bn/bfs[0]];
      emptyN = this.board.getEmptyNeighbors(this.board.boxes[bx][by]);
      if(emptyN.length>0){
        //we can expand into an empty block
        geb = emptyN[Math.floor(Math.random()*emptyN.length)];
        this.board.boxes[bx][by].number = split[1];
        this.board.boxes[bx][by].doColor();
        this.board.boxes[geb.x][geb.y].number = split[0];
        this.board.boxes[geb.x][geb.y].doColor();
        this.board.boxes[geb.x][geb.y].type = "number";
      } else {
        //ok we're gonna have to push a block out.
        possDirs = this.board.getPushableNeighbors(this.board.boxes[bx][by]);
        if(possDirs.length>0){
        //we can push into an empty block
          gdir = possDirs[Math.floor(Math.random()*possDirs.length)];
          this.board.boxes[bx][by].number = split[1];
          this.board.boxes[bx][by].doColor();
          this.board.pushBoxes(this.board.boxes[bx][by],gdir,split[0]);
        } else {
          //can't do anything :(
        }
      }
      window.canvasDraw.animManager.addBoxPop(this.board.boxes[bx][by])
      this.board.applyGravity();
      this.board.checkDoubles();
      if(this.canMove() == 0){
        this.gameover = 1;
      }
    }
    
  }

}

GameManager.prototype.canMove = function(){
  for (bx = 0; bx < this.board.sizex; bx++) {
    for (by = 0; by < this.board.sizey; by++) {
      bn = this.board.boxes[bx][by].number;
      bfs= factor(bn);
      if(bfs.length>1){
        //we are gonna try and split now
        var split = [bfs[0],bn/bfs[0]];
        emptyN = this.board.getEmptyNeighbors(this.board.boxes[bx][by]);
        if(emptyN.length>0){
          return (1);
        } else {
          //ok we're gonna have to push a block out.
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

  //touch inside gamearea
  if(this.gameover == 0 && this.inGame == 1 && mousePos.x > (divCoords.left) && mousePos.x < (divCoords.left+divCoords.width) && mousePos.y > divCoords.top && mousePos.y < (divCoords.top+divCoords.height)){
    mousePos = {x:mousePos.x - divCoords.left,y:mousePos.y-divCoords.top};
    this.handleTouch(mousePos);
  }
  //gameover Screen
  else if(this.gameover==1 && event == "touchstart") {
    if(mousePos.x > divCoords.left && mousePos.x < divCoords.left+divCoords.width && mousePos.y > divCoords.top+0.63*divCoords.height && mousePos.y < divCoords.top+0.7*divCoords.height){
      console.log("restart");
      this.restart();
    }
    if(mousePos.x > divCoords.left && mousePos.x < divCoords.left+divCoords.width && mousePos.y > divCoords.top+0.73*divCoords.height && mousePos.y < divCoords.top+0.8*divCoords.height){
      console.log("restart");
      this.mainMenu();
    }
  }

  //Credits screen dismiss
  else if(this.showCredits && event == "touchstart") {
    this.showCredits = 0;
  }

  //main menu choices
  else if(this.inGame==0 && event == "touchstart") {
    if(mousePos.x > divCoords.left && mousePos.x < divCoords.left+divCoords.width && mousePos.y > divCoords.top+0.23*divCoords.height && mousePos.y < divCoords.top+0.3*divCoords.height){
      this.inGame = 1;
      this.boardsize = 5;
      this.psmooth = numbers.threesmooth;
      //if(this.curMode.mode != 2) this.chooseMode(2,4);
      this.restart();
    }
    if(mousePos.x > divCoords.left && mousePos.x < divCoords.left+divCoords.width && mousePos.y > divCoords.top+0.37*divCoords.height && mousePos.y < divCoords.top+0.45*divCoords.height){
      this.inGame = 1;
      this.boardsize = 5;
      this.psmooth = numbers.elevensmooth;
      //if(this.curMode.mode != 0) this.chooseMode(0,4);
      this.restart();
    }

    if(mousePos.x > divCoords.left && mousePos.x < divCoords.left+divCoords.width && mousePos.y > divCoords.top+0.53*divCoords.height && mousePos.y < divCoords.top+0.6*divCoords.height){
      this.inGame = 1;
      this.psmooth = numbers.twentythreesmooth;
      this.boardsize = 7;
      //if(this.curMode.mode != 2) this.chooseMode(2,4);
      this.restart();
    }
    if(mousePos.x > 0 && mousePos.x < divCoords.left+divCoords.width && mousePos.y > (divCoords.top+divCoords.height)/2 +canvasDraw.scaled*(- 300 + 600 - 40) && mousePos.y < (divCoords.top+divCoords.height)/2 +canvasDraw.scaled*(- 300 + 600 + 20)){
      this.showCredits = 1;
    }
  }
};


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();