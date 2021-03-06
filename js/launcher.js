var globalAdEnable = false;
var isMobile = {
Android: function() { return navigator.userAgent.match(/Android/i); },
BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
Windows: function() { return navigator.userAgent.match(/IEMobile/i); },
any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

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
          window.cManager = new ColorManager();
          window.canvasDraw = new CanvasDrawer();
          window.lManager = new GameManager(4);
          window.canvasDraw.preRenderBoxes();
          window.now = 0;
          window.then = Date.now();
          //requestAnimFrame(animloop);
          //if(typeof(navigator.splashscreen)!='undefined') navigator.splashscreen.hide();
        },false);
        window.addEventListener('resize', function(event){
            window.canvasDraw.prepareCanvas(window.canvasDraw.canvas);
            window.canvasDraw.prepareCanvas(window.canvasDraw.bgcanvas);
            setTimeout(function(event){ //Almost working - IOS Fix
              window.canvasDraw.setUpUIAR();
              window.lManager.board.redoBoxSize();
              window.canvasDraw.drawBGinit(window.lManager.board);
              //window.canvasDraw.preRenderBoxes();
              requestAnimFrame(animloop);
            },200);
        });
      },
    // deviceready Event Handler
    onDeviceReady: function() {
        //MORE IOS SETUP
        console.log("we are an app");
    }
};
