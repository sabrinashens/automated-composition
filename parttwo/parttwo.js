var audioCtx;
var osc;
var gainNode;
var startTime = 0;
var endTime;

const generateButton = document.getElementById("generate");
generateButton.addEventListener('click', function () {
    var numMaps = Math.floor(Math.random() * 5) + 20; 
    var normalForm = document.getElementById('normalform').value.split(" ").map(Number); 
    sequence = [];
    finalSequence = [];

    for (let i = 0; i < numMaps; i++) {
       var offset = Math.floor(Math.random() * 30) + 50;
       generateSequence(randomOperation(normalForm, offset), offset);
    }

    for (let i = 0; i < sequence.length; i++) {
        finalSequence += sequence[i].pitch.toString() + " ";
    }

    document.getElementById('sequence').innerHTML = finalSequence;
});

function generateSequence(noteList, offset){
    for (let i = 0; i < noteList.length; i++) {
        sequence.push({
            pitch: noteList[i],
            startTime: startTime,
            endTime: startTime + (noteList[i] + 1 - offset) * 0.05
        });
        startTime += (noteList[i] + 1 - offset) * 0.05; 
    }
}

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

function randomOperation(pitchSet, offset){
    var mode = Math.floor(Math.random() * 3) + 1;  
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
        mappedPitchSet.push(pitchSet[i] + offset);
    }
    return mappedPitchSet;   
}

const playButton = document.getElementById("play");
playButton.addEventListener('click', function () {
    audioCtx = new (window.AudioContext || window.webkitAudioContext);
    osc = audioCtx.createOscillator();
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