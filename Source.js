var Source = function(diam, length, power, posX, posY, id){
	PipeElement.call(this, diam, length, posX, posY);
	this.power = power; //Js^-1
	this.id = id;
	if(id == null){this.id = "source" + Sources.length}
	this.label = this.id;

	Sources.push(this); //add to the global list of Sources, for auto-naming
	Controls.push(this);
	this.SN = Controls.length - 1;
	
	var controlPanel = document.getElementById("throttles");
	controlPanel.innerHTML += '<label for="'+ this.id + 'throttle" >Throttle: '+ this.id + '</label>';
	controlPanel.innerHTML += '<input type="range" id="' + this.id + 'throttle" class="comptrol" min = "0" max = "100" step = "0.1" value="' + this.power + '" data-connectedto="'+ this.SN +'" >';
	controlPanel.innerHTML += '<span id="'+ this.id + 'throttleDisplay">' + this.power + '</span>';
	
	
	
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

Source.prototype = Object.create(PipeElement.prototype);
Source.prototype.isPump = true;
Source.prototype.maxPressure = 500000;
Source.prototype.colour = "rgba(100,100,100,1)";

Source.prototype.update = function(time_scale) {
	var massOut = this.massFlow;
		
	if(this.pressure <= this.maxPressure){
		if(this.pressure < 0){this.pressure = 0.1};
		this.massFlow = this.massFlow + (this.density*1e6/time_scale)*((this.power/this.pressure));
	
	
		
		this.mass = this.mass + this.massFlow;
		if(this.mass < 0){this.mass = 0.001;}
		var oldDensity = this.density;
		this.density = this.mass/(this.volume/1000);
		var oldPressure = this.pressure;
		this.pressure = K*(1 - (oldDensity/this.density)) + oldPressure;

	} else {
		this.pressure = this.maxPressure;
		this.densityFromPressure();
	}
	this.colour = "hsla(200, 100%, " + 100*(this.pressure - 100000)/2900000 +"%, 1)" //pressure range between 2550000 and 0
	this.massFlow = massOut; //for testing of Source output visually
	this.velo = this.findVelo();
	this.voluFlow = this.velo*60*(this.area)/1000;
	
	this.infobox.innerHTML = '<div class="title">'+ this.label + '</div>throttle = ' + Math.round(this.power) + '%<br>pressure = ' + Math.round(this.pressure/1000) + 'kPa<br>mass = ' + Math.round(this.mass) + 'g<br>q = ' + Math.round(this.voluFlow) + 'L/min';
	//do this in a more general way by cycling through a list of info on the object, complete with the units associated with that info.
	//e.g. this.displayInfo = [this.label, [this.pressure, "kPa"], [this.mass, "g"], [this.massFlow, "L/min"], ...]
	//this would allow all components to share the same code for displaying the infobox

}


Source.prototype.findVelo = function(){
	var avg = 0;
	for(var i = 0, l = this.peVelos.length; i < l; i++){
		avg += this.peVelos[i]/l;
	}
	return avg;
		
}

Source.prototype.applySliderValue = function(val){
	this.power = val;
	document.getElementById(this.id + "throttleDisplay").innerHTML = this.power;
}

Source.constructor = Source;