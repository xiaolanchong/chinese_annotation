
var dI = {
  old_background: '',
  over: function(el) {
    this.old_background = el.style.backgroundColor;
    el.style.backgroundColor = '#554';
  },
  out: function(el) {
    el.style.backgroundColor = this.old_background;
  },
  getX: function(obj) {
    return (obj.offsetLeft || 0) + (obj.offsetParent && this.getX(obj.offsetParent) || 0);
  },
  getY: function(obj) {
    return (obj.offsetTop || 0) + (obj.offsetParent && this.getY(obj.offsetParent) || 0);
  },
  positiontip: function(el, tip) {
    var innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var elx = this.getX(el);
    var ely = this.getY(el);
    if (tip.offsetWidth > 300)
      tip.style.width = "300px";
    shift = Math.abs(el.offsetWidth) > 40 ? 40 : Math.abs(el.offsetWidth) / 2
    if (innerWidth + scrollLeft - elx - el.offsetWidth < tip.offsetWidth)
      tip.style.left = elx + shift - tip.offsetWidth + "px";
    else
      tip.style.left = elx + shift + "px";
    if (innerHeight + scrollTop - ely - el.offsetHeight < tip.offsetHeight + 15)
      tip.style.top = ely - 3 - tip.offsetHeight + "px";
    else
      tip.style.top = ely + 3 + el.offsetHeight + "px";
  },
  ie: document.all
};

function sP(el, ev, zh) {
  var tip = document.getElementById("tip");
  el.onmouseout = function() {
    tip.style.visibility = "hidden";
    tip.style.left = "-1000px";
    tip.style.top = "-1000px";
    tip.style.backgroundColor = '';
    tip.style.width = "";
    dI.out(el);
  };
  dI.over(el);
  zh = zh ? zh : el.lastChild.nodeValue ? el.lastChild.nodeValue : el.lastChild.lastChild.nodeValue;
  var py = dI.vocab[zh][0];
  var en = dI.vocab[zh][1];
  var oh = dI.vocab[zh][5];
  var other = '';
  if (zh !== oh) {
    for (var i = 0; i < zh.length; ++i)
      other += zh[i] === oh[i] ? '-' : oh[i];
    other = ' [' + other + ']';
  }
  var tip_html = '<div style="font-size:150%;">' + zh + other + '</div>'
  for (var i = 0; i < py.length; ++i) {
    var enstr = '• ' + en[i].replace(/([^<])\//g, '$1<br />• ');
    tip_html += '<div style="font-weight:bold">' + py[i] +
      '</div><div style="text-align:left;font-size:90%">' + enstr + '</div>';
  }
  tip.innerHTML = tip_html;
  dI.positiontip(el, tip);
  tip.style.visibility = "visible";
}

dI.vocab = text_vocabulary;
