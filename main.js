//window.onbeforeunload = function () {
  //window.scrollTo(0, 0);
//}

	
	var title = document.querySelector("#theTitle");
	var canvas0 = document.querySelector("#canvas0");
	var ctx0 = canvas0.getContext("2d");
	

	var width = canvas0.width; //main dimensions of the 'world' - canvas0 is the 'base layer' of the animation
	var height = canvas0.height;
	
	//create canvases that never appear onscreen or in the DOM but are used for layered rendering
	var canvas1 = document.createElement("canvas");
	canvas1.width = width;
	canvas1.height = height;
	var ctx1 = canvas1.getContext("2d");

	var canvas2 = document.createElement("canvas");
	canvas2.width = width;
	canvas2.height = height;
	var ctx2 = canvas2.getContext("2d");

	var canvas3 = document.createElement("canvas");
	canvas3.width = width;
	canvas3.height = height;
	var ctx3 = canvas3.getContext("2d");
	
	var controlPanel = document.getElementById("controls");
	controlPanel.addEventListener("input", doThing, false);
	
	var today = new Date();
	document.getElementById("status").innerHTML = today;
	
	function doThing(e){
		if (e.target !== e.currentTarget) {
			var inputSN = e.target.dataset.connectedto;
			var inputObject = Controls[inputSN];
			inputObject.applySliderValue(e.target.value);
		}
		e.stopPropagation();
	}


var viewport = document.getElementById("viewport");
var viewportW = viewport.clientWidth;
var viewportH = viewport.clientHeight;
viewport.pos = getPosition(viewport);

const default_velo = 0.00129; //ms^-1
const default_length = 100; //mm
const default_diam = 64; //mm
const default_area = Math.PI*Math.pow(default_diam,2); //mm^2
const default_t = 60000; // 'frames' per second

var Controls = [];
var Pumps = [];
var Valves = [];
var Sinks = [];
var Sources = [];
var Pipes = [];
var Tanks = [];


const rho = 1 // density of fluid, g/cm^3
const K = 2e9; //  bulk modulus of fluid, Pa
const timescale = 600; //how many frames are equivalent to 1 second?
var physicsSteps = 100; //how much to subdivide each frame for finer (more accurate?) calculations. 
var elementLength = 40; //mm 

const k = Math.pow(0.9981, (default_t/(timescale*physicsSteps))); 

while(timescale*physicsSteps*elementLength < 160000){ //Do not let timescale*physicsSteps*elementLength < 60000, oscillations become too nasty!
	physicsSteps *=2;
	elementLength += 2;
	console.log("eL = " + elementLength);
	console.log("pS = " + physicsSteps);

}


const pAtmo = 1e5; //atmospheric pressure, Pa

var thisNetwork = new Network();


var thisSource = new Source(64, elementLength, 0, elementLength, height/2);
thisSource.pressure = pAtmo;
thisSource.densityFromPressure(); 	


var inletValve = new Valve(64, 200, thisSource.posX + thisSource.length, 0.5*height, 0, elementLength);
var	thisPump = new Pump(64, 0, inletValve.posX + inletValve.length, height/2, elementLength);
var thisValve = new Valve(38, 200, thisPump.posX + thisPump.length, 0.5*height, 0, elementLength);
var thisPipe = new Pipe(38, 500, thisValve.endX, 0.5*height, elementLength, 0, 200);
var thisSink = new Sink(thisPipe.diam, elementLength, thisPipe.endX, thisPipe.posY);
var thisTank = new Tank(64, 30, 200, 0.80*height, elementLength, "TankyTankingtons");
var tankToPump1 = new Valve(64, 200, thisTank.posX + thisTank.length, thisTank.posY, 0, elementLength, "Tank to Pump1");
var tankToPump2 = new Valve(64, 100, 600, thisTank.posY, 0, elementLength, "Tank to Pump2");
var tankToPump3 = new Valve(64, 100, 800, thisTank.posY, 0, elementLength, "Tank to Pump3");

var tankSink = new Sink(38, elementLength, thisTank.end1.posX - elementLength, thisTank.posY);

	
	thisNetwork.install([thisPump, thisPipe,thisValve, thisSink, thisSource, inletValve, thisTank, tankToPump1, tankToPump2, tankToPump3, tankSink]);
	thisNetwork.connect([thisPump.end2, thisValve.end1], false);
	thisNetwork.connect([thisValve.end2, thisPipe.end1]);
	thisNetwork.connect([thisPipe.end2, thisSink], false);
	thisNetwork.connect([thisSource, inletValve.end1], true);
	thisNetwork.connect([inletValve.end2, thisPump.end1], false);
	thisNetwork.connect([thisTank.end2, tankToPump1.end1],false);
	thisNetwork.connect([tankToPump1.end2, thisPump.midPump],false);
	thisNetwork.connect([tankSink, thisTank.end1], false);



	
	

function drawWorld(){   ///main animation loop
	//console.log("=============")
	ctx0.fillStyle = "rgba(100,0,100,1)";
	ctx0.fillRect(0,0,width,height);
	
	for(var j = 0; j < physicsSteps; j++){
		tankToPump2.applySliderValue(tankToPump1.setting);
		tankToPump3.applySliderValue(1 - tankToPump1.setting);
		thisNetwork.update(timescale*physicsSteps);	
	}
	
	ctx1.clearRect(0,0,width,height);
	thisNetwork.render(ctx1);
	ctx0.drawImage(canvas1,0,0);
	requestAnimationFrame(drawWorld);
}
console.log("All good!");
drawWorld();