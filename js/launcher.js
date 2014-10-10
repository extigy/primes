var globalAdEnable = false;
function AdManager() {
  AdManager.prototype.makeAd = function(force) {
    //FOR IOS: no ads yet lol
  }
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        window.addEventListener('deviceready', this.onDeviceReady, false);
        window.addEventListener('load', function(event){
          window.canvasDraw = new CanvasDrawer();
          window.cManager = new ColorManager();
          window.lManager = new GameManager(4);
          window.now = 0;
          window.then = Date.now();
          window.animloop();
          //if(typeof(navigator.splashscreen)!='undefined') navigator.splashscreen.hide();
        },false);
        window.addEventListener('resize', function(event){
            window.canvasDraw.prepareCanvas(window.canvasDraw.canvas);
            window.canvasDraw.prepareCanvas(window.canvasDraw.bgcanvas);
            setTimeout(function(event){ //Almost working - IOS Fix
              window.canvasDraw.setUpUIAR();
              window.lManager.board.redoBoxSize();
              window.canvasDraw.drawBGinit(window.lManager.board);
            },200);
        });
      },
    // deviceready Event Handler
    onDeviceReady: function() {
        //MORE IOS SETUP
        console.log("we are an app");
    }
};
