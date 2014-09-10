function AnimationManager(canvasMan) {
  this.canvasMan = canvasMan;
  this.animStack = new Array();
  this.init();
}

AnimationManager.prototype.init = function() {
}

AnimationManager.prototype.clear = function() {
  this.animStack = new Array();
}

AnimationManager.prototype.doAnimFrames = function() {
  //Draw all queued animations
  for(var i=this.animStack.length-1;i>=0;i--){
    switch(this.animStack[i].type){
      case "boxpop":
        done = this.animBoxPop(this.animStack[i].animData);
        if(done==1)this.animStack.splice(i, 1);
        break;
      }
  }
}

AnimationManager.prototype.addBoxPop = function(box) {
  this.animStack.push(
    {"type":"boxpop","animData":{"boxInfo":box,"popSizes":["1.0","1.01","1.02","1.035","1.05","1.06","1.07","1.095","1.12","1.095","1.07"]}}
    );
}


AnimationManager.prototype.animBoxPop = function(animData) {
  if(animData.popSizes.length>0){
    sizemult = animData.popSizes.pop();
    animData.boxInfo.scale = sizemult;
    this.canvasMan.drawBox(animData.boxInfo);
    return (0);
  } else {
    return(1);
  }
}

AnimationManager.prototype.animFinished = function() {
  if(this.animStack.length == 0){
    return 1;
  } else {
    return 0;
  }
};

AnimationManager.prototype.latestAnimFramesDone = function() {
  if(this.animStack.length == 0){
    return 1000000;
  } else {
    return(11-this.animStack[this.animStack.length-1].animData.popSizes.length);
  }
};
