function getPosition(el) { //thx Kirupa - script for getting element coords on page
  var posX = 0;
  var posY = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      posX += (el.offsetLeft - xScroll + el.clientLeft);
      posY += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      posX += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      posY += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: posX,
    y: posY
  };
}


window.addEventListener("scroll", updatePosition, false);
window.addEventListener("resize", updatePosition, false);
 
function updatePosition() {
	viewport.pos= getPosition(viewport);
	console.log("new position = "+ viewport.pos.x +", "+ viewport.pos.y);
	console.log("scrollTop = " + viewport.clientTop);
}

