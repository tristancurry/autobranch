var Pump = function(diam, power, posX, posY, elementLength, id){//shall be 3 elements - inlet, midpump, outlet
	Pipe.call(this, diam, 3*elementLength, posX, posY, elementLength);
	this.power = power; //Js^-1
	this.cavitating = false;
	this.id = id;
	if(id == null){this.id = "pump" + Pumps.length}
	this.label = this.id;
	
	this.inlet = this.elements[0];
	this.midPump = this.elements[1];
	this.outlet = this.elements[2];
	this.interfaces[1].isOneWay = true;
	//console.log(this.interfaces);

	Pumps.push(this); //add to the global list of Pumps, for auto-naming
	Controls.push(this);
	this.SN = Controls.length - 1;
	
	var controlPanel = document.getElementById("throttles");
	controlPanel.innerHTML += '<label for="'+ this.id + 'throttle" >Throttle: '+ this.id + '</label>';
	controlPanel.innerHTML += '<input type="range" id="' + this.id + 'throttle" class="comptrol" min = "0" max = "100" step = "0.10" value="' + this.power + '" data-connectedto="'+ this.SN +'" >';
	controlPanel.innerHTML += '<span id="'+ this.id + 'throttleDisplay">' + this.power + '</span>';
	
	
	
	this.divRep = document.createElement("div");
	this.divRep.className = 'component';
	this.style = this.divRep.style;
	this.style.left = (viewport.pos.x + this.posX - 75/2) + "px";
	this.style.top = (viewport.pos.y + this.posY - 75/2) + "px";
	viewport.appendChild(this.divRep);
	
	this.infobox = document.createElement("div");
	this.infobox.className = 'infobox';
	this.style = this.infobox.style;
	this.style.left = (viewport.pos.x  + this.posX) + "px";
	this.style.top = (viewport.pos.y + this.posY) + "px";
	viewport.appendChild(this.infobox);


}

Pump.prototype = Object.create(Pipe.prototype);
Pump.prototype.isPump = true;
Pump.prototype.maxPressure = 6000000;
Pump.prototype.colour = "rgba(100,100,100,1)";

Pump.prototype.update = function(time_scale) {
	

	
			
	var massOut = 0; //g
	if(this.midPump.pressure < 3200 || Math.abs(this.outlet.massFlow) > Math.abs(this.outlet.massFlow)){
		this.cavitating = true;
	} else {
		this.cavitating = false;
	};
		
	
	
	for(var i = 0, l = this.elements.length; i < l; i++){  //update the mass of each pipe element
			this.elements[i].update(time_scale);
	}
	
	if(this.outlet.pressure - this.midPump.pressure < this.maxPressure){
		if(!this.cavitating){
		massOut = (this.midPump.density*1e6/time_scale)*((this.power/(this.outlet.pressure)));
		}
		//console.log("before: midpump mass: " + this.midPump.mass + ", outlet mass: " + this.outlet.mass);
		this.midPump.mass -= massOut;
		this.outlet.mass += massOut;
		//console.log("before: midpump mass: " + this.midPump.mass + ", outlet mass: " + this.outlet.mass);

	} else {
		this.outlet.pressure = this.maxPressure + this.midPump.pressure;
		this.outlet.densityFromPressure();
		this.midPump.massFlow = 0;
	}
	
	/*this.colour = "hsla(200, 100%, " + 100*(this.pressure - 100000)/2900000 +"%, 1)" //pressure range between 2550000 and 0
	this.outlet.massFlow = massOut; //for testing of pump output visually
	this.outlet.velo = this.outlet.findVelo();
	*/
	this.infobox.innerHTML = '<div class="title">'+ this.label + '</div>throttle = ' + Math.round(this.power) + '%<br>pressure = ' + Math.round(this.outlet.pressure/1000) + 'kPa<br>mass = ' + Math.round(this.outlet.mass) + 'g<br>q = ' + Math.round(60*this.outlet.massFlow*timescale*physicsSteps) + 'L/min';

	//do this in a more general way by cycling through a list of info on the object, complete with the units associated with that info.
	//e.g. this.displayInfo = [this.label, [this.pressure, "kPa"], [this.mass, "g"], [this.massFlow, "L/min"], ...]
	//this would allow all components to share the same code for displaying the infobox
		
}

Pump.prototype.applySliderValue = function(val){
	this.power = val;
	document.getElementById(this.id + "throttleDisplay").innerHTML = this.power;
}

Pump.constructor = Pump;