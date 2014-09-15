function InputManager(callback) {
  this.eventfunc = callback;
  this.listen();
}

InputManager.prototype.listen = function () {
  var s = this;
  // Respond to mouse
  document.getElementById('canvas-container').addEventListener("click", function (event) {
    var mousePos = {'x': event.pageX, 'y': event.pageY};
    s.eventfunc(mousePos,"touchstart");
    event.preventDefault();
    event.stopPropagation();
  });
  document.getElementById('canvas-container').addEventListener("mousedown", function (event) {
    event.preventDefault();
    event.stopPropagation();
  });

  //touches
  document.getElementById('canvas-container').addEventListener("touchstart", function (event) {
    if (event.touches.length > 1 || event.targetTouches > 1) {
      return;
    }
    touchStartClientX = event.touches[0].pageX;
    touchStartClientY = event.touches[0].pageY;
    var mousePos = {'x': touchStartClientX, 'y': touchStartClientY};

    s.eventfunc(mousePos,"touchstart");
    event.preventDefault();
    event.stopPropagation();
  });

  document.getElementById('canvas-container').addEventListener("touchmove", function (event) {
    if (event.touches.length > 1 || event.targetTouches > 1) {
      return;
    }
    event.preventDefault();
  });


};
