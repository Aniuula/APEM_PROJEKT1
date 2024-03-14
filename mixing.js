import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";
import Hover from 'https://unpkg.com/wavesurfer.js/dist/plugins/hover.esm.js';

var ws;

function beginEditing(){
    const container_row = $('body > div.container > div.row');
    container_row.remove();

    const listObject = $('[data-role="recordings"]');
    listObject.remove();

    const container = $('body > div.container');
    container.append('<div id="buttons" style="margin: 2em 0"></div>');

    const buttons = $('body > div.container > #buttons');
    buttons.append('<button id="play"><span class="material-icons">play_circle_outline</span></button>');

    const downloadButton = document.createElement('button');
    downloadButton.id = "download";

    const downloadButtonText = document.createElement('span');
    downloadButtonText.className = "material-icons";
    downloadButtonText.textContent = 'file_download';
    downloadButton.append(downloadButtonText);
    buttons.append(downloadButton);
    container.append('<div id="waveform"></div>');
    downloadButton.onclick = () => {
        var link = document.createElement('a');
        link.href = ws.getMediaElement().src;
        link.download = 'audio_file.wav';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
}

function generateWaveSurfer(audio){
    ws = WaveSurfer.create({
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

    const eqBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

    const filters = eqBands.map((band) => {
        const filter = audioContext.createBiquadFilter()
        filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking'
        filter.gain.value = Math.random() * 40 - 20
        filter.Q.value = 1
        filter.frequency.value = band
        return filter
    })

    audio.addEventListener('canplay',() => {
        const mediaNode = audioContext.createMediaElementSource(audio)

        const equalizer = filters.reduce((prev, curr) => {
            prev.connect(curr)
            return curr
        }, mediaNode)

        equalizer.connect(audioContext.destination)
    },{ once: true },)

    const equalizer = document.createElement('equalizer');
    $('body > div.container').append(equalizer);
    $('body > div.container > equalizer').append('<legend>Equalizer</legend>');
    const divSlider = document.createElement('div-slider');

    $('body > div.container > equalizer').append('<label orient="270deg" type="range" for="band" before="-40" after="40">0</label>');
    eqBands.forEach((band, index) => {
        const slider = document.createElement('input')
        slider.type = 'range'
        slider.min = -40
        slider.max = 40
        slider.value = filters[index].gain.value
        slider.step = 1
        slider.oninput = (e) => (filters[index].gain.value = e.target.value);

        const sliderContainer = document.createElement('slider-with-text');
        sliderContainer.appendChild(slider)

        const sliderText = document.createElement('span')
        sliderText.textContent = band

        sliderContainer.appendChild(sliderText)
        divSlider.appendChild(sliderContainer)
    })
    equalizer.appendChild(divSlider)
 }

function generateOtherOptions() {
    const fieldset = document.createElement('fieldset');
    $('body > div.container').append(fieldset);
    $('body > div.container > fieldset').append('<legend>Options</legend>');
    const divSlider = document.createElement('div-slider');
    const speedContainer = document.createElement('slider-with-text');
    divSlider.appendChild(speedContainer);
    fieldset.appendChild(divSlider);

    const speedSlider = document.createElement('input');
    speedSlider.type = 'range'
    speedSlider.min = 0.25
    speedSlider.max = 2
    speedSlider.value = 1
    speedSlider.step = 0.25
    speedSlider.oninput = (e) => (ws.setPlaybackRate(e.target.value))
    speedContainer.appendChild(speedSlider);

    const speedValueSpan = document.createElement('span');
    speedValueSpan.textContent = 'Speed';
    speedContainer.appendChild(speedValueSpan);

    const volumeContainer = document.createElement('slider-with-text');
    divSlider.appendChild(volumeContainer);
    fieldset.appendChild(divSlider);

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range'
    volumeSlider.min = 0
    volumeSlider.max = 1
    volumeSlider.value = 1
    volumeSlider.step = 0.1
    volumeSlider.oninput = (e) => (ws.setVolume(e.target.value))
    volumeContainer.appendChild(volumeSlider);

    const volumeValueSpan = document.createElement('span');
    volumeValueSpan.textContent = 'Volume';
    volumeContainer.appendChild(volumeValueSpan);
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
        generateOtherOptions();
    });
});

