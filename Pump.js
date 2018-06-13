var Pump = function(diam, power, posX, posY, elementLength, id){
	Pipe.call(this, diam, 10*elementLength, posX, posY, elementLength);
	this.power = power; //Js^-1
	this.efficiency = 1;
	this.cavitating = false;
	this.id = id;
	if(id == null){this.id = "pump" + Pumps.length}
	this.label = this.id;
	this.mid = Math.floor(this.elements.length/2);
	this.inlet = this.elements[this.mid - 1];
	this.midPump = this.elements[this.mid];
	this.outlet = this.elements[this.mid + 1];
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
	
	for(var i = 0, l = this.elements.length, n = 0; i < l; i++){
		if(this.elements[i].pressure < 3200){
			n++;
		}
	}
	if(n > 0){
		this.cavitating = true; 
		
			if(this.efficiency > 0.01){
				this.efficiency -= 0.01;
			} else {
				this.efficiency = 0;
			}
		} else {
			this.cavitating = false;
			if(this.efficiency < 0.09){
				this.efficiency += 0.01;
			} else {
				this.efficiency = 1;
			}
			
		}	



		
		var midVel = this.interfaces[this.mid].velos[0][1];
		var outVel = this.interfaces[this.mid].velos[1][0];
		
		
				//console.log("before: " + midVel);

		
/*		if(this.outlet.pressure - this.midPump.pressure == 0){
					midVel += (1e9/time_scale)*this.power/(this.midPump.area*(0.1));
					outVel += (1e9/time_scale)*this.power/(this.midPump.area*(0.1));
				} else {
					midVel += (1e6/time_scale)*this.power/(this.midPump.area*(this.outlet.pressure - this.midPump.pressure));
					outVel += (1e6/time_scale)*this.power/(this.midPump.area*(this.outlet.pressure - this.midPump.pressure));
				}
	
*/

	
		if(midVel == 0){
			midVel +=	(2*this.efficiency*this.power/(this.outlet.mass*0.00001))/(time_scale);
			//midVel = this.efficiency*(1/time_scale);
		} else {
			midVel += (2*this.efficiency*this.power/(this.outlet.mass*midVel/1000000))/(time_scale);
		}
	
		if(outVel == 0){
			// outVel = this.efficiency*(1/time_scale);
			outVel +=	(2*this.power/(this.outlet.mass*0.00001))/(time_scale);
		} else {
			outVel += (2*this.power/(this.outlet.mass*outVel/1000000))/(time_scale);
		}
	

		
	
	
			//console.log("after: " + midVel);
			this.interfaces[this.mid].velos[0][1] = midVel;
			this.interfaces[this.mid].velos[1][0] = outVel;
		

	
	//console.log(this.interfaces[this.interfaces.length - 1].velos);
	for(var i = 0, l = this.elements.length; i < l; i++){  //update the mass of each pipe element
			this.elements[i].update(time_scale);
	}

	//if(this.outlet.pressure - this.midPump.pressure > this.maxPressure){
	//	this.outlet.pressure = this.midPump.pressure + this.maxPressure;
	//}


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