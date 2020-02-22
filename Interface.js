var Interface = function(elms, isOneWay){
	this.elements = elms;
	this.velos = [];
	if(isOneWay === true){
		this.isOneWay = true;
	} else {
		this.isOneWay = false;
	}

	this.buildVelos();
	for(var i = 0, l = this.elements.length; i < l; i++){
		this.elements[i].connectedInterfaces.push(this);
	}

}

Interface.prototype = {
	buildVelos: function(){ //build an NxN matrix to contain speeds across each pair of elements
		this.velos = [];
		for(var i = 0; i < this.elements.length; i++){
			var sub = [];
			for(var j = 0; j < this.elements.length; j++){
				sub.push(0);
			}
			this.velos.push(sub);
		}
	},


	calculateMassFlows: function(time_scale){
		if(this.elements.length > 0){
			for(var i = 0, l = this.elements.length; i < l - 1; i++){
				for(var j = i + 1; j < l; j++){
					var A = this.elements[i];
					var B = this.elements[j];


					var deltaP = A.pressure - B.pressure;
					//adjustment for relative heights...
					var weight = 0;
					var deltaZ = A.posZ - B.posZ;
					if(deltaZ < 0){
						//if B is higher than A, gravitational force is based on B's mass and length
						if(deltaZ < -1*B.length){deltaZ = -1*B.length}
						weight = B.mass*g*Math.sin(0.5*Math.PI*(deltaZ/B.length));
					} else if(deltaZ > 0){
						if(deltaZ > A.length){deltaZ = A.length}
						//If A is higher than B, gravitational force is based on A's mass and length
						weight = A.mass*g*Math.sin(0.5*Math.PI*(deltaZ/A.length));
					}

					//if there's no contact area between the two elements, then shut down all flow between those elements
					if(A.area == 0 || B.area == 0){
						this.velos[i][j] = 0;
						this.velos[j][i] = 0;
						A.peVelos.push(this.velos[i][j]);
						B.peVelos.push(this.velos[j][i]);
					} else {
						var workingArea = Math.min(A.area,B.area)/1e6;  //find size of interface between pipe elements, then convert to m^2
						var F = 1000*(deltaP)*workingArea;  //find net force in direction of B, Newtons
						F += weight; //add any effects of elevation from before to the pressure-derived force
						// instead of calculating A from F/m, calculate delta-momentum from F*delta-t?
						if(A.mass > 0){
							var aA = (F/A.mass)/time_scale; //resultant acceleration of fluid in ms^-2
						} else {var aA = (F/B.mass)/time_scale;}
						//} else {var aA = 0;}
						if(B.mass > 0){
							var aB = (F/B.mass)/time_scale; //resultant acceleration of fluid in ms^-2
						} else { var aB = (F/A.mass)/time_scale; }
						//} else {var aB = 0;}

						//apply accelerations and also scale the existing velocity by a 'friction factor' k. This is currently a bit unphysical, with the value of k universal, and tuned to yield moderately realistic and stable results.
						var veloAtoB = k*this.velos[i][j] + aA;
						var veloBfromA = k*this.velos[j][i] + aB;

						//if velocities get too high, constrain them. Again, unphysical but really there to stop absurb flows between timesteps
						if(Math.abs(veloAtoB) > 300){veloAtoB = 300*Math.sign(veloAtoB);}
						if(Math.abs(veloBfromA) > 300){veloBfromA = 300*Math.sign(veloBfromA);}

						if(this.isOneWay){
							if(veloAtoB < 0){veloAtoB = 0;}
							if(veloBfromA < 0){veloBfromA = 0;}
							//if(veloAtoB < 0){veloAtoB = 0.01*veloAtoB;}
							//if(veloBfromA < 0){veloBfromA = 0.01*veloBfromA;}
						}

						//rubble from attempt at introducing air into system from open ends e.g. sinks or vents
						if(A.airContent == 1 && veloAtoB > 0){
							veloAtoB = 0;
							veloBfromA = 0;
						}

						if(B.airContent == 1 && veloBfromA < 0){
							veloAtoB = 0;
							veloBfromA = 0;
						}

						if(A.isSink){
							A.massFlow -= (veloAtoB/time_scale)*(B.area/1000)*A.density; //10*v to put in cms^-1, area/1000 to put into cm^2, as density ia g/cm^3
						} else {
							A.massFlow -= (veloAtoB/time_scale)*(A.area/1000)*A.density;  //g of mass flow during time interval
						}
						if(B.isSink){
							B.massFlow += (veloBfromA/time_scale)*(A.area/1000)*B.density;
						} else {
							B.massFlow += (veloBfromA/time_scale)*(B.area/1000)*B.density;
						}

						//store the element-element velocities in appropriate spots in a matrix encapsulating all flows through the interface (may be several elements connected through the same interface)
						this.velos[i][j] = veloAtoB;
						this.velos[j][i] = veloBfromA;

						//push the velocity to an array belonging to the pipeElement, for coming up with a value for volumetric flow
						A.peVelos.push(this.velos[i][j]);
						B.peVelos.push(this.velos[j][i]);
					}
				}
			}
		}
	}
}
