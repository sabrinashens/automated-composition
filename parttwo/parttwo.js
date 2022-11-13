var audioCtx;
var osc;
var gainNode;
var startTime;
var endTime;
const generateButton = document.getElementById("generate");
const playButton = document.getElementById("play");

generateButton.addEventListener('click', function () {
    var numMaps = Math.floor(Math.random() * 5) + 20; 
    var normalForm = document.getElementById('normalform').value.split(" ").map(Number); 
    sequence = [];
    finalSequence = [];
	startTime = 0;
    for (let i = 0; i < numMaps; i++) {
       randomOperation(normalForm);
    }
    for (let i = 0; i < sequence.length; i++) {
        finalSequence += sequence[i].pitch.toString() + " ";
    }
    document.getElementById('sequence').innerHTML = finalSequence;
});

function transpose(noteList) {
    var transposedList = [];
    var num = Math.floor(Math.random() * 12);
    for (let i = 0; i < noteList.length; i++) {
        var notePitch = noteList[i] + num;
        var quotient = ~~(notePitch / 12);
        if (notePitch >= 12) {
        	notePitch -= 12*quotient;
        }
        else if (notePitch < 0){
        	notePitch += 12*-quotient;
        }
        transposedList[i] = notePitch;  
    }
    return transposedList;
}

function retrograde(noteList) {
    for (let i = 0; i < noteList.length; i++) {
        var notePitch = noteList[i];
        var quotient = ~~(notePitch / 12);
        if (notePitch >= 12) {
        	notePitch -= 12*quotient;
        }
        else if (notePitch < 0){
        	notePitch += 12*-quotient;
        }
        noteList[i] = notePitch;  
    }
    return noteList.reverse(); 
}

function inversion(noteList) {
    var invertedList = [];
    for (let i = 0; i < noteList.length; i++) {
        var quotient = ~~(noteList[i] / 12);
        if (noteList[i] >= 12) {
        	noteList[i] -= 12*quotient;
        }
        else if (noteList[i] < 0){
        	noteList[i] += 12*-quotient;
        }
        invertedList[i] = 12 - noteList[i];  
    }    
    return invertedList;
}

function randomOperation(pitchSet){
    var mode = Math.floor(Math.random() * 3) + 1;  
    var pitchAd = Math.floor(Math.random() * 30) + 50;
    if (mode === 1) {
        pitchSet = transpose(pitchSet);
    }
    else if (mode === 2) {
        pitchSet = inversion(pitchSet);
    }
    else if (mode === 3) {
        pitchSet = retrograde(pitchSet);
    }
    mappedPitchSet = [];
    for (let i = 0; i < pitchSet.length; i++) {
        mappedPitchSet.push(pitchSet[i] + pitchAd);
    }
    generateSequence(mappedPitchSet);
}

function generateSequence(mappedPitchSet){
    for (let i = 0; i < mappedPitchSet.length; i++) {
    	var duration = Math.random() / 2;
         sequence.push({
            pitch: mappedPitchSet[i],
            startTime: startTime,
            endTime: startTime + duration
        });
        startTime += duration;   
    }
}

let wave = 'sine';
var waveform = document.getElementById("Waveforms").waveform;
for (var i = 0; i < waveform.length; i++) {
	waveform[i].onclick = function() {
  	wave = this.value;
	} 
}

playButton.addEventListener('click', function () {   
    audioCtx = new (window.AudioContext || window.webkitAudioContext);
    osc = audioCtx.createOscillator();
    osc.type = wave;
    gainNode = audioCtx.createGain();
    osc.connect(gainNode).connect(audioCtx.destination);
    osc.start();
    gainNode.gain.value = 0;
    playNotes(sequence);
});

function midiToFreq(m) {
    return Math.pow(2, (m - 69) / 12) * 440;
}

function playNotes(noteList) {
    noteList.forEach(note => {
        playNote(note);
    });  
}

function playNote(note) {
	offset = 1;
    gainNode.gain.setTargetAtTime(0.7, note.startTime + offset, 0.01)
    osc.frequency.setTargetAtTime(midiToFreq(note.pitch),
    note.startTime + offset, 0.001)
    gainNode.gain.setTargetAtTime(0, note.endTime + offset - 0.05, 0.01)
}
