var Sink = function(diam, length, posX, posY, id){
	Pipe.call(this, diam, length, posX, posY, elementLength);
	this.id = id;
	if(id == null){this.id = "sink" + Sinks.length}
	this.label = this.id;
	
	Sinks.push(this);
	this.end1.isSink = true;
	
}

Sink.prototype = Object.create(Pipe.prototype);
Sink.prototype.colour = "rgba(0,0,0,1)";
Sink.prototype.update = function() {
		this.end1.mass = 0;
		this.end1.pressure = pAtmo;
		this.end1.density = rho;
		this.end1.velo = this.end1.findVelo();
		
	}
Sink.constructor = Sink;

