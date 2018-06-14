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
					
					
					
					
					if(A.area == 0 || B.area == 0){
						
						this.velos[i][j] = 0;
						this.velos[j][i] = 0;
						A.peVelos.push(this.velos[i][j]);
						B.peVelos.push(this.velos[j][i]);
						
					
						
					} else {
					
						var workingArea = Math.min(A.area,B.area)/1e6;  //find size of interface between pipe elements, then convert to m^2
						var F = 1000*(deltaP)*workingArea;  //find net force in direction of B, Newtons
						
						
						
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