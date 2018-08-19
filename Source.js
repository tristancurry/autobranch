var Source = function(diam, length, power, posX, posY, id){
	Pipe.call(this, diam, length, posX, posY, elementLength);
	this.power = power; //Js^-1
	this.id = id;
	if(id == null){this.id = "source" + Sources.length}
	this.label = this.id;

	Sources.push(this); //add to the global list of Sources, for auto-naming
	Components.push(this);
	this.ComponentSN = Components.length - 1;
	Controls.push(this);
	this.ControlSN = Controls.length - 1;
	
	var controlPanel = document.getElementById("throttles");
	controlPanel.innerHTML += '<label for="'+ this.id + 'throttle" >Throttle: '+ this.id + '</label>';
	controlPanel.innerHTML += '<input type="range" id="' + this.id + 'throttle" class="comptrol" min = "0" max = "100" step = "0.1" value="' + this.power + '" data-connectedto="'+ this.ControlSN +'" >';
	controlPanel.innerHTML += '<span id="'+ this.id + 'throttleDisplay">' + this.power + '</span>';
	
	
	
	this.divRep = document.createElement("div");
	this.divRep.className = 'component';
	this.divRep.dataset.connectedto = this.ComponentSN;
	this.divRep.style.transform = "translate3d(" + (this.posX - 0.5*75) + "px, " + (this.posY - 0.5*75) + "px, 0px)";//this breaks the transform on the hover - need to put the component's divRep within a surrounding div, which does the positioning.
	componentry.appendChild(this.divRep);
	
	this.infobox = document.createElement("div");
	this.infobox.className = 'infobox';
	this.infobox.style.transform = "translate3d(" + this.posX + "px, " + this.posY + "px, 0px)";
	viewport.appendChild(this.infobox);
	
	


}

Source.prototype = Object.create(Pipe.prototype);
Source.prototype.isPump = true;
Source.prototype.maxPressure = 500000;
Source.prototype.colour = "rgba(100,100,100,1)";

Source.prototype.update = function(time_scale) {

	var massOut = this.end1.massFlow;
		
		if(this.end1.pressure < 0){this.end1.pressure = 0.1};
		this.end1.massFlow = this.end1.massFlow + (this.end1.density*1e6/time_scale)*((this.power/this.end1.pressure));
	
	
		
		this.end1.mass = this.end1.mass + this.end1.massFlow;
		if(this.end1.mass < 0){this.end1.mass = 0.001;}
		var oldDensity = this.end1.density;
		this.end1.density = this.end1.mass/(this.end1.volume/1000);
		var oldPressure = this.end1.pressure;
		this.end1.pressure = K*(1 - (oldDensity/this.end1.density)) + oldPressure;

	if (this.end1.pressure > this.end1.maxPressure) {
		this.end1.pressure = this.end1.maxPressure;
		this.end1.densityFromPressure();
	}
	this.end1.colour = "hsla(200, 100%, " + 100*(this.pressure - 100000)/2900000 +"%, 1)" //pressure range between 2550000 and 0
	this.end1.massFlow = massOut; //for testing of Source output visually
	this.end1.velo = this.end1.findVelo();
	this.end1.voluFlow = this.end1.velo*60*(this.end1.area)/1000;
	
	this.displayInfo = [this.label, ["throttle", Math.round(this.power), "%"], ["pressure", Math.round(this.end1.pressure/1000), "kPa"], ["q", Math.round(this.end1.voluFlow), "L/min"]]; 

	this.infobox.innerHTML = composeInfoBoxHTML(this.displayInfo);

}


Source.prototype.findVelo = function(){
	var avg = 0;
	for(var i = 0, l = this.end1.peVelos.length; i < l; i++){
		avg += this.end1.peVelos[i]/l;
	}
	return avg;
		
}

Source.prototype.applySliderValue = function(val){
	this.power = val;
	document.getElementById(this.id + "throttleDisplay").innerHTML = this.power;
}

Source.constructor = Source;