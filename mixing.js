import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";

function getQueryParam(name) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(name);
}

var listObject = $('[data-role="recordings"]');

async function displayRecordedAudio() {
  const audioSrc = getQueryParam("audioSrc");

  if (audioSrc) {
    var audioObject = $("<audio controls></audio>").attr("src", audioSrc);

    var holderObject = $('<div class="row"></div>').append(audioObject);
    listObject.append(holderObject);

    const ws = WaveSurfer.create({
      container: "#waveform",
      waveColor: "hotpink",
      progressColor: "paleturquoise",
      cursorColor: "#57BAB6",
      cursorWidth: 4,
      minPxPerSec: 100,
    });

    ws.load(audioSrc);

    ws.on("interaction", () => {
      ws.play();
    });
  }
}

displayRecordedAudio();