var Pipe = function(diam, length, posX, posY, elementLength, angStart, angEnd, id) {
	this.diam = diam; 		//mm
	this.length = length; 	//mm
	this.posX = posX;
	this.posY = posY; //starting position of pipe
	this.elements = [];
	this.interfaces = [];
	this.elementLength = elementLength
	//this.elastic = elastic;
	
	/*if(elastic != true){
		this.elastic = false;
	}*/
	
	this.id = id;
	if(id == null){this.id = "pipe" + Pipes.length}
	this.label = this.id;
	
	if(angStart == null){this.angStart = 0} else {this.angStart = angStart};
	if(angEnd == null){this.angEnd = 0} else {this.angEnd = angEnd};
	
	
	var N = Math.round(length/(this.elementLength));
	
	this.deltaAng = (this.angEnd - this.angStart);
	
	
	
	for (var i = 0; i < N; i++){
		//var X;
		//if(i == 0){X = this.posX;} else {X = this.elements[i - 1].posX + this.elements[i - 1].size}
		var p = new PipeElement(this.diam, elementLength, 0, this.posY); //create a pipe's worth of elements
		p.pressure = pAtmo;
		this.elements.push(p);
	}
		
	for (var i = 0; i < N - 1; i++){
		var f = new Interface([this.elements[i], this.elements[i + 1]]); //create interfaces joining each neighbouring element
		f.buildVelos();
		this.interfaces.push(f);
	}
	
	this.end1 = this.elements[0];
	this.end2 = this.elements[N-1];
	
	
	this.updateEndX();
	
	return this;
	
	
};

Pipe.prototype = {
	diam: 64, //mm
	length: 100, //mm
	posX: 0,
	posY: 0,
	elementLength: 100, //mm
	label: "",
	angStart:0,
	angEnd:0,
	
	resetMassFlows: function(){
		for(var i = 0, l = this.elements.length; i < l; i++){  //reset mass flows to zero for this round of calculations
			this.elements[i].resetMassFlows();
		}
	},
	
	calculateMassFlows: function(time_scale){
		for(var i = 0, l = this.interfaces.length; i < l; i++){ //calculate mass flows across each interface
			this.interfaces[i].calculateMassFlows(time_scale);
		}

	},
	
	update: function(time_scale){
			for(var i = 0, l = this.elements.length; i < l; i++){  //update the mass of each pipe element
			this.elements[i].update(time_scale);
			/*if(this.elastic){
				var newDiam =1 + 1.1*this.diam*(1 - Math.pow((1/11),this.elements[i].pressure/pAtmo)); //make sure diameter never goes below 1mm
				this.elements[i].changeDiam(newDiam);
			}*/ 
				//NOTE: experimental feature
				//Elasticity in the hoses is fun, but it screws with the mass continuity, because mass is created/destroyed when the hoses change diameter.
				//the way this is handled, if you DON'T change the mass, the densities change enormously, which changes the pressures enormously, which leads
				//to ridiculous accelerations across interfaces and the whole system breaks on any timestep...
				//One way to handle this would be to break the change into a series of very tiny timesteps, but this will bog the simulation.
				//Another way would be to have another layer of calculations where the mass squeezed out, or required by each element upon changing is
				//determined, then applied to the 'calculate mass flows', but that might still cause the awkwardly high accelerations...
		}
	},
	render: function(ctx){
		ctx.save();
		ctx.translate(this.posX,0);
		var rot = this.deltaAng*Math.PI/180;
		var deltaRot = rot/this.elements.length;
		if(this.deltaAng != 0){
		var radius = this.elementLength*this.elements.length/rot;
	}
			//console.log("rot= " + rot + ", radius = " + radius);
		for(var i = 0, l = this.elements.length; i < l; i++){
			ctx.save();
			if(this.deltaAng != 0){
				ctx.translate(0,-1*radius);
				ctx.rotate(-1*i*deltaRot);
				ctx.translate(0, 1*radius)
			} else {
				ctx.translate(i*this.elementLength,0);
			}
			this.elements[i].render(ctx);
			ctx.restore();
		}
		ctx.restore();
	},
	
	updateEndX: function(){
		this.endX = this.posX + this.elements.length*elementLength;
	},
	
	updateDiam: function(newDiam,elms){
		for(var i = 0, l = elms.length; i < l; i++){
			elms[i].changeDiam(newDiam);
		}
		
	}
	
	
};