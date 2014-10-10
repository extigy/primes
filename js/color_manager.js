function ColorManager() {
  this.grc = 0.618033988749895;
}

ColorManager.prototype.numberHue = function (x,fcs){
  //mix colours using prime factorisation
  var nn = numbers.npn[fcs[0]];
  if(fcs[0]>12)nn=nn+2;
  var cc = (nn)*this.grc;
  var mhue = cc%1;

  for (var i=1;i<fcs.length;i++){
    nn = numbers.npn[fcs[i]];
    if(fcs[0]>12)nn=nn+2;
    cc = (nn)*this.grc;
    cc %= 1;
    mhue = (mhue+cc)/2;
  }
  return mhue;
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
