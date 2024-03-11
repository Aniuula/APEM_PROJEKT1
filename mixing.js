import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";
import Hover from 'https://unpkg.com/wavesurfer.js/dist/plugins/hover.esm.js';
import 'https://unpkg.com/wavesurfer-multitrack/dist/multitrack.min.js';

function beginEditing(){
    const container_row = $('body > div.container > div.row');
    container_row.remove();
    const listObject = $('[data-role="recordings"]');
    listObject.remove();
    const container = $('body > div.container');
    container.append('<div id="buttons" style="margin: 2em 0">');
    const buttons = $('body > div.container > #buttons');
    buttons.append('<button id="play"><span class="material-icons">play_circle_outline</span></button></div>');
    container.append('<div id="waveform"></div>');
}

 function generateWaveSurfer(audio){
    const ws = WaveSurfer.create({
        container: "#waveform",
        waveColor: "#7764A2",
        progressColor: "paleturquoise",
        cursorColor: "#57BAB6",
        cursorWidth: 4,
        minPxPerSec: 100,
        normalize: true,
        media: audio,
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

    ws.on('finish', () => {
        ws.setTime(0)
        document.querySelector("#play > span").textContent = 'play_circle_outline'
    })

    ws.on('play', () => {
        document.querySelector("#play > span").textContent = 'pause_circle_outline'
    })
    ws.on("interaction", () => { ws.play() });

    const button = document.querySelector('#play')
    button.onclick = () => {
        ws.isPlaying() ? ws.pause() : ws.play()
        document.querySelector("#play > span").textContent = ws.isPlaying() ? 'pause_circle_outline' : 'play_circle_outline'
    }
 }

 function generateEqualizer(audio){

    const audioContext = new AudioContext()

    // Define the equalizer bands
    const eqBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

    // Create a biquad filter for each band
    const filters = eqBands.map((band) => {
        const filter = audioContext.createBiquadFilter()
        filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking'
        filter.gain.value = Math.random() * 40 - 20
        filter.Q.value = 1 // resonance
        filter.frequency.value = band // the cut-off frequency
        return filter
    })

    // Connect the audio to the equalizer
    audio.addEventListener('canplay',() => {
        // Create a MediaElementSourceNode from the audio element
        const mediaNode = audioContext.createMediaElementSource(audio)

        // Connect the filters and media node sequentially
        const equalizer = filters.reduce((prev, curr) => {
            prev.connect(curr)
            return curr
        }, mediaNode)

        // Connect the filters to the audio output
        equalizer.connect(audioContext.destination)
    },{ once: true },)

    // Create a vertical slider for each band
    const equalizer = document.createElement('equalizer')
    filters.forEach((filter) => {
        const slider = document.createElement('input')
        slider.type = 'range'
        slider.orient = 'vertical'
        slider.style.appearance = 'slider-vertical'
        slider.style.width = '10%'
        slider.min = -40
        slider.max = 40
        slider.value = filter.gain.value
        slider.step = 0.1
        slider.oninput = (e) => (filter.gain.value = e.target.value)
        equalizer.appendChild(slider)
    })
    $('body > div.container').append(equalizer)
 }

jQuery(document).ready(function () {
    var listObject = $('[data-role="recordings"]');

    listObject.on("click", ".row > a", function () {
        var audioSrc = $(this).parent().find("audio").attr("src");
        const audio = new Audio();
        audio.controls = true;
        audio.src = audioSrc;

        beginEditing();
        generateWaveSurfer(audio);
        generateEqualizer(audio);
    });
});

