import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";

function beginEditing(audioSrc){
    console.log("Editing:", audioSrc);
    const container_row = $('body > div.container > div.row');
    container_row.remove();
    const listObject = $('[data-role="recordings"] .row');
    listObject.each(function() {
        var rowAudioSrc = $(this).find("audio").attr("src");
        if (rowAudioSrc !== audioSrc) {
            $(this).remove();
        }
    });
    document.querySelector("#audioPlayer > div > a").remove();
}

 function generateWaveSurfer(audioSrc){
    const container = $('body > div.container');
    container.append('<div id="waveform"></div>');
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

jQuery(document).ready(function () {
    var listObject = $('[data-role="recordings"]');

    listObject.on("click", ".row > a", function () {
        var audioSrc = $(this).parent().find("audio").attr("src");
        beginEditing(audioSrc);
        generateWaveSurfer(audioSrc);
    });
});

