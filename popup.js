/* exported sP */
/* global text_vocabulary */

'use strict';

const dI = {
  over: function (el) {
    $(el).addClass('hilite');
  },
  out: function (el) {
    $(el).removeClass('hilite');
  },
  getX: function (obj) {
    return (obj.offsetLeft || 0) + (obj.offsetParent && this.getX(obj.offsetParent) || 0);
  },
  getY: function (obj) {
    return (obj.offsetTop || 0) + (obj.offsetParent && this.getY(obj.offsetParent) || 0);
  },
  positiontip: function (el, tip) {
    const innerWidth = window.innerWidth ||
                       document.documentElement.clientWidth ||
                       document.body.clientWidth;
    const innerHeight = window.innerHeight ||
                        document.documentElement.clientHeight ||
                        document.body.clientHeight;
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const elx = this.getX(el);
    const ely = this.getY(el);
    if (tip.offsetWidth > 300) {
      tip.style.width = '300px';
    }
    const shift = Math.abs(el.offsetWidth) > 40 ? 40 : Math.abs(el.offsetWidth) / 2;
    if (innerWidth + scrollLeft - elx - el.offsetWidth < tip.offsetWidth) {
      tip.style.left = Math.max(elx + shift - tip.offsetWidth, 0) + 'px';
    } else {
      tip.style.left = elx + shift + 'px';
    }
    if (innerHeight + scrollTop - ely - el.offsetHeight < tip.offsetHeight + 15) {
      tip.style.top = ely - 3 - tip.offsetHeight + 'px';
    } else {
      tip.style.top = ely + 3 + el.offsetHeight + 'px';
    }
  },
  ie: document.all
};

function sP(el, ev, zh) {
  const tip = $('#tip')[0];
  el.onmouseout = function () {
    tip.style.visibility = 'hidden';
    tip.style.left = '-1000px';
    tip.style.top = '-1000px';
    tip.style.backgroundColor = '';
    tip.style.width = '';
    dI.out(el);
  };
  dI.over(el);
  let zh_fallback;
  if (zh) {
    zh_fallback = zh;
  } else if (el.lastChild.nodeValue) {
    zh_fallback = el.lastChild.nodeValue;
  } else {
    zh_fallback = el.lastChild.lastChild.nodeValue;
  }
  const item = dI.vocab[zh_fallback];
  const py = item[0];
  const en = item[1];
  const oh = item[5];
  let other = '';
  if (zh_fallback !== oh) {
    for (let i = 0; i < zh_fallback.length; ++i) {
      other += zh_fallback[i] === oh[i] ? '-' : oh[i];
    }
    other = ' [' + other + ']';
  }
  let tip_html = `<div style="font-size:150%;color:lightblue">${zh_fallback}${other}</div>`;
  for (let i = 0; i < py.length; ++i) {
    const enstr = '• ' + en[i].replace(/([^<])\//g, '$1<br />• ');
    tip_html += '<div style="font-weight:bold">' + py[i] +
      '</div><div style="text-align:left;font-size:90%">' + enstr + '</div>';
  }
  tip.innerHTML = tip_html;
  dI.positiontip(el, tip);
  tip.style.visibility = 'visible';
}

dI.vocab = text_vocabulary;
