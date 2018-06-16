var Pump = function(diam, power, posX, posY, elementLength, id){
	Pipe.call(this, diam, 7*elementLength, posX, posY, elementLength);
	this.power = power; //Js^-1
	this.efficiency = 1;
	this.cavitating = false;
	this.id = id;
	if(id == null){this.id = "pump" + Pumps.length}
	this.label = this.id;
	this.mid = Math.floor(this.elements.length/2);
	this.inlet = this.elements[0];
	this.midPump = this.elements[this.mid];
	this.outlet = this.elements[this.elements.length - 1];
	//this.interfaces[this.mid -1].isOneWay = true;
	this.interfaces[this.mid].isOneWay = true;
	
	this.midPump.isPump = true;
	
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
	console.log(getComputedStyle(this.divRep));
	this.divRep.style.transform = "translate3d(" + (this.posX + this.mid*this.elementLength - 0.5*75) + "px, " + (this.posY - 0.5*75) + "px, 0px)";//this breaks the transform on the hover - need to put the component's divRep within a surrounding div, which does the positioning.
	viewport.appendChild(this.divRep);
	
	this.infobox = document.createElement("div");
	this.infobox.className = 'infobox';
	this.infobox.style.transform = "translate3d(" + (this.posX + this.mid*this.elementLength) + "px, " + this.posY + "px, 0px)";
	viewport.appendChild(this.infobox);


}

Pump.prototype = Object.create(Pipe.prototype);
Pump.prototype.isPump = true;
Pump.prototype.maxPressure = 6000000;
Pump.prototype.colour = "rgba(100,100,100,1)";

Pump.prototype.update = function(time_scale) {
	
	for(var i = 0, l = this.elements.length, n = 0; i < l; i++){
		if(this.elements[i].pressure < 3200){
			n++;
		}
	}
	if(n > 0){
		this.cavitating = true; 
		
			if(this.efficiency > 1000/time_scale){
				this.efficiency -= 1000/time_scale;
			} else {
				this.efficiency = 0;
			}
		} else {
			this.cavitating = false;
			if(this.efficiency < 1 - 1000/time_scale){
				this.efficiency += 1000/time_scale;
			} else {
				this.efficiency = 1;
			}
			
		}

		
    if(this.efficiency > 0 && this.power >0 && this.outlet.pressure - this.midPump.pressure < this.maxPressure){
			this.outlet.massFlow  += (this.outlet.density*1e6/time_scale)*((this.efficiency*this.power/this.outlet.pressure));
			this.midPump.massFlow -= (this.outlet.density*1e6/time_scale)*((this.efficiency*this.power/this.outlet.pressure));

	}
	
		
	for(var i = 0, l = this.elements.length; i < l; i++){  //update the mass of each pipe element
			this.elements[i].update(time_scale);
	}
	
	if(this.power > 0){ //this hacky fix means that the volumetric flows will display properly - for some reason, the flow velocity is halved around this interface when the pump is running...
		this.midPump.voluFlow = 2*this.midPump.voluFlow;
		this.outlet.voluFlow = 2*this.outlet.voluFlow;
}


	this.infobox.innerHTML = '<div class="title">'+ this.label + '</div>throttle = ' + Math.round(this.power) + '%<br>pressure = ' + Math.round(this.outlet.pressure/1000) + 'kPa<br>mass = ' + Math.round(this.outlet.mass) + 'g<br>q = ' + Math.round(this.outlet.voluFlow) + 'L/min';

	//do this in a more general way by cycling through a list of info on the object, complete with the units associated with that info.
	//e.g. this.displayInfo = [this.label, [this.pressure, "kPa"], [this.mass, "g"], [this.massFlow, "L/min"], ...]
	//this would allow all components to share the same code for displaying the infobox
		
}

Pump.prototype.applySliderValue = function(val){
	this.power = val;
	document.getElementById(this.id + "throttleDisplay").innerHTML = this.power;
}

Pump.constructor = Pump;