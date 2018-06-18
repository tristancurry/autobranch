//a simplified model of a tank. It's basically an element whose volume reduces as mass flows out, to a limit, and increases to a limit when mass flows in.


var Tank = function(diam, capacity, posX, posY, elementLength, id){
	Pipe.call(this, diam, 3*elementLength, posX, posY, elementLength);
	
	this.capacity = capacity;
	this.maxCapacity = capacity;
	this.id = id;
	if(id == null){this.id = "tank" + Tanks.length}
	this.inlet = this.elements[0]
	this.tank = this.elements[1];
	this.outlet = this.elements[2];
	this.tankMass = this.tank.mass;
	this.interfaces[1] = new Interface([this.outlet, this.tank]);
	
	//this.tank.changeDiam(4*this.tank.diam);
	//var stretch = this.capacity*1e6/this.tank.volume;
	//console.log(stretch);
	//this.tank.length = this.tank.length*stretch;
	//this.tank.posX += 0.5*this.tank.size;
	//this.tank.size = 4*this.tank.size;
	//this.tank.posX -= 0.5*this.tank.size;
	//this.inlet.posX = this.tank.posX - this.inlet.size;
	
	//this.tank.changeDiam(this.tank.diam);
	
	
}

Tank.prototype = Object.create(Pipe.prototype);
Tank.constructor = Tank;

Tank.prototype.update = function(time_scale){
	Pipe.prototype.update.call(this, time_scale);
	
//for(var i = 0, l = this.elements.length; i < l; i++){
	//this.elements[i].pressure = pAtmo;
//}
	
	var LperTimeUnit = (-1*this.inlet.voluFlow + this.outlet.voluFlow)/(60*time_scale);
	var fracOfCurrentCapacity = LperTimeUnit/this.capacity;
	this.capacity = (1 - fracOfCurrentCapacity)*this.capacity;
	if(this.capacity < 1){
		this.interfaces[1].isOneWay = true;
		//do thing for running out
	} else if (this.capacity > this.maxCapacity){
		this.capacity = this.maxCapacity;
	} else {
		this.interfaces[1].isOneWay = false;
	}
	this.tank.mass = tankMass;
	this.tank.pressure = pAtmo;
	this.tank.densityFromPressure();

	
	
	
}

/*

Update function - 

1/work out Q of tank outlet (L/min)
2/Convert to L/timeunit
3/Convert to a percentage of the current capacity of the tank
4/Reduce tank element's length by the same percentage
5/Recalculate tank's volume & mass



*/