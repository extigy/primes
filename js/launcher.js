function AdManager() {
  AdManager.prototype.makeAd = function(force) {}
};

var globalAdEnable = false;
var canvasDraw = new CanvasDrawer();
window.lManager = null;
window.sManager = null;
window.cManager = null;
var preload;

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
        document.addEventListener('deviceready', this.onDeviceReady, false);

        preload = setInterval(function () {
			       console.log('Are Images Loaded?');
			       if(loaded.indexOf(0) == -1){
               console.log('Images Loaded');
               window.cManager = new ColorManager();
               window.sManager = new SoundManager();
				       window.lManager = new GameManager(4);
               setTimeout(function() {if(typeof(navigator.splashscreen)!='undefined') navigator.splashscreen.hide(); }, 100);
               window.clearInterval(preload);
             }
  		  }, 10);
      },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		  console.log("we are an app");
    }
};
