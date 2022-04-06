var midiEnabled=false;

function setupMidi(aHandler) {
	WebMidi.enable(function (err) {
    if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log("WebMidi enabled!");
        midiEnabled=true;
      }
 
        console.log("---");
        console.log("Inputs Ports: ");
      for(i = 0; i< WebMidi.inputs.length; i++){
        console.log(i + ": " + WebMidi.inputs[i].name);
      }
        console.log("---");
        console.log("Output Ports: ");
      for(i = 0; i< WebMidi.outputs.length; i++){
        console.log(i + ": " + WebMidi.outputs[i].name);
      }
      aHandler();
    });
}

function getMidiInputDevice(astr) {
  var found=-1;
  if (midiEnabled) {
    for(i = 0; i< WebMidi.inputs.length; i++){
      if ((WebMidi.inputs[i].name.indexOf(astr)) != -1) {
        found=i;
      }
    }
  } else {
    console.log("Cannot get Midi Input, Midi not Enabled");
  }
  return found;
}

function key2Midi(aChar) {
  aChar=aChar.toLowerCase();
  var midiNote=0;
  if (aChar=="a") {
    midiNote=60;
  } else if (aChar=="s") {
    midiNote=62;
  } else if (aChar=="d") {
    midiNote=64; 
  } else if (aChar=="f") {
    midiNote=65; 
  } else if (aChar=="g") {
    midiNote=67; 
  } else if (aChar=="h") {
    midiNote=69; 
  } else if (aChar=="j") {
    midiNote=71; 
  } else if (aChar=="k") {
    midiNote=72; 
  } else if (aChar=="l") {
    midiNote=74; 
  } else if (aChar==";") {
    midiNote=76; 
  } else if (aChar=="'") {
    midiNote=77; 
  } else if (aChar=="z") {
    midiNote=48;
  } else if (aChar=="x") {
    midiNote=50; 
  } else if (aChar=="c") {
    midiNote=52; 
  } else if (aChar=="v") {
    midiNote=53;    
  } else if (aChar=="b") {
    midiNote=55; 
  } else if (aChar=="n") {
    midiNote=57;
  } else if (aChar=="m") {
    midiNote=59;  
  } else if (aChar==",") {
    midiNote=60; 
  }
  return midiNote-12;
}

const noteRatio=[1,1.059463,1.122462,1.189207,1.259921,	1.33484,	1.414214,	1.498307,1.587401,1.681793,1.781797,1.887749,2];

function midiToFreqPercent(aMidiNote) {
  var base=1.0;
  if (aMidiNote < 12) {
    base=base/16;
  } else if (aMidiNote < 24) {
    base=base/8;
  } else if (aMidiNote < 36) {
    base=base/4;
  } else if (aMidiNote < 48) {
    base=base/2;
  } else if (aMidiNote < 60) {
  } else if (aMidiNote < 72) {
    base=base*2;
  } else if (aMidiNote < 84) {
    base=base*4;
  } else if (aMidiNote < 96) {
    base=base*8;
  } else if (aMidiNote < 96) {
    base=base*16;
  } else if (aMidiNote < 108) {
    base=base*32;
  }
  return base*noteRatio[(aMidiNote%12)];
}
