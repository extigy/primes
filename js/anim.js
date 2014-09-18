function AnimationManager(canvasMan) {
  this.canvasMan = canvasMan;
  this.animStack = new Array();
  this.callbackStack = new Array();
  this.init();
}

AnimationManager.prototype.init = function() {
}

AnimationManager.prototype.clear = function() {
  this.animStack = new Array();
  this.callbackStack = new Array();
}

AnimationManager.prototype.doAnimFrames = function() {
  //Draw all queued animations
  for(var i=0;i<this.animStack.length;i++){
    curAnim = this.animStack[i];  
    switch(curAnim.type){
      case "boxpop":
        done = this.animBoxPop(curAnim.animData);
        if(done==1){
          this.animStack.splice(i, 1);
          this.callbackStack[i](curAnim.animData.boxInfo);
          this.callbackStack.splice(i, 1);
        }
        break;
      }
  }
}

AnimationManager.prototype.addBoxPop = function(box) {
  this.animStack.push(
    {"type":"boxpop","animData":{"boxInfo":box,"popSizes":["1.0","1.01","1.02","1.035","1.05","1.06","1.07","1.095","1.12","1.095","1.07"]}}
    );
  this.callbackStack.push(function(){});
}

AnimationManager.prototype.shrinkBox = function(box,callback) {
  this.animStack.push(
    {"type":"boxpop","animData":{"boxInfo":box,"popSizes":["1.9","1.8","1.7","1.6","1.5","1.4","1.3","1.2","1.1","1.0"]}}
    );
  this.callbackStack.push(callback);
}



AnimationManager.prototype.animBoxPop = function(animData) {
  if(animData.popSizes.length>0){
    sizemult = animData.popSizes.pop();
    if (animData.boxInfo.type == "number"){
      animData.boxInfo.scale = 2-sizemult;
    } else {
      animData.boxInfo.scale = 0;  
    } 
    return (0);
  } else {
    return(1);
  }
}

AnimationManager.prototype.animFinished = function() {
  if(this.animStack.length < 1){
    return 1;
  } else {
    return 0;
  }
};