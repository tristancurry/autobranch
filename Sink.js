var Sink = function(diam, length, posX, posY, id){
	PipeElement.call(this, diam, length, posX, posY);
	this.id = id;
	if(id == null){this.id = "sink" + Sinks.length}
	this.label = this.id;
	
	Sinks.push(this);
	
}

Sink.prototype = Object.create(PipeElement.prototype);
Sink.prototype.colour = "rgba(0,0,0,1)";
Sink.prototype.isSink = true;
Sink.prototype.update = function() {
		this.mass = 0;
		this.pressure = pAtmo;
		this.density = rho;
		this.velo = this.findVelo();
		
	}
Sink.constructor = Sink;

//make Sink and Source inherit from Pipe, rather than PipeElement
//This will simplify the handling of everything in the network, and allow for common usage of HTML-related functions