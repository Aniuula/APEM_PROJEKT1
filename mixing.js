import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

function getQueryParam(name) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(name);
}

var listObject = $('[data-role="recordings"]');

var audioSrc;

function displayRecordedAudio() {

    audioSrc = getQueryParam('audioSrc');

    if (audioSrc) {

        var audioObject = $("<audio controls></audio>").attr("src", audioSrc);
        var holderObject = $('<div class="row"></div>').append(audioObject)

        listObject.append(holderObject);
    }
}

window.onload = function() {
    displayRecordedAudio();
    console.log(audioSrc)
};

function refreshPage() {
    window.location.href = "index.html";
}

const ws = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'hotpink',
    progressColor: 'paleturquoise',
    cursorColor: '#57BAB6',
    cursorWidth: 4,
    minPxPerSec: 100,
    url: audioSrc, // tu jest problem nie czyta tego co zostaje przerzucone na drugą stronę
  })

ws.on('interaction', () => {
    ws.play()
})