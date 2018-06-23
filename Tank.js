//a simplified model of a tank. It's basically an element that maintains atmospheric pressure and mass until it is empty.


var Tank = function(diam, capacity, posX, posY, elementLength, id){
	Pipe.call(this, diam, 3*elementLength, posX, posY, elementLength);
	
	this.capacity = capacity;
	this.maxCapacity = capacity;
	this.id = id;
	if(id == null){this.id = "tank" + Tanks.length}
	this.inlet = this.elements[0]
	this.tank = this.elements[1];
	this.tank.length = 5*elementLength;
	this.tank.changeDiam(400);
	this.outlet = this.elements[2];
	this.tankMass = this.tank.mass;
	this.interfaces[1] = new Interface([this.outlet, this.tank]);
	
	
}

Tank.prototype = Object.create(Pipe.prototype);
Tank.constructor = Tank;

Tank.prototype.update = function(time_scale){
	Pipe.prototype.update.call(this, time_scale);
	
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
	for(var i = 0, l = this.elements.length; i < l; i++){
	this.elements[1].mass = this.tankMass;
	this.elements[1].pressure = pAtmo;
	this.elements[1].densityFromPressure();
		
	}
	
	
}

Tank.prototype.render = function(ctx){
	Pipe.prototype.render.call(this, ctx);
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillText(Math.round(100*this.capacity)/100, this.posX, this.posY - 120);
}

/*

Update function - 

1/work out Q of tank outlet (L/min)
2/Convert to L/timeunit
3/Convert to a percentage of the current capacity of the tank
4/Reduce tank element's length by the same percentage
5/Recalculate tank's volume & mass



*/