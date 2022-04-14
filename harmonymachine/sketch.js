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

var totalBeats=0;

// https://coolors.co/palette/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
var palColors=["#001219","#005f73","#0a9396","#94d2bd","#e9d8a6","#ee9b00","#ca6702","#bb3e03","#ae2012","#9b2226"];


var channel1,channel2;

setupMidi(midiStarted);

function midiStarted() {
  var inMidiDevice=getMidiInputDevice("Key");
  console.log("Found device:",inMidiDevice);
  WebMidi.inputs[inMidiDevice].addListener("noteon", e => {
    notePressed(e.data[1]);
  });
  WebMidi.inputs[inMidiDevice].addListener("noteoff", e => {
    noteReleased(e.data[1]);
  });
  var midiOut = WebMidi.getOutputByName("IAC Driver Bus 1");
  channel1 = midiOut.channels[1];
  channel2 = midiOut.channels[2];
  channel10 = midiOut.channels[10];
}

var notesDown=[];
var aNotesDown=[];

function  getNoteInScale(m) {
  var noteInScale=-1;
  let temp=m%12;
  let rtemp=root%12;
  if (temp<rtemp) {
    temp=(temp+12)-rtemp;
  } else {
    temp=temp-rtemp;
  }
  noteInScale=selectedScale.indexOf(temp);
  console.log("Root=",root,"NOTE In SCALE=",noteInScale);
  return noteInScale;
}

function notePressed(m) {
  notesDown.push(m);
  let aNote=Utilities.buildNote(m);
  channel1.sendNoteOn(aNote);
}

function noteReleased(m) {
  let i = notesDown.indexOf(m);
  notesDown.splice(i,1);
  let aNote=Utilities.buildNote(m);
  channel1.sendNoteOff(aNote);
}


let major = [0, 2, 4, 5, 7, 9, 11, 12];
let notmajor = [1,3,6,8,10];
let minor = [0, 2, 3, 5, 7, 9, 10, 12];

let selectedScale=major;

let whitekeys=[];
let blackkeys=[];

let accompany=[];
let accompanyBeats=0;

let root = 21; // lowest A in MIDI
let octave = 3;
let myScale = major; // try minor and other modes

// Start
function mouseClicked() {
  if (!soundOn) {
    Tone.start();
    Tone.Transport.start();
    soundOn=true;
  }
  // If mouse is inside the grid
  if ((mouseX > gridx) && (mouseY>gridy) && (mouseX < (gridx+cellsWide*cellsize)) && (mouseY < (gridy + cellsHigh*cellsize))) {
    let cellX = floor((mouseX - gridx)/cellsize);
    let cellY = floor((mouseY - gridy)/cellsize);
    cells[cellX][cellY]=(cells[cellX][cellY]+1)%3;
  }

}

var bpmSlider;
var accompanyInput;
var lastAccompanyBeat=-1;
var lastBpm;
var millsPerBeat=0;
var startBtn;
var octaveSelect;

const loopA = new Tone.Loop(runRhythm, "4n").start();

var drums=[36,44,38,39,40,50,42,46];
function runRhythm(time) {
  let currentBeat=totalBeats % 8;
  let accBeat=totalBeats % accompanyBeats;
  if (accBeat != lastAccompanyBeat) {
    let inx = accompany.indexOf(accBeat);
    if (inx > -1) {
      playAccompany(accompanyDurs[inx]);
    }
  }

  let dt=time*1000-WebMidi.time;
  //console.log(dt);

  let dtstr="";
  if (dt < 0) {
    dt=0;
  } 
  dtstr="+"+String(dt);

  if (cells[currentBeat][0]==1) {
    let aNote=Utilities.buildNote(drums[0]);
    channel10.playNote(aNote,{time: dtstr});
  }
  if (cells[currentBeat][0]==2) {
    let aNote=Utilities.buildNote(drums[1]);
    channel10.playNote(aNote,{time: dtstr});
  }
  if (cells[currentBeat][1]==1) {
    let aNote=Utilities.buildNote(drums[2]);
    channel10.playNote(aNote,{time: dtstr});
  }
  if (cells[currentBeat][1]==2) {
    let aNote=Utilities.buildNote(drums[3]);
    channel10.playNote(aNote,{time: dtstr});
  }
  if (cells[currentBeat][2]==1) {
    let aNote=Utilities.buildNote(drums[4]);
    channel10.playNote(aNote,{time: dtstr});
  }
  if (cells[currentBeat][2]==2) {
    let aNote=Utilities.buildNote(drums[5]);
    channel10.playNote(aNote,{time: dtstr});
  }
  if (cells[currentBeat][3]==1) {
    let aNote=Utilities.buildNote(drums[6]);
    channel10.playNote(aNote,{time: dtstr});
  }
  if (cells[currentBeat][3]==2) {
    let aNote=Utilities.buildNote(drums[7]);
    channel10.playNote(aNote,{time: dtstr});
  }
  totalBeats++;
}

let lastNote=200;
function playAccompany(dur) {
  // find lowest note
  let lowNote=200;
  for (let i=0; i < notesDown.length; i++) {
    if ((notesDown[i]) < lowNote) {
      lowNote=notesDown[i];
    }
  }
  if (lowNote == 200) {
    lowNote=lastNote;
  }
  if (lowNote != 200) {
    console.log("Accompany "+String(lowNote)+" dur="+String(dur*millisPerBeat));
    let nIndex=getNoteInScale(lowNote);
    aNotesDown=[];
    if (nIndex != -1) {
      console.log(lowNote);
      console.log(nIndex);
      console.log(root);
      console.log(selectedScale);
      console.log("NOTE TO BUILD:",(root+selectedScale[nIndex]));
      let aNote=Utilities.buildNote(root+selectedScale[nIndex]);
      aNotesDown.push(root+selectedScale[nIndex]);
      channel2.playNote(aNote,{duration: dur*millisPerBeat-100});
      aNote=Utilities.buildNote(root+selectedScale[(nIndex+2)%7]);
      aNotesDown.push(root+selectedScale[(nIndex+2)%7]);
      channel2.playNote(aNote,{duration: dur*millisPerBeat-100});
      aNote=Utilities.buildNote(root+selectedScale[(nIndex+4)%7]);
      aNotesDown.push(root+selectedScale[(nIndex+4)%7]);
      channel2.playNote(aNote,{duration: dur*millisPerBeat-100})
    }
  }
  lastNote=lowNote;
}

function setup() {
  createCanvas(sw, sh);
  startBtn = createButton("Start");
  startBtn.position(100,580);
  startBtn.mousePressed(pressStartBtn);
  bpmSlider = createSlider(30,300,60);
  bpmSlider.position(gridx,60);

  octaveSelect = createSelect();
  octaveSelect.position(260,250);
  octaveSelect.option('1');
  octaveSelect.option('2');
  octaveSelect.option('3');
  octaveSelect.option('4');
  octaveSelect.option('5');
  octaveSelect.option('6');
  octaveSelect.option('7');
  octaveSelect.option('8');
  octaveSelect.selected('3');
  octaveSelect.changed(keyChanged);

  keySelect = createSelect();
  keySelect.position(100,250);
  keySelect.option('C Major');
  keySelect.option('C Minor');
  keySelect.option('G Major');
  keySelect.option('G Minor');
  keySelect.option('D Major');
  keySelect.option('D Minor');
  keySelect.option('A Major');
  keySelect.option('A Minor');
  keySelect.option('E Major');
  keySelect.option('E Minor');
  keySelect.option('B Major');
  keySelect.option('B Minor');
  keySelect.option('F Major');
  keySelect.option('F Minor');
  keySelect.selected('C Major');
  keySelect.changed(keyChanged);
  keyChanged();

  text('Accompaniment Rhythm (i.e. 4 4 2 2)', 100, 160);
  accompanyInput = createInput();
  accompanyInput.position(100,200);
  accompanyBtn = createButton("Change");
  accompanyBtn.position(260,200);
  accompanyBtn.mousePressed(changeAccompany);

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

function keyChanged() {
  let octave=int(octaveSelect.value());
  switch (keySelect.value()) {
    case "C Major":
      root=octave*12;
      selectedScale=major;
      break;
    case "C Minor":
      root=octave*12;
      selectedScale=minor;
      break;
    case "D Major":
      root=2+octave*12;
      selectedScale=major;
      break;
    case "D Minor":
      root=2+octave*12;
      selectedScale=minor;
      break;
    case "E Major":
      root=4+octave*12;
      selectedScale=major;
      break;
    case "E Minor":
      root=4+octave*12;
      selectedScale=minor;
      break;
    case "F Major":
      root=5+octave*12;
      selectedScale=major;
      break;
    case "F Minor":
      root=5+octave*12;
      selectedScale=minor;
      break;
    case "G Major":
      root=7+octave*12;
      selectedScale=major;
      break;
    case "G Minor":
      root=7+octave*12;
      selectedScale=minor;
      break;
    case "A Major":
      root=9+octave*12;
      selectedScale=major;
      break;
    case "A Minor":
      root=9+octave*12;
      selectedScale=minor;
      break;
    case "B Major":
      root=11+octave*12;
      selectedScale=major;
      break;
    case "B Minor":
      root=11+octave*12;
      selectedScale=minor;
      break;                                   
    default:
      //
  }
}

function changeAccompany() {
  var temp=accompanyInput.value();
  temp=temp.trim()
  var strArray=temp.split(" ");
  accompany=[];
  accompanyBeats=0;
  accompanyDurs=[];
  // We are going to save the starting beat for accompany changes
  for (let i=0; i<strArray.length; i++) {
    let n=int(strArray[i]);
    if (Number.isInteger(n)) {
      accompany.push(accompanyBeats);
      accompanyDurs.push(n);
      accompanyBeats+=n;
    }
  }
  console.log(accompany);
  console.log(accompanyBeats);
}
function pressStartBtn() {
  startBtn.label="Stop";

  if (!soundOn) {
    Tone.Transport.start();
    soundOn=true;
  }
}


function drawPiano(selectedNotes1,selectedNotes2) {
  fill(255);
  stroke(2);

  for (let ip=0; ip < 49; ip++) {
    if (selectedNotes1.includes(whitekeys[ip])) {
      fill(palColors[2]);
    } else if (selectedNotes2.includes(whitekeys[ip])) {
        fill(palColors[4]);
    } else {
      fill(255);
    }
    rect(pianoX+(ip*18),pianoY,18,150);
  }

  bcnt=0;
  for (let ip=0; ip < 48; ip++) {
    let n=(ip % 7);
    if ((n==0) || (n==1) || (n==3) || (n==4) || (n==5)) {
      if (selectedNotes1.includes(blackkeys[bcnt])) {
        fill(palColors[2]);
      } else if (selectedNotes2.includes(blackkeys[bcnt])) {
        fill(palColors[4]);
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
  textSize(14);
  if (bpmSlider.value() != lastBpm) {
    lastBpm=bpmSlider.value();
    Tone.Transport.bpm.value=lastBpm;
    millisPerBeat=(60000/lastBpm);
  }
  text('BPM '+String(bpmSlider.value()), gridx, 50);
  text('Accompaniment Rhythm (i.e. 4 4 2 2)', 100, 185);
  text('Octave:', 200, 264);


  fill(255);
  stroke(2);
  for (ix=0; ix < cellsWide; ix++) {
    for (iy=0; iy < cellsHigh; iy++) {
      if (cells[ix][iy]==1) {
        fill(palColors[7]);
      } else if (cells[ix][iy]==2) {
        fill(palColors[6]);
      } else {
        fill(200);
      }
      rect(gridx+(ix*cellsize),gridy+(iy*cellsize),cellsize,cellsize);
    }
  }
  drawPiano(notesDown,aNotesDown);
}
