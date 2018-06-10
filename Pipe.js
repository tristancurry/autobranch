var Pipe = function(diam, length, posX, posY, elementLength, id) {
	this.diam = diam; 		//mm
	this.length = length; 	//mm
	this.posX = posX;
	this.posY = posY; //starting position of pipe
	this.elements = [];
	this.interfaces = [];
	this.id = id;
	if(id == null){this.id = "pipe" + Pipes.length}
	this.label = this.id;
	
	var N = Math.round(length/(elementLength));
	
	for (var i = 0; i < N; i++){
		var X;
		if(i == 0){X = this.posX+ 100;} else {X = this.elements[i - 1].posX + this.elements[i - 1].size}
		var p = new PipeElement(this.diam, elementLength, X, this.posY); //create a pipe's worth of elements
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
		}
	},
	render: function(ctx){
		for(var i = 0, l = this.elements.length; i < l; i++){
			this.elements[i].render(ctx);
		}
	},
	
	updateEndX: function(){
		var N = this.elements.length;
		this.endX = this.elements[N-1].posX + this.elements[N-1].size;
	},
	
	updateDiam: function(newDiam,elms){
		for(var i = 0, l = elms.length; i < l; i++){
			elms[i].changeDiam(newDiam);
		}
		
	}
	
	
};