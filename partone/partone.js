synthChoice = "nor";

function selectNor(){
  synthChoice = "nor";
  document.querySelectorAll('fieldset.Nor').forEach(input => {
    input.disabled = true;
  }) 
  document.querySelectorAll('fieldset.Add').forEach(input => {
    input.disabled = false;
  }) 
  document.querySelectorAll('fieldset.AM').forEach(input => {
    input.disabled = false;
  })
  document.querySelectorAll('fieldset.FM').forEach(input => {
    input.disabled = true;
  })
}

function selectAdd() {
  synthChoice = "add";
  document.querySelectorAll('fieldset.Add').forEach(input => {
    input.disabled = false;
  }) 
  document.querySelectorAll('fieldset.AM').forEach(input => {
    input.disabled = true;
  })
  document.querySelectorAll('fieldset.FM').forEach(input => {
    input.disabled = true;
  })    
}

function selectAM(){
  synthChoice = "am";
  document.querySelectorAll('fieldset.Add').forEach(input => {
    input.disabled = true;
  }) 
  document.querySelectorAll('fieldset.AM').forEach(input => {
    input.disabled = false;
  })
  document.querySelectorAll('fieldset.FM').forEach(input => {
    input.disabled = true;
  })
}

function selectFM(){
	synthChoice = "fm";
  document.querySelectorAll('fieldset.Add').forEach(input => {
    input.disabled = true;
  }) 
  document.querySelectorAll('fieldset.AM').forEach(input => {
    input.disabled = true;
  })
  document.querySelectorAll('fieldset.FM').forEach(input => {
   	input.disabled = false;
  })
}

var partialNum = 1;
function selectPartial() {
    partialNum = document.getElementById("partials").value; 
}

let peakVal = 0.8;
const peakControl = document.querySelector('#peakVal');
peakControl.addEventListener('input', function() {
	peakVal = parseFloat(this.value);
})

var sustainVal = 0.06;
const susValControl = document.querySelector('#susVal');
susValControl.addEventListener('input', function() {
	sustainVal = parseFloat(this.value);
})

let sustainTime = 0.03;
const sustainControl = document.querySelector('#sus');
sustainControl.addEventListener('input', function() {
	sustainTime = parseFloat(this.value);
})

var releaseTime = 0.02;
const releaseControl = document.querySelector('#re');
releaseControl.addEventListener('input', function() {
	releaseTime = parseFloat(this.value);
})

var modAMFreq = 100;
const updateAMFreq = document.querySelector('#AmFreq');
updateAMFreq.addEventListener('input', function() {
	modAMFreq = parseFloat(this.value);
})

var modFMFreq = 100;
const updateFMFreq = document.querySelector('#FmFreq');
updateFMFreq.addEventListener('input', function() {
	modFMFreq = parseFloat(this.value);
})

var modFMInd = 100;
const updateFMInd = document.querySelector('#FmInd');
updateFMInd.addEventListener('input', function() {
	modFMInd = parseFloat(this.value);
})

function lfoClicked1() {
	if (lfoBtn1 === true) {
    lfoBtn1 = false;
    document.getElementById('lfoBtn1').style.backgroundColor = "white";
    document.getElementById('lfoBtn1').style.color = "black";
  }
  else {
    lfoBtn1 = true;
    document.getElementById('lfoBtn1').style.backgroundColor = "black";
    document.getElementById('lfoBtn1').style.color = "white";
  }
}

function lfoClicked2() {
	if (lfoBtn2 === true) {
    lfoBtn2 = false;
    document.getElementById('lfoBtn2').style.backgroundColor = "white";
    document.getElementById('lfoBtn2').style.color = "black";
  }
  else {
    lfoBtn2 = true;
    document.getElementById('lfoBtn2').style.backgroundColor = "black";
    document.getElementById('lfoBtn2').style.color = "white";
  }
}

var audioCtx;
var osc;
var gainNode;
let offset = 1.0;

// we start by defining some input (not training) data
TWINKLE_TWINKLE = {
  notes: [
    {pitch: 60, startTime: 0.0, endTime: 0.5},
    {pitch: 60, startTime: 0.5, endTime: 1.0},
    {pitch: 67, startTime: 1.0, endTime: 1.5},
    {pitch: 67, startTime: 1.5, endTime: 2.0},
    {pitch: 69, startTime: 2.0, endTime: 2.5},
    {pitch: 69, startTime: 2.5, endTime: 3.0},
    {pitch: 67, startTime: 3.0, endTime: 4.0},
    {pitch: 65, startTime: 4.0, endTime: 4.5},
    {pitch: 65, startTime: 4.5, endTime: 5.0},
    {pitch: 64, startTime: 5.0, endTime: 5.5},
    {pitch: 64, startTime: 5.5, endTime: 6.0},
    {pitch: 62, startTime: 6.0, endTime: 6.5},
    {pitch: 62, startTime: 6.5, endTime: 7.0},
    {pitch: 60, startTime: 7.0, endTime: 8.0},  
  ],
  totalTime: 8
};

