//a simplified model of a tank. It's basically an element whose volume reduces as mass flows out, to a limit, and increases to a limit when mass flows in.


var Tank = function(diam, capacity, posX, posY, elementLength, id){
	Pipe.call(this, diam, 2*elementLength, posX, posY, elementLength);
	
	this.capacity = capacity;
	this.id = id;
	if(id == null){this.id = "tank" + Tanks.length}
	
	this.tank = this.elements[0];
	this.outlet = this.elements[1];
	
	this.tank.changeDiam(4*this.tank.diam);
	var stretch = this.capacity*1e6/this.tank.volume;
	//console.log(stretch);
	this.tank.length = this.tank.length*stretch;
	this.tank.posX += 0.5*this.tank.size;
	this.tank.size = 4*this.tank.size;
	this.tank.posX -= 0.5*this.tank.size;
	
	this.tank.changeDiam(this.tank.diam);
	
	
}

Tank.prototype = Object.create(Pipe.prototype);
Tank.constructor = Tank;

Tank.prototype.update = function(time_scale){
	Pipe.prototype.update.call(this, time_scale);
	
for(var i = 0, l = this.elements.length; i < l; i++){
	this.elements[i].pressure = pAtmo;
}
	
	var LperTimeUnit = this.outlet.voluFlow/(60*time_scale);
	var fracOfCurrentCapacity = LperTimeUnit/this.capacity;
	this.capacity = (1 - fracOfCurrentCapacity)*this.capacity;
	//console.log(this.capacity + " Litres ");
	this.tank.length = (1 - fracOfCurrentCapacity)*this.tank.length;
	this.tank.posX += 0.5*this.tank.size;
	this.tank.size = (1 - fracOfCurrentCapacity)*this.tank.size;
	this.tank.posX -= 0.5*this.tank.size; 
	this.tank.changeDiam(this.tank.diam);
	//console.log(this.tank.mass + "g, " + this.tank.volume + "mm^3, " + this.tank.pressure + "Pa ");
	
	
	
}

/*

Update function - 

1/work out Q of tank outlet (L/min)
2/Convert to L/timeunit
3/Convert to a percentage of the current capacity of the tank
4/Reduce tank element's length by the same percentage
5/Recalculate tank's volume & mass



*/