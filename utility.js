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
}

function composeInfoBoxHTML(di){
var innards = "";
	for(var i = 0, l = di.length; i < l; i++){ //compose the HTML for the infobox
		if(i == 0){
			innards = '<div class="title">' + di[i] + '</div>';
		} else {
			for(var j = 0; j < 3; j++){
				innards += di[i][j];
				if(j == 0){
					innards += ' = ';
				}
			}
			if(i < l - 1){
				innards += '<br>';
			}
		}
	}
	return innards;
}