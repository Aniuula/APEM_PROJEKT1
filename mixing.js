function getQueryParam(name) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(name);
}

// Function to display recorded audio
function displayRecordedAudio() {
    // Retrieve audio source URL from query parameter
    const audioSrc = getQueryParam('audioSrc');

    if (audioSrc) {
        // Create an <audio> element
        const audioElement = document.createElement('audio');
        audioElement.src = decodeURIComponent(audioSrc);
        audioElement.controls = true;

        // Append the <audio> element to the container
        const container = document.getElementById('recordedAudioContainer');
        container.appendChild(audioElement);
    }
}

// Call the function to display recorded audio when the page loads
window.onload = function() {
    displayRecordedAudio();
};

function refreshPage() {
    window.location.href = "index.html";
  }