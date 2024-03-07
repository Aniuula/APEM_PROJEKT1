document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
  });

  document.getElementById('fileInput').addEventListener('change', function() {
    const audioPlayer = document.getElementById('audioPlayer');
    const file = this.files[0];
    if (file) {
      const audio = document.createElement('audio');
      audio.controls = true;

      const source = document.createElement('source');
      source.src = URL.createObjectURL(file);
      source.type = 'audio/wav'; // Change the type based on your audio file format

      audio.appendChild(source);
      audioPlayer.appendChild(audio);
    }
  });