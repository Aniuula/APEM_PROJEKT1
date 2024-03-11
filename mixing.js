import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";
import Hover from 'https://unpkg.com/wavesurfer.js/dist/plugins/hover.esm.js';
import 'https://unpkg.com/wavesurfer-multitrack/dist/multitrack.min.js';

function beginEditing(audioSrc){
    const container_row = $('body > div.container > div.row');
    container_row.remove();
    const listObject = $('[data-role="recordings"]');
    listObject.remove();
    const container = $('body > div.container');
    container.append('<div id="buttons" style="margin: 2em 0">');
    const buttons = $('body > div.container > #buttons');
    buttons.append('<button id="play"><span class="material-icons">play_circle_outline</span></button></div>');
    container.append('<div id="waveform"></div>');
    container.append('<div id="container"></div>');
}

 function generateWaveSurfer(audioSrc){


    const multitrack = Multitrack.create(
      [
        {
            id: 0,
            draggable: true,
            intro: {
                label: 'Track1',
                color: '#FFE56E',
            },
            options: {
                waveColor: 'hsl(46, 87%, 49%)',
                progressColor: 'hsl(46, 87%, 20%)',
                normalize: true,
                minPxPerSec: 100,
            },
            url: audioSrc,
        },
        {
            id: 1,
        },
      ],
      {
        container: document.querySelector('#container'),
        rightButtonDrag: true,
        cursorWidth: 2,
        cursorColor: '#D72F21',
        trackBorderColor: '#7C7C7C',
      },
    )

    multitrack.on('drop', ({ id }) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        var reader = new FileReader();
        const audio = new Audio();
        reader.onload = function(event) {
            const fileContent = event.target.result;
            const blob = new Blob([fileContent], { type: file.type });
            audio.controls = true;
            audio.src = URL.createObjectURL(blob);

            multitrack.addTrack({
                id,
                url: audio.src,
                draggable: true,
                startPosition: 0,
                normalize: true,
                volume: 1,
                options: {
                    normalize: true,
                    waveColor: "hotpink",
                    progressColor: "paleturquoise",
                },
            });
        };
        reader.readAsArrayBuffer(file);
    })

    const ws = WaveSurfer.create({
        container: "#waveform",
        waveColor: "hotpink",
        progressColor: "paleturquoise",
        cursorColor: "#57BAB6",
        cursorWidth: 4,
        minPxPerSec: 100,
        normalize: true,
        plugins: [
            Hover.create({
              lineColor: '#ff0000',
              lineWidth: 2,
              labelBackground: '#555',
              labelColor: '#fff',
              labelSize: '11px',
            }),
          ],
      });

    ws.load(audioSrc);

    ws.on('finish', () => {
        ws.setTime(0)
    })

    ws.on("interaction", () => { ws.play(); });

    const button = document.querySelector('#play')
    button.disabled = true
    multitrack.once('canplay', async () => {
        button.disabled = false
        button.onclick = () => {
            multitrack.isPlaying() ? multitrack.pause() : multitrack.play()
            document.querySelector("#play > span").textContent = multitrack.isPlaying() ? 'pause_circle_outline' : 'play_circle_outline'
        }
    })

    multitrack.on('finish', () => {
        console.log('ended')
        multitrack.setTime(0)
    })
 }

jQuery(document).ready(function () {
    var listObject = $('[data-role="recordings"]');

    listObject.on("click", ".row > a", function () {
        var audioSrc = $(this).parent().find("audio").attr("src");
        beginEditing(audioSrc);
        generateWaveSurfer(audioSrc);
    });
});

