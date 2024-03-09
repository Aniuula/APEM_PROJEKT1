function getQueryParam(name) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(name);
}

var listObject = $('[data-role="recordings"]');

function displayRecordedAudio() {

    const audioSrc = getQueryParam('audioSrc');

    if (audioSrc) {

        var audioObject = $("<audio controls></audio>").attr("src", audioSrc);
        var holderObject = $('<div class="row"></div>').append(audioObject)

        listObject.append(holderObject);
    }
}

window.onload = function() {
    displayRecordedAudio();
};

function refreshPage() {
    window.location.href = "index.html";
  }