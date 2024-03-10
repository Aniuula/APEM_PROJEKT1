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

  if (audioSrc) {
    ws.load(audioSrc);
  }

  ws.on("interaction", () => {
    ws.play();
  });

  ws.on("finish", () => {
    ws.seekTo(0);
    ws.play();
  });
};

function refreshPage() {
  window.location.href = "index.html";
}

function playAgain() {
  if (audioSrc) {
    ws.load(audioSrc);
  }

  ws.play();
}
