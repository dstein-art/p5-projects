var c1,c2;

var aSlider,dSlider,sSlider,rSlider,lfoSlider,wSlider;

var loaded=false;
var fileLoaded="";

var started=false;

var wavWidth=0.0058046875;

const cRatio=0.7606;

var aStart=0.4;
var dStart=0.4;
var sStart=0.8;
var rStart=0.4;
var lfoStart=0.02;

var ampEnv;

var wavs = new Tone.Player("assets/wavs/"+wavelist[13],() => {  
});

let analyzer = new Tone.Waveform(256);
let lfoAnalyzer = new Tone.Waveform(256);

lfo = new Tone.LFO("32n", -1, 1);
lfo.connect(lfoAnalyzer);

Tone.loaded().then(function(){
});

function setup() {
  c1= createCanvas(900, 600);
  ampEnv = new Tone.AmplitudeEnvelope({
    "attack": aStart,
    "decay": dStart,
    "sustain": sStart,
    "release": rStart
  }).toDestination();
  ampEnv.releaseCurve = "linear";
  

  textSize(14);
  fill(0);
  text('Select Wavetable:', 20, 330);
  wavselect=createSelect();
  wavselect.position(20,340);
  for (i=0; i < wavelist.length; i++) {
    wavselect.option("-- select wav --");
    wavselect.option(wavelist[i]);
  }
  wavselect.selected("SINE2SAW.WAV");
  wavselect.changed(wavSelected);

  btnNextWav=createButton("Next Wav");
  btnNextWav.position(200,340);
  btnNextWav.mousePressed(nextWav);

  btnNextWav=createButton("Start Synth");
  btnNextWav.position(200,540);
  btnNextWav.mousePressed(startTone);

  text('Attack:', 310, 330);
  aSlider = createSlider(0, 99, aStart*100);
  aSlider.position(310, 340);
  aSlider.addClass("mySliders");
  aSlider.changed(adsrChanged)

  text('Decay:', 310, 390);
  dSlider = createSlider(0, 99, dStart*100);
  dSlider.position(310, 400);
  dSlider.addClass("mySliders");
  dSlider.changed(adsrChanged)

  text('Sustain:', 510, 330);
  sSlider = createSlider(0, 99, sStart*100);
  sSlider.position(510, 340);
  sSlider.addClass("mySliders");
  sSlider.changed(adsrChanged)

  text('Release:', 510, 390);
  rSlider = createSlider(0, 99, rStart*100);
  rSlider.position(510, 400);
  rSlider.addClass("mySliders");
  rSlider.changed(adsrChanged)

  text('LFO Speed:', 710, 330);
  lfoSlider = createSlider(0, 99, lfoStart*100);
  lfoSlider.position(710, 340);
  lfoSlider.addClass("mySliders");
  lfoSlider.changed(lfoChanged);

  text('LFO Waveform:', 710, 390);
  lfoselect=createSelect();
  lfoselect.position(710,400);
  lfoselect.option("sine");
  lfoselect.option("square");
  lfoselect.option("triangle");
  lfoselect.option("sawtooth");
  lfoselect.selected("triangle");
  lfoselect.changed(lfoChanged);

  btnNextWav=createButton("Toggle LFO");
  btnNextWav.position(820,400);
  btnNextWav.mousePressed(toggleLFO);


  text('Wavetable Select:', 20, 390);
  wSlider = createSlider(0, 99, 0);
  wSlider.position(20, 400);
  wSlider.addClass("mySliders");
  wSlider.changed(waveSliderChanged)

  text('First Start the Synth before you try anything!', 20, 500);

  text('Keys on your keyboard A-S-D-F-G-H-I-J-K-L '+ ' and Z-X-C-V-B-N-M all play notes', 20, 520);
  

  setupMidi(midiStarted);

}

function startTone() {
  if (!started) {
    console.log("Starting Tone");
    Tone.start();
    started=true;
  }
  lfoChanged();
  wavSelected();
}

function midiStarted() {
  var inMidiDevice=getMidiInputDevice("Key");
  console.log("Found device:",inMidiDevice);
  WebMidi.inputs[inMidiDevice].addListener("noteon", e => {
    notePressed(e.data[1]);
  });
  WebMidi.inputs[inMidiDevice].addListener("noteoff", e => {
    noteReleased(e.data[1]);
  });

}

function lfoChanged() {
  lfo.frequency.value=lfoSlider.value()/300;
  lfo.type=lfoselect.value();
  console.log(lfoselect.value());
}

function toggleLFO() {
  if (started) {
    if (lfo.state=="started") {
      lfo.stop();
    } else {
      lfo.start();
    }
  } else {
    alert("Start the synth first")
  }
}
function adsrChanged() {
  ampEnv.attack=2*aSlider.value()/100;
  ampEnv.decay=2*dSlider.value()/100;
  ampEnv.sustain=sSlider.value()/100;
  ampEnv.release=4*rSlider.value()/100;
}

