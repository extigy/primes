function AnimationManager(canvasMan) {
  this.canvasMan = canvasMan;
  this.animStack = new Array();
  this.callbackStack = new Array();
}

AnimationManager.prototype.clear = function() {
  this.animStack = new Array();
  this.callbackStack = new Array();
}

AnimationManager.prototype.doAnimFrames = function() {
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
      case "boxdrop":
        done = this.animBoxDrop(curAnim.animData);
        if(done==1){
          this.animStack.splice(i, 1);
          this.callbackStack[i](curAnim.animData.boxInfo,curAnim.animData.botboxInfo);
          this.callbackStack.splice(i, 1);
        }
        break;
      case "boxpull":
        done = this.animBoxPull(curAnim.animData);
        if(done==1){
          this.animStack.splice(i, 1);
          this.callbackStack[i](curAnim.animData.boxInfo,curAnim.animData.sourceboxInfo);
          this.callbackStack.splice(i, 1);
        }
        break;
      }
  }
}

AnimationManager.prototype.addBoxPop = function(box) {
  this.animStack.push(
    {"type":"boxpop","animData":{"boxInfo":box,"popSizes":["1.0","0.98","0.965","0.95","0.94","0.93","0.905","0.88","0.905","0.93"]}}
    );
  this.callbackStack.push(function(){});
}

AnimationManager.prototype.addBoxDrop = function(topbox,botbox,dir,callback) {
  this.animStack.push(
    {"type":"boxdrop","animData":{"boxInfo":topbox,"botboxInfo":botbox,"dropLoc":["0.95","0.8","0.6","0.4","0.2"],"dir":dir}}
    );
  this.callbackStack.push(callback);
}

AnimationManager.prototype.addBoxPull = function(box,sourcebox,dir,scaler,callback) {
  this.animStack.push(
    {"type":"boxpull","animData":{"boxInfo":box,"sourceboxInfo":sourcebox,"toscale":scaler,"dropLoc":["0.05","0.2","0.4","0.6","0.8"],"dir":dir}}
    );
  this.callbackStack.push(callback);
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
      animData.boxInfo.scale = sizemult;
    } else {
      animData.boxInfo.scale = 0;  
    } 
    return (0);
  } else {
    return(1);
  }
}

AnimationManager.prototype.animBoxPull = function(animData) {
  if(animData.dropLoc.length>0){
    dropShift = animData.dropLoc.pop();
    animData.boxInfo.type = "number"
    if (animData.boxInfo.type == "number"){
      switch(animData.dir){
        case "left":
          animData.boxInfo.shiftx = -dropShift;
          if(animData.toscale)animData.boxInfo.scale = 1-dropShift;
          break;
        case "right":
          animData.boxInfo.shiftx = dropShift;
          if(animData.toscale)animData.boxInfo.scale = 1-dropShift;
          break;
        case "up":
          animData.boxInfo.shifty = -dropShift;
          if(animData.toscale)animData.boxInfo.scale = 1-dropShift;
          break;
        case "down":
          animData.boxInfo.shifty = dropShift;
          if(animData.toscale)animData.boxInfo.scale = 1-dropShift;
          break;
        }
    } else {
      animData.boxInfo.scale = 1;
    } 
    animData.boxInfo.inAnim = 1;
    return (0);
  } else {
    animData.boxInfo.inAnim = 0;
    return(1);
  }
}

AnimationManager.prototype.animBoxDrop = function(animData) {
  if(animData.dropLoc.length>0){
    dropShift = animData.dropLoc.pop();
    if (animData.boxInfo.type == "number"){
      switch(animData.dir){
        case "left":
          animData.boxInfo.shiftx = -dropShift;
          break;
        case "right":
          animData.boxInfo.shiftx = dropShift;
          break;
        case "up":
          animData.boxInfo.shifty = -dropShift;
          break;
        case "down":
          animData.boxInfo.shifty = dropShift;
          break;
        }
    } else {
      animData.boxInfo.shifty = 0;
    } 
    animData.boxInfo.inAnim = 1;
    return (0);
  } else {
    animData.boxInfo.inAnim = 0;
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