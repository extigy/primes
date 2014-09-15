var grc = 0.618033988749895;
function ColorManager() {
  this.cc = 0;
}
ColorManager.prototype.dec2hex = function(d) {
  return(("0"+(Number(d).toString(16))).slice(-2).toUpperCase());
}
ColorManager.prototype.HSV2RGB = function(h,s,v){
  h_i = Math.floor(h*6);
  f = h*6 - h_i;
  p = v * (1 - s);
  q = v * (1 - f*s);
  t = v * (1 - (1 - f) * s);
  switch(h_i){
    case 0:
    r=v;g=t;b=p;
    break;
    case 1:
    r=q;g=v;b=p;
    break;
    case 2:
    r=p;g=v;b=t;
    break;
    case 3:
    r=p;g=q;b=v;
    break;
    case 4:
    r=t;g=p;b=v;
    break;
    case 5:
    r=v;g=p;b=q;
    break;
  }
  return('#'+this.dec2hex(Math.round(r*256))+this.dec2hex(Math.round(g*256))+this.dec2hex(Math.round(b*256)));
}

ColorManager.prototype.nextHue = function (){
  this.cc += grc;
  this.cc %= 1;
  return this.cc
}

ColorManager.prototype.numberHue = function (x,fcs){
  //mix colours from prime factorisation
  var cc = (numbers.npn[fcs[0]])*grc;
  var mhue = cc%1;
  
  for (var i=1;i<fcs.length;i++){
    cc = (numbers.npn[fcs[i]])*grc;
    cc %= 1;
    mhue = (mhue+cc)/2;
  }
  return mhue;
}
