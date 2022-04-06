var gamepads;
var selectedPad=0;

var soundOn=false;

let synth = new Tone.PolySynth();
synth.set({
  "envelope": {
    "attack": 0.8,
    "release": 0.4
  }
}).toDestination();

let droneSynth = new Tone.PolySynth();
droneSynth.set({
  "envelope": {
    "attack": 0.8,
    "release": 0.4
  }
});

var phaser = new Tone.Phaser({
	"frequency" : 15,
	"octaves" : 5,
	"baseFrequency" : 1000
}).toDestination();

droneSynth.connect(phaser);

//Drone
let dl = new Tone.Loop(droneLoop, "8n");

function droneLoop(time) {
  droneSynth.triggerAttackRelease("A1", "8n", time);
}

//Melody
let ml = new Tone.Loop(melodyLoop, "8n");

let major = [0, 2, 4, 5, 7, 9, 11, 12];
let minor = [0, 2, 3, 5, 7, 9, 10, 12];

let root = 21; // lowest A in MIDI
let octave = 3;
let myScale = major; // try minor and other modes

var probability = 0.8;
function melodyLoop(time) {
  if (random() < probability) { //stay silent sometimes
    let pos = floor(random(0, myScale.length));
    let note = root + myScale[pos] + octave * 12;
    let noteObject = Tone.Frequency(note, "midi");
    synth.triggerAttackRelease(noteObject, "8n", time);
  }
}

// Start
function mouseClicked() {
  if (Tone.context.state !== 'running') {
    Tone.context.resume();
  }
  if (!soundOn) {
    Tone.Transport.start();
    dl.start();
    ml.start();
    soundOn=true;

  } else {
    dl.stop();
    ml.stop();  
    soundOn=false;
  }
}

function setup() {
  createCanvas(400, 400);
}

function n(a) {
  a=round(a*1000);
  a=a/1000;
  return a;
}

function button(i) {
  return gamepads[0].buttons[i].value;
}

var lastTimeStamp=-1;
function wheel() {
  var res=0;
  if (lastTimeStamp>0) {
    res=gamepads[0].axes[5]*(gamepads[0].timestamp-lastTimeStamp);
  }
  lastTimeStamp=gamepads[0].timestamp;
  return res;
}

function joystick() {
  return gamepads[0].axes[9];
}

var esize=100;
function draw() {
  gamepads=navigator.getGamepads()
  background(220);
  fill(20);
  ellipse(200,200,esize,esize);

  if (gamepads[0] != null) {
    esize=esize+wheel()*1;
    console.log(esize);
  }
}
