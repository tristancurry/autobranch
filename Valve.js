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
	

	
}

Valve.prototype = Object.create(Pipe.prototype);
Valve.prototype.applySliderValue = function(val){
	this.setting = val;
	document.getElementById(this.id + "controlDisplay").innerHTML = Math.round(val*100) + "%";
	this.diam = this.oDiam*this.setting;
	this.updateDiam(this.diam, this.elements);
	
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
	
}
Valve.constructor = Valve;