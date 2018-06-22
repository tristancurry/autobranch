var PipeElement = function(diam, length, posX, posY, posZ) {
    this.diam = diam;
	this.length = length; //mm
	this.posX = posX;
	this.posY = posY;
	this.posZ = posZ;    //mm
	if(posZ == null){
		this.posZ = 0;
	}
	this.area = (Math.PI*diam*diam*0.25);
	this.volume = this.area*this.length; //mm^3
	this.mass = this.volume*this.density/1000; //cross-sectional area * length * density in g/mm^3
	this.oMass = this.mass;
	this.size = this.length/displayScale;
	this.peVelos = [];
	this.connectedInterfaces = [];
	this.velo = 0;
	this.voluFlow = 0;

    return this;
};




PipeElement.prototype = {
    diam: 64, //mm
	length: 1, //mm
	area: 1, //mm^2
	volume: 1, //cm^3
	mass: 1, //g
	pressure: 0, // pressure, Pa
	density: 1, //g/cm^3
	massFlow: 0, //g, positive is IN
	isPump: false,
	isSink: false,
	//RENDERING VARIABLES
	posX: 0,
	posY: 0,
	label: "",
	colour: "rgba(0, 0, 0, 1)",
	size: 20,  //size for rendering will depend on how many elements there are, and aesthetic considerations!


	changeDiam: function(newDiam){
		this.diam = newDiam;
		this.area = (Math.PI*this.diam*this.diam*0.25);
		this.volume = this.area*this.length; //mm^3
		this.mass = this.volume*this.density/1000;
		if(this.diam <= 0){this.pressure = 0;}
		//this.density = 1000*this.mass/this.volume //cross-sectional area * length * density in g/mm^3;
	},
	
	
	densityFromPressure: function() {
		
		this.density = rho/(1 - (this.pressure - pAtmo)/K);
		this.mass = this.density*this.volume/1000;
	},
	
	resetMassFlows: function(){
		this.massFlow = 0;
		this.peVelos = [];
	},
	
	update: function() {
		this.mass = this.mass + this.massFlow;


		if(this.isBorderedByAir && this.mass < this.oMass){
			if(this.mass <= 0){
				this.mass = 0;
				this.airContent = 1;
				this.isSink = true;
			}
			this.airContent = 1 - this.mass/this.oMass;
			this.volume = (1 - this.airContent)*this.volume;
			
			
		} else {
			var oldDensity = this.density;
			if(this.mass !=0){this.density = this.mass/(this.volume/1000)};
			var oldPressure = this.pressure;
			this.pressure = K*(1 - (oldDensity/this.density)) + oldPressure;
			if(this.pressure < 0){
				this.pressure = 0;
				this.densityFromPressure();
			}
		}
		this.velo = this.findVelo();
		this.voluFlow = this.velo*60*(this.area)/1000;
		this.colour = "hsla(200, 100%, " + 100*(this.pressure - 100000)/1900000 +"%, 1)" //pressure range between 2550000 and 0

	},
	
	findVelo: function(){
		var avg = 0;
		for(var i = 0, l = this.peVelos.length; i < l; i++){
			avg += this.peVelos[i]/l;
		}
		return avg;
		
			
	},

	
	
	render: function(ctx) {
        ctx.fillStyle= this.colour;
		ctx.strokeStyle = "rgba(255,255,255,0.4)";
		ctx.lineWidth = 1;
		ctx.fillStyle= this.colour;
		ctx.beginPath();
		ctx.save();
		ctx.translate(this.posX - 0.5*this.size, this.posY - 0.5*this.diam);
		ctx.rect(0,0, this.size, this.diam);
				ctx.fill();
		ctx.fillStyle = "rgba(255,50,50," + 100*this.airContent + "%)";
		ctx.rect(0,0, this.size, this.diam);
				ctx.fill();
		ctx.fillStyle = this.colour;

		ctx.restore();
		ctx.font="9px Arial";
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillText(this.label, this.posX - 0.5*this.size, this.posY - 120);
		ctx.fillText("p: " + Math.round(this.pressure/1000) + "kPa", this.posX - 0.5*this.size, this.posY - 100);
		ctx.fillText("mass: " + Math.round(this.mass)+ "g", this.posX - 0.5*this.size, this.posY - 80);
		ctx.fillText("q: " + Math.round(this.voluFlow)+ "L/m", this.posX - 0.5*this.size, this.posY - 60);
		ctx.fillText("v: " + this.velo.toFixed(2) + "m/s", this.posX - 0.5*this.size, this.posY - 40);


	}
	
};