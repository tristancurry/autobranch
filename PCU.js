PCU = function(diam, length, targetPressure, upperFlowLimit, lowerFlowLimit, posX, posY, elementLength, id){
	this.oDiam = this.diam;
	this.targetPressure = targetPressure //Pa
	this.upperFlowLimit = upperFlowLimit; //Lpm
	this.lowerFlowLimit = lowerFlowLimit; //Lpm
	this.diam = this.oDiam;
	Pipe.call(this, this.diam, length, posX, posY, elementLength);
	this.id = id;
	if(id == null){this.id = "PCU" + PCUs.length;}
	this.label = this.id;
	var mid = Math.round(this.elements.length/2);
	this.elements[mid].label = this.label;
	
}

PCU.prototype = Object.create(Pipe.prototype);
PCU.constructor = PCU;

PCU.prototype.update = function(time_scale){
	Pipe.prototype.update.call(this, time_scale);
	
	//now for the code that reads the current flow and pressure and makes some decisions about what to do...
	var deltaP = this.end1.pressure - this.end2.pressure; 	//the pressure difference across the PCU. Note that this component has polarity to consider.
	//console.log(this.end1.voluFlow);
	if(deltaP != this.targetPressure){
		
		if(deltaP > this.targetPressure && this.diam < this.oDiam ){
			this.diam += this.diam/time_scale;
	
		} else if (deltaP < this.targetPressure && this.diam > 15){
			this.diam -= this.diam/time_scale;	
		}
			for(var i = 0, l = this.elements.length; i < l; i++){
			this.elements[i].changeDiam(this.diam);
		}
		
	}
}