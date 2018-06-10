var Network = function() {
	this.components = []; //list of every major component in the network (does not include subcomponents, like the PipeElements comprising an added Pipe
	this.interfaces = []; //this one is a list of EVERY Interface in the network, including those within components
	this.netInterfaces = []; //this one is for storing only the Interfaces that exist BETWEEN major components
}

Network.prototype = {
	install: function(comps){
			this.components = this.components.concat(comps); //add these components to the Network's component list
		for(var i = 0, l = comps.length; i < l; i++){
				if(comps[i].interfaces != null){
			this.interfaces = this.interfaces.concat(comps[i].interfaces); //add this component's interfaces to the Network's list, if they exist.
			}
		} 
	},
	
	connect: function(comps){ //would be good to check if the components are already in the Network before hooking them up.
		var intfc = new Interface(comps); //would also be good to check to see if they're already hooked up!
		this.interfaces.push(intfc);
		this.netInterfaces.push(intfc);
		
	},
	
	update: function(time_scale){ 
		for(var i = 0, l = this.components.length; i < l; i++){
			this.components[i].resetMassFlows();
		}
		for(var i = 0, l = this.interfaces.length; i < l; i++){
			this.interfaces[i].calculateMassFlows(time_scale);
		}
		for(var i = 0, l = this.components.length; i < l; i++){
			this.components[i].update(time_scale);
		}
	},
	
	render: function(ctx){
		for(var i = 0, l = this.components.length; i < l; i++){
			this.components[i].render(ctx);
		}		
	}
	
}
