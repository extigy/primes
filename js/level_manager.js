function GameManager(size) {
  this.inputManager   = new InputManager(this.handleEvent.bind(this));
  this.adManager      = new AdManager();
  this.boardsize = 5;
  this.board      = new Board(this.boardsize);
  this.gameover;
  this.inGame;
  this.showCredits;
  this.playpop;
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
  this.stopTimer();
}

GameManager.prototype.restart = function () {
    this.gameover = 0;
    this.playpop = 0;
    this.board = new Board(this.boardsize);
    this.makeLevel();
};

GameManager.prototype.makeLevel = function () {
    this.playpop = 0;
    //Code for making initial set of primes to go here
    this.board.makeBoxes();
    this.board.makeRandomNumbers(numbers.elevensmooth,1,2,3,3);
    this.drawAll();
    this.startTimer();
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
  var by = Math.floor((mousePos.y - divCoords.br)/this.board.boxwidth)
  if(bx >= 0 && bx < this.boardsize){
    console.log(bx+":"+by)
  }

}

GameManager.prototype.handleEvent = function (mousePos,event) {
  //todo: FIX MOUSE LOCATIONS

  //touch inside gamearea
  if(this.gameover == 0 && this.inGame == 1 && mousePos.x > (divCoords.left) && mousePos.x < (divCoords.left+divCoords.width) && mousePos.y > divCoords.top && mousePos.y < (divCoords.top+divCoords.height)){
    mousePos = {x:mousePos.x - divCoords.left,y:mousePos.y-divCoords.top};
    this.handleTouch(mousePos);
  }
  //gameover Screen
  else if(this.gameover==1 && event == "touchstart") {
    if(mousePos.x > 0 && mousePos.x < divCoords.left+divCoords.width && mousePos.y > (divCoords.top+divCoords.height)/2 +canvasDraw.scaled*(- 250 + 370 - 35) && mousePos.y < (divCoords.top+divCoords.height)/2 +canvasDraw.scaled*(- 250 + 370 + 20)){
      console.log("restart");
      this.restart();
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
      //if(this.curMode.mode != 2) this.chooseMode(2,4);
      this.restart();
    }
    if(mousePos.x > divCoords.left && mousePos.x < divCoords.left+divCoords.width && mousePos.y > divCoords.top+0.37*divCoords.height && mousePos.y < divCoords.top+0.45*divCoords.height){
      this.inGame = 1;
      //if(this.curMode.mode != 0) this.chooseMode(0,4);
      this.restart();
    }
    if(mousePos.x > 0 && mousePos.x < divCoords.left+divCoords.width && mousePos.y > (divCoords.top+divCoords.height)/2 +canvasDraw.scaled*(- 300 + 600 - 40) && mousePos.y < (divCoords.top+divCoords.height)/2 +canvasDraw.scaled*(- 300 + 600 + 20)){
      this.showCredits = 1;
    }
  }
};

GameManager.prototype.startTimer = function () {
  self = this;
  clearInterval(this.timerInterval);
  this.timerInterval = setInterval(function () {
    if(window.lManager){
      window.lManager.update();
    }
  }, 30);
};

GameManager.prototype.stopTimer = function () {
  clearInterval(this.timerInterval);
  this.timerInterval = setInterval(function () {
  if(window.lManager){
    window.lManager.update();
  }
}, 30);
};