function midiToFreq(m) {
  return Math.pow(2, (m - 69) / 12) * 440;
}

//to play notes that are generated from .continueSequence
//we need to unquantize, then loop through the list of notes
function playNotes(noteList) {
  noteList = mm.sequences.unquantizeSequence(noteList)
  console.log(noteList.notes)
  noteList.notes.forEach(note => {
    playNote(note);
  });
}

function playNote(note) {
	if (synthChoice === "nor") {
    initPlay(note);
  }
  else if (synthChoice === "add") {
    initAdd(note);
  }
  else if (synthChoice === "am") {
    initAM(note);
  }
  else if (synthChoice === "fm") {
    initFM(note);
  }
}

function initPlay(note) {
  gainNode.gain.setTargetAtTime(0.8, note.startTime+offset, 0.01)
  osc.frequency.setTargetAtTime(midiToFreq(note.pitch), note.startTime+offset, 0.001)
  gainNode.gain.setTargetAtTime(0, note.endTime+offset-0.05, 0.01)
}


function initAdd(note) {
  gainNode.gain.setTargetAtTime(peakVal, note.startTime+offset, 0.01)
  gainNode.gain.setTargetAtTime(sustainVal, note.startTime+offset+0.01, sustainTime)
  osc.frequency.setTargetAtTime(midiToFreq(note.pitch), note.startTime+offset, 0.001)
  gainNode.gain.setTargetAtTime(0, note.endTime+offset-0.05, releaseTime)
	const addgain = audioCtx.createGain();
	addgain.gain.value = 0.1;
  addgain.connect(gainNode);
  noteFreq = midiToFreq(note.pitch);
  for (i = 0; i < partialNum; i++) {
    noteFreq = noteFreq * 2;
    oscPartial = audioCtx.createOscillator();
    oscPartial.frequency.setValueAtTime(noteFreq, note.endTime);
    oscPartial.connect(addgain);
    oscPartial.start();
  }  
    
  if (lfoBtn1 === true) {
    var lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.8, note.startTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(10, note.startTime);
    lfo.connect(lfoGain).connect(osc.frequency);
    lfo.start();
  }
}

function initAM(note) {
  var modulatorFreq = audioCtx.createOscillator();
  modulatorFreq.frequency.value = modAMFreq;

  const modulated = audioCtx.createGain();
  const depth = audioCtx.createGain();
  depth.gain.value = 0.5;
  modulated.gain.value = 1.0 - depth.gain.value; 
   
  modulatorFreq.connect(depth).connect(modulated.gain); 
  osc.connect(modulated);
  modulated.connect(compressor).connect(audioCtx.destination);
  modulatorFreq.start();
  
  initPlay(note);
    
 	if (lfoBtn2 === true) {
    var lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(2, note.startTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(100, note.startTime);
    lfo.connect(lfoGain).connect(modulatorFreq.frequency);
    lfo.start();
  }
}

function initFM(note) {
  var modulatorFreq = audioCtx.createOscillator();
  const modulationIndex = audioCtx.createGain();
  modulationIndex.gain.value = modFMInd;
  modulatorFreq.frequency.value = modFMFreq;
  modulatorFreq.connect(modulationIndex);
  modulationIndex.connect(osc.frequency);
  modulatorFreq.start();
        
  initPlay(note);  
}

function genNotes() {
    //load a pre-trained RNN model
    music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
    music_rnn.initialize();
    
    //the RNN model expects quantized sequences
    const qns = mm.sequences.quantizeNoteSequence(TWINKLE_TWINKLE, 4);
    
    //and has some parameters we can tune
    rnn_steps = 40; //including the input sequence length, how many more quantized steps (this is diff than how many notes) to generate 
    rnn_temperature = 1.1; //the higher the temperature, the more random (and less like the input) your sequence will be
    
    // we continue the sequence, which will take some time (thus is run async)
    // "then" when the async continueSequence is done, we play the notes
    music_rnn
        .continueSequence(qns, rnn_steps, rnn_temperature)
        .then((sample) => playNotes(mm.sequences.concatenate([qns,sample])));

}

const playButton = document.querySelector('button');
playButton.addEventListener('click', function() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)
    osc = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
    osc.connect(gainNode).connect(compressor).connect(audioCtx.destination);
    osc.start()
    gainNode.gain.value = 0;

    genNotes();
}, false);