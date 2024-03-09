import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";

function getQueryParam(name) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(name);
}

var listObject = $('[data-role="recordings"]');
var audioSrc;

function displayRecordedAudio() {
  audioSrc = getQueryParam("audioSrc");

  if (audioSrc) {
    var audioObject = $("<audio controls></audio>").attr("src", audioSrc);
    var holderObject = $('<div class="row"></div>').append(audioObject);
    listObject.append(holderObject);
  }
}

// Create WaveSurfer instance outside the onload event
const ws = WaveSurfer.create({
  container: "#waveform",
  waveColor: "hotpink",
  progressColor: "paleturquoise",
  cursorColor: "#57BAB6",
  cursorWidth: 4,
  minPxPerSec: 100,
});

window.onload = function () {
  displayRecordedAudio();
  console.log(audioSrc);

  // Load audio source when needed
  if (audioSrc) {
    ws.load(audioSrc);
  }

  ws.on("interaction", () => {
    ws.play();
  });

  // Set up the finish event listener
  ws.on("finish", () => {
    // When the audio finishes, seek to the beginning and play again
    ws.seekTo(0);
    ws.play();
  });
};

function refreshPage() {
  window.location.href = "index.html";
}

// Function to play audio again using load()
function playAgain() {
  // Load audio source again before playing
  if (audioSrc) {
    ws.load(audioSrc);
  }

  // Play the loaded audio
  ws.play();
}
