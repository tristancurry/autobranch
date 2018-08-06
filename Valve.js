var Valve = function(diam, length, posX, posY, setting, elementLength, id){
	this.oDiam = this.diam;
	this.setting = setting; //0 = closed, 1 = open
	this.diam = this.setting*this.oDiam;
	Pipe.call(this, this.diam, length, posX, posY, elementLength);
	if(setting == null || setting < 0 || setting > 1){this.setting = 0;}
	this.id = id;
	if(id == null){this.id = "valve" + Valves.length}
	this.label = this.id;
	


	var mid = Math.round(this.elements.length/2);
	this.elements[mid].label = this.label;
	
	Valves.push(this); //add to the global list of Valves, for auto-naming
	Controls.push(this);
	this.SN = Controls.length - 1;
	
	var controlPanel = document.getElementById("valves");
	controlPanel.innerHTML += '<label for="'+ this.id + 'control" id="' + this.id + 'label">Setting: '+ this.id + '</label>';
	controlPanel.innerHTML += '<input type="range" id="' + this.id + 'control" class="comptrol" min = "0" max = "1" step = "0.01" value="' + this.setting + '" data-connectedto="' + this.SN + '">';
	controlPanel.innerHTML += '<span id="'+ this.id + 'controlDisplay">' + this.setting*100 + '%</span>';
	
	this.divRep = document.createElement("div");
	this.divRep.className = 'component';
	console.log(getComputedStyle(this.divRep));
	this.divRep.style.transform = "translate3d(" + (this.posX - 0.5*75) + "px, " + (this.posY - 0.5*75) + "px, 0px)";//this breaks the transform on the hover - need to put the component's divRep within a surrounding div, which does the positioning.
	viewport.appendChild(this.divRep);
	
	this.infobox = document.createElement("div");
	this.infobox.className = 'infobox';
	this.infobox.style.transform = "translate3d(" + this.posX + "px, " + this.posY + "px, 0px)";
	viewport.appendChild(this.infobox);
	
}

Valve.prototype = Object.create(Pipe.prototype);


Valve.prototype.applySliderValue = function(val){
	this.setting = val;
	document.getElementById(this.id + "controlDisplay").innerHTML = Math.round(val*100) + "%";
	this.diam = this.oDiam*this.setting;
	this.updateDiam(this.diam, this.elements);
}
	
Valve.prototype.render = function(ctx){
	Pipe.prototype.render.call(this, ctx);
	ctx.strokeStyle = "rgb(255,0,0)";
	ctx.lineWidth = "2";
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.beginPath();
	ctx.save();
	ctx.translate(this.posX - 0.25*this.length/displayScale, this.posY - 0.5*this.oDiam);
	ctx.rect(0,0,this.elements.length*this.elementLength/displayScale,this.oDiam);
	ctx.stroke();
	ctx.restore();
}

Valve.prototype.update = function(time_scale){
	Pipe.prototype.update.call(this, time_scale);
	this.displayInfo = [this.label, ["setting", Math.round(100*this.setting), "%"], ["pressure", Math.round(this.end2.pressure/1000), "kPa"], ["q", Math.round(this.end2.voluFlow), "L/min"]]; 
	this.infobox.innerHTML = composeInfoBoxHTML(this.displayInfo);
}
	
Valve.constructor = Valve;