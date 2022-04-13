let cellPadCountX=8;
let cellPadCountY=8;
let cellCountX=73;
let cellCountY=73;
let canvasHeight=cellCountY*9;
let canvasWidth=cellCountX*12;

let cellWidth, cellHeight;

let cellData=[];

var padConnected=false;

var myPadIn;
var myPadOut;
var myPadOutChannel;
var myPianoOut;
var myPianoOutChannel;
var mySynthOut;
var mySynthOutChannel;

var lastX=-1;
var lastPadX=-1;
var lastY=-1;
var lastPadY=-1;
var lastMouseCellX=0;
var lastMouseCellY=0;
var lastChord=-1;
var lastChordNotes=[];
var lastPadChord=-1;
var lastPadChordNotes=[];
var lastPadNote=-1;

var lastNote=-1;
var lastNoteTime=-1;
var lastNoteTimeInterval=200;

var padChordOctave=2;
var padNoteOctave=2;


var noteArray=[];
var gridToNoteArray=[];
var majorScale=[1,0,1,0,1,1,0,1,0,1,0,1];
var minorScale=[1,0,1,1,0,1,0,1,1,0,1,0];
var lowestNote=24;

//var transposeChord=-24;
//var transposeNote=-24;

var firstTime=true;

function inKey(x) {
  let mx=x%12;
  return minorScale[mx];
}

function initalizeData() {
  var noteId;
  noteArray=[];
  for (i=lowestNote; i<127; i++) {
    noteId=(i-lowestNote) % 12;
    if (minorScale[noteId]==1) {
      noteArray.push(i);
      gridToNoteArray.push(i);
    } else {
      gridToNoteArray.push(0);
    }
  }
  for (i=0;i<cellCountX;i++) {
    if (firstTime) {
      cellData[i]=[];
    }
    for (j=0;j<cellCountY;j++) {
      cellData[i][j]=0;
    }  
  }
  firstTime=false;
}

initalizeData();

function getNoteFromX(x) {
  return x+lowestNote;
}

// Enable WebMidi.js and trigger the onEnabled() function when ready
WebMidi
  .enable()
  .then(onEnabled);
  //.catch(err => alert(err));

// Function triggered when WebMidi.js is ready
function onEnabled() {
  document.body.innerHTML+= "MIDI Enabled<br>";
// Display available MIDI input devices
  if (WebMidi.inputs.length < 1) {
    document.body.innerHTML+= "No device detected.";
  } else {
    myPadOut = WebMidi.getOutputByName("SmartPAD");
    
    if (myPadOut!=false) {
      myPadOutChannel = myPadOut.channels[1];
      padConnected=true;
    }

    myPianoOut = WebMidi.getOutputByName("IAC Driver Bus 1");
    myPianoOutChannel = myPianoOut.channels[1];
    mySynthOut = WebMidi.getOutputByName("IAC Driver Bus 1");
    mySynthOutChannel = myPianoOut.channels[2];

    if (padConnected) {
      myPadIn = WebMidi.getInputByName("SmartPAD");
      myPadIn.channels[1].addListener("noteon", e => {
        padOn(e.data[1]);
      });    
      myPadIn.channels[1].addListener("noteoff", e => {
        padOff(e.data[1]);
      });    
      myPadIn.channels[1].addListener("controlchange", e => {
        controlChange(e);
      });
    }
  };
}

// returns a zero through 7 for x and y
// essentially the notes of the scale
function determinePadXY(midiNote) {
  let y=7-Math.floor(midiNote/16);
  let x=midiNote%16;
  return {x:x,y:y};
}

function getNextNote(root,nextCnt) {
  if (root==0) {
    return gridToNoteArray[root];
  } else {
    var cnt=1;
    while (nextCnt>0) {
      if (gridToNoteArray[root+cnt]!=0) {
        nextCnt--;
      }
      cnt++;
    }
    return gridToNoteArray[root+cnt-1];
  }
}

// root is the number in the scale, not half steps 0=c 1=d 2=e 3=f, etc...
function chordOn(root,notes) {
  var aNote;
  var midiValue;
  var debugStr="";

  notes.forEach(element => {
    midiValue=getNextNote(root,element);
    debugStr+=midiValue+" ";
    aNote=Utilities.buildNote(midiValue);
    myPianoOutChannel.playNote(aNote);
  });

  textArea.value+="chord:"+root+"["+debugStr+"]\n";
  textArea.scrollTop = textArea.scrollHeight;
  lastChord=root;
  lastNotes=notes;
}

function chordOff(root,notes) {
  var aNote;
  var midiValue;
  
  notes.forEach(element => {
    midiValue=getNextNote(root,element);
    aNote=Utilities.buildNote(midiValue);
    myPianoOutChannel.stopNote(aNote);
  });
}

function padChordOn(root,notes) {
  var aNote;
  var midiValue;
  var debugStr="";

  root+=padChordOctave*12;
  console.log("r="+root);

  notes.forEach(element => {
    midiValue=getNextNote(root,element);
    debugStr+=midiValue+" ";
    aNote=Utilities.buildNote(midiValue);
    mySynthOutChannel.playNote(aNote);
  });

  textArea.value+="chord:"+root+"["+debugStr+"]\n";
  textArea.scrollTop = textArea.scrollHeight;
  lastPadChord=root;
  lastPadNotes=notes;
}

function padChordOff(root,notes) {
  var aNote;
  var midiValue;
  
  notes.forEach(element => {
    midiValue=getNextNote(root,element);
    aNote=Utilities.buildNote(midiValue);
    mySynthOutChannel.stopNote(aNote);
  });
}

// root is the number in the scale, not half steps 0=c 1=d 2=e 3=f, etc...
function noteOn(root) {

  var midiValue=gridToNoteArray[root];
  var debugStr="["+midiValue+"]";
  var aNote=Utilities.buildNote(midiValue);
  myPianoOutChannel.playNote(aNote, {duration: 10000});
  textArea.value+="note:"+root+" "+debugStr+"\n";
  textArea.scrollTop = textArea.scrollHeight;

  lastNote=root;
}

function noteOff(root) {
  var aNote=Utilities.buildNote(gridToNoteArray[root]);
  myPianoOutChannel.stopNote(aNote);
}


function padNoteOn(root) {
  root+=padNoteOctave*12;

  var midiValue=gridToNoteArray[root];
  var debugStr="["+midiValue+"]";
  var aNote=Utilities.buildNote(midiValue);
  if (lastPadNote != root) {
    padNoteOff(lastPadNote);
  }
  mySynthOutChannel.playNote(aNote, {duration: 10000});
  textArea.value+="note:"+root+" "+debugStr+"\n";
  textArea.scrollTop = textArea.scrollHeight;

  lastPadNote=root;
}

function padNoteOff(root) {
  if (root>=0) {
    var aNote=Utilities.buildNote(gridToNoteArray[root]);
    mySynthOutChannel.stopNote(aNote);
  }
}


// pass the midi note of x and y
function play(x,y) {
  if (x==lastX) {
    if (y==lastY) {
      //alert("chord: "+x);
      //chordOn(x,[0,2,4]);
    } else {
    //  alert("note: "+y);
      if (lastNote != -1) {
        noteOff(lastNote,[0,2,4]);
      }
      noteOn(y);
    }
  } else {
  //  alert("chord: "+x);
    if (lastChord != -1) {
      chordOff(lastChord,lastNotes);
    }
    chordOn(x,[0,2,4]);
  }
  lastX=x;
  lastY=y;
}

function padOn(midiNote) {
  var data=determinePadXY(midiNote);
  console.log(midiNote," - ",data.x,",",data.y);
  //cellData[data.x][data.y]=1;
  let aNote=Utilities.buildNote(midiNote);
  myPadOutChannel.playNote(aNote);
  //play(data.x,data.y);

  if (data.x!=lastPadX) {
    padChordOff(lastPadChord,lastPadChordNotes);
    padNoteOff(lastPadNote);
    padChordOn(noteArray[data.x],[0,2,4]);
  } else {
    padNoteOn(noteArray[data.y]);
  }
  lastPadX=data.x;
}

function controlChange(event) {
  console.log(event.data);
  // timing
  if (event.data[1]==7) {
    lastNoteTimeInterval=50+floor(event.data[2]/20)*50;
    console.log(lastNoteTimeInterval);
  }
  if (event.data[1]==0) {
    padChordOctave=floor(event.data[2]/21);
  }
  if (event.data[1]==1) {
    padNoteOctave=floor(event.data[2]/21);
  }

}

function padOff(midiNote) {
  var data=determinePadXY(midiNote);
  //cellData[data.x][data.y]=0;
  let aNote=Utilities.buildNote(midiNote);
  myPadOutChannel.stopNote(aNote);
  padChordOff(noteArray[data.x],[0,2,4]);
}

var textArea;
function setup() {
  textArea=document.getElementById("textArea");
  textArea.value='Inspired by a partial emulation by Tero Parviainen of Laurie Spiegels "Music Mouse - An Intelligent Instrument".';
  createCanvas(canvasWidth+400, canvasHeight+50).parent("canvasDiv");
  cellWidth=canvasWidth/cellCountX;
  cellHeight=canvasHeight/cellCountY;

  colorMode(HSB);
  gray = color(178);
  let h=0;
}

function drawCells() {
  for (let i=0; i < cellCountX; i++) {
    for (let j=0; j < cellCountY; j++) {
      if (cellData[i][j]==1) {
        fill(0);
      } else if (inKey(i)*inKey(j)==0) {
        fill(70);
      } else {
        fill(255);
      }
      rect(i*cellWidth,j*cellHeight,cellWidth,cellHeight);
    }  
  }
}

function mouseMoved() {
  if (millis()-lastNoteTime>lastNoteTimeInterval) {
    let i=floor(mouseX/cellWidth);
    let j=floor((canvasHeight-mouseY)/cellHeight);
    if ((i>=0) && (j>=0) && (i < cellCountX) && (j < cellCountY)) {
      if ((i!=lastMouseCellX)||(j!=lastMouseCellY)) {
        cellData[lastMouseCellX][lastMouseCellY]=0;
      }
      while (!inKey(i)) {
        i--;
      }
      while (!inKey(j)) {
        j--;
      }
      cellData[i][j]=1;
      lastMouseCellX=i;
      lastMouseCellY=j;
      play(i,j);
    }
    lastNoteTime=millis();
  }
}


function draw() {  
  background(220,0,100);
  text("Timing(ms):"+lastNoteTimeInterval,900,50);
  text("Pad Notes:"+padNoteOctave,900,250);
  text("Pad Chords:"+padChordOctave,900,150);
  translate(0,canvasHeight);
  scale(1,-1);
  drawCells();
  fill(0);
}
