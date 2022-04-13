var gamepads;
var selectedPad=0;

var soundOn=false;

var sw=1000;
var sh=800;

var gridx=450;
var gridy=100;
var pianoX=50;
var pianoY=400;
var cellsWide=8;
var cellsHigh=4;
var cellsize=60;
var cells=[];


// https://coolors.co/palette/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
var palColors=["#001219","#005f73","#0a9396","#94d2bd","#e9d8a6","#ee9b00","#ca6702","#bb3e03","#ae2012","#9b2226"];



setupMidi(midiStarted);

function midiStarted() {

}

//Melody
let ml = new Tone.Loop(melodyLoop, "4n");

function melodyLoop(time) {

}

let major = [0, 2, 4, 5, 7, 9, 11, 12];
let notmajor = [1,3,6,8,10];
let minor = [0, 2, 3, 5, 7, 9, 10, 12];

let whitekeys=[];
let blackkeys=[];

let root = 21; // lowest A in MIDI
let octave = 3;
let myScale = major; // try minor and other modes

// Start
function mouseClicked() {
  if (!soundOn) {
    Tone.Transport.start();
    soundOn=true;
  }
  // If mouse is inside the grid
  if ((mouseX > gridx) && (mouseY>gridy) && (mouseX < (gridx+cellsWide*cellsize)) && (mouseY < (gridy + cellsHigh*cellsize))) {
    let cellX = floor((mouseX - gridx)/cellsize);
    let cellY = floor((mouseY - gridy)/cellsize);
    cells[cellX][cellY]=!cells[cellX][cellY];
  }

}

function setup() {
  createCanvas(sw, sh);
  for (ix=0; ix < cellsWide; ix++) {
    cells[ix]=[];
    for (iy=0; iy < cellsHigh; iy++) {
      cells[ix][iy]=0;
    }
  }
  for (let j=0; j <8; j++) {
    for (let i=0; i < 7; i++) {
      whitekeys.push(24+j*12+major[i]);
    }
  }
  for (let j=0; j <8; j++) {
    for (let i=0; i < 5; i++) {
      blackkeys.push(24+j*12+notmajor[i]);
    }
  }
}


function drawPiano(selectedNotes) {
  fill(255);
  stroke(2);

  for (let ip=0; ip < 49; ip++) {
    if (selectedNotes.includes(whitekeys[ip])) {
      fill(palColors[2]);
    } else {
      fill(255);
    }
    rect(pianoX+(ip*18),pianoY,18,150);
  }

  bcnt=0;
  for (let ip=0; ip < 48; ip++) {
    let n=(ip % 7);
    if ((n==0) || (n==1) || (n==3) || (n==4) || (n==5)) {
      if (selectedNotes.includes(blackkeys[bcnt])) {
        fill(palColors[2]);
      } else {
        fill(0);
      }      
      rect(pianoX+(ip*18)+14,pianoY,12,80);
      bcnt++;
    }
  }
}

function draw() {
  background(220);
  fill(255);
  stroke(2);
  for (ix=0; ix < cellsWide; ix++) {
    for (iy=0; iy < cellsHigh; iy++) {
      if (cells[ix][iy]==1) {
        fill(palColors[7]);
      } else {
        fill(200);
      }
      rect(gridx+(ix*cellsize),gridy+(iy*cellsize),cellsize,cellsize);
    }
  }
  drawPiano([]);
}