function nextWav() {
  if (started) {
    var v=wavselect.value();
    i=0;
    while ((v!=wavelist[i]) && (i < wavelist.length)) {
      i++;
    }
    if (i+1 < wavelist.length) {
      wavselect.selected(wavelist[i+1]);
      console.log("changing to "+wavelist[i+1]);
      wavSelected();
    }
  } else {
    alert("Please Start the synth first")
  }

}
function wavSelected() {
  loadWavetable("assets/wavs/"+wavselect.value(),0);
}

function wavLoaded() {
  wavs.start()
  wavs.connect(analyzer);
  wavs.connect(ampEnv);
  wavs.loop=true;
}

var waveTableBuffer;
var lastFileLoaded="";
var lastWaveform=-1;
function loadWavetable(aFilename,aIndex) {
  if (lastFileLoaded!=aFilename) {
    lastFileLoaded=aFilename;
    fileLoaded="";
    lastWaveform=-1;
    waveTableBuffer = new Tone.Buffer(aFilename, function(){
      fileLoaded=aFilename;
      console.log("Loaded:"+fileLoaded);
      lastFileLoaded=aFilename;
      selectWaveform(aIndex);
    });
  }
}

function selectWaveform(aIndex) {
  if (lastWaveform != aIndex) {
    lastWaveform=aIndex;
    if (fileLoaded!="") {
      if (aIndex < 64) {
        wavs.buffer.set(waveTableBuffer.slice(aIndex*wavWidth,(aIndex+1)*wavWidth));
      } else {
        wavs.buffer.set(waveTableBuffer.slice(0,wavWidth));
      }
      wavLoaded();
      wavs.connect(ampEnv);
    }
  }
}

function getWaveSelected() {
  return map(wSlider.value(),0,99,0,63);
}
function waveSliderChanged(){
  selectWaveform(getWaveSelected());
}

function drawWaveform(x,y,w,h) {
  fill(color(0,0,0));
  rect(x,y,w,h);
  if (started) {
    strokeWeight(2);
    noFill();
    stroke(color(50,200,50));
    beginShape();
    var myArray=wavs.buffer.toArray();
    for (let i = 0; i < myArray.length; i++) {
      let dx = map(i, 0, myArray.length, 0, w);
      let dy = map(myArray[i], -1.5, 1.5, h, 0);
      vertex(x+dx, y+dy);
    }
    endShape();

  }
}

function drawLFO(x,y,w,h) {
  fill(color(0,0,0));
  rect(x,y,w,h);
  if (started) {
    let waveform = lfoAnalyzer.getValue();
    strokeWeight(2);
    noFill();
    stroke(color(50,200,50));
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let dx = map(i, 0, waveform.length, 0, w);
      let dy = map(waveform[i], -1, 1, h, 0);
      vertex(x+dx, y+dy);
    }
    endShape();
  }
}


function drawADSR(x,y,w,h) {
  fill(color(50,100,100));
  rect(x,y,w,h);
  a=aSlider.value()/100;
  d=dSlider.value()/100;
  s=sSlider.value()/100;
  r=rSlider.value()/100;
  stroke(255);
  let total=(a+d+r)*2;
  let dw=w/total;
  line(x,y+h,x+dw*a,y);
  line(x+dw*a,y,x+dw*(a+d),y+h-s*h);
  line(x+dw*(a+d),y+h-s*h,x+(total-r)*dw,y+h-s*h);
  line(x+(total-r)*dw,y+h-s*h,x+w,y+h);
}

function lfoWaveformSelect() {
  if (lfo.state=="started") {
    if (fileLoaded!="") {
      let lfoWaveform = lfoAnalyzer.getValue();
      var sampleIndex=floor(map(lfoWaveform[0],-1,1,0,64));
      wSlider.value(map(lfoWaveform[0],-1,1,0,99));
      selectWaveform(sampleIndex);
    }
  }
}

function draw() {
  //background(220);
  lfoWaveformSelect();
  drawADSR(300,0,300,300);
  drawWaveform(0,0,300,300);
  drawLFO(600,0,300,300);
}

function notePressed(m) {
  if (midiToFreqPercent(m)>0) {
    wavs.playbackRate=cRatio*midiToFreqPercent(m);
  }
  console.log(m);
  ampEnv.triggerAttack();
}

function noteReleased(m) {
  ampEnv.triggerRelease();
}

function keyPressed(e) {
  console.log(e.key);
  var m = key2Midi(e.key);
  if (m > 0) {
    notePressed(m);
  }

}

function keyReleased(e) {
  var m = key2Midi(e.key);
  if (m > 0) {
    noteReleased(m);
  }
}
