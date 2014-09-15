// iOS Stuff
/*function AdManager() {
  this.Adinited=false;
};

AdManager.prototype.makeAd = function(force) {
  if(globalAdEnable && Adinited==false){
    this.initAdMob();
  }
  if(globalAdEnable && force == 1){
    this.requestAdMob();
  }
};

AdManager.prototype.initAdMob = function() {
  window.plugins.AdMob.createBannerView(
    {'publisherId': '',
     'adSize': window.plugins.AdMob.AD_SIZE.SMART_BANNER,
     'positionAtTop': false
    },
    this.requestAdMob(), //if sucessful get an Ad
    function(){this.Adinited = false;}
  );
};

AdManager.prototype.requestAdMob = function() {
   this.Adinited = true;
   if(globalAdEnable){
     window.plugins.AdMob.requestAd(
         {'isTesting': false,
           'extras': {
             'color_bg': 'AAAAFF',
             'color_bg_top': 'FFFFFF',
             'color_border': 'FFFFFF',
             'color_link': '000080',
             'color_text': '808080',
             'color_url': '008000'
           },
         },null,null
     );
   }
};
*/
