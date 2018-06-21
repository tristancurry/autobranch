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
					if(A.airContent == 1 && B.airContent < 1){B.isBorderedByAir = true;}
					if(B.airContent == 1 && A.airContent < 1){A.isBorderedByAir = true;}
					
					var deltaP = A.pressure - B.pressure;
					//adjustment for relative heights...
					var weight = 0;
					var deltaZ = A.posZ - B.posZ;
					if(deltaZ < 0){
						//force is based on B's mass and diam
						if(deltaZ < -1*B.diam){deltaZ = -1*B.diam}
						weight = B.mass*g*Math.sin(0.5*Math.PI*(deltaZ/B.diam));
					} else if(deltaZ > 0){
						if(deltaZ > A.diam){deltaZ = A.diam}
						//force is based on A's mass and diam
						weight = A.mass*g*Math.sin(0.5*Math.PI*(deltaZ/A.diam));
					}
					
					
					
					if(A.area == 0 || B.area == 0){
						
						this.velos[i][j] = 0;
						this.velos[j][i] = 0;
						A.peVelos.push(this.velos[i][j]);
						B.peVelos.push(this.velos[j][i]);
						
					
						
					} else {
					
						var workingArea = Math.min(A.area,B.area)/1e6;  //find size of interface between pipe elements, then convert to m^2
						var F = 1000*(deltaP)*workingArea;  //find net force in direction of B, Newtons
						//console.log("deltaP = " + deltaP);
						//console.log("F before = " + F);
						F += weight;
						//console.log("F after = " + F);
						
						
							if(A.mass > 0){
								var aA = (F/A.mass)/time_scale; //resultant acceleration of fluid in ms^-2
							} else {var aA = (F/B.mass)/time_scale;}
							//} else {var aA = 0;}
							if(B.mass > 0){
								var aB = (F/B.mass)/time_scale; //resultant acceleration of fluid in ms^-2
							} else { var aB = (F/A.mass)/time_scale; }
							//} else {var aB = 0;}
					
				
							var veloAtoB = k*this.velos[i][j] + aA;
							var veloBfromA = k*this.velos[j][i] + aB;
			
							if(this.isOneWay){
								if(veloAtoB < 0){veloAtoB = 0;}
								if(veloBfromA < 0){veloBfromA = 0;}
								//if(veloAtoB < 0){veloAtoB = (1/time_scale)*Math.round(0.9*time_scale*veloAtoB);}
								//if(veloBfromA < 0){veloBfromA = (1/time_scale)*Math.round(0.9*time_scale*veloBfromA);}
							} 

							if(A.airContent == 1 && veloAtoB > 0){
								veloAtoB = 0;
								veloBfromA = 0;
							}
							
							if(B.airContent == 1 && veloBfromA < 0){
								veloAtoB = 0;
								veloBfromA = 0;
							}
			
			
							if(A.isSink){
								A.massFlow -= (10*veloAtoB/time_scale)*(B.area/1000)*A.density; //10*v to put in cms^-1, area/1000 to put into cm^2, as density ia g/cm^3
							} else {
								A.massFlow -= (10*veloAtoB/time_scale)*(A.area/1000)*A.density;  //g of mass flow during time interval
							}
							if(B.isSink){
								B.massFlow += (10*veloBfromA/time_scale)*(A.area/1000)*B.density;
							} else {
								B.massFlow += (10*veloBfromA/time_scale)*(B.area/1000)*B.density;
							}
	
						
						
						
							this.velos[i][j] = veloAtoB;
							this.velos[j][i] = veloBfromA;
						
							A.peVelos.push(this.velos[i][j]);
							B.peVelos.push(this.velos[j][i]);
						
					}

				}
			}
		}
	}
}