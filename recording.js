//recording.js
jQuery(document).ready(function () {
  var $ = jQuery;
  var myRecorder = {
    objects: {
      context: null,
      stream: null,
      recorder: null,
    },
    isRecording: false,

    init: function () {
      if (null === myRecorder.objects.context) {
        myRecorder.objects.context = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
    },

    start: function () {
      var options = { audio: true, video: false };
      navigator.mediaDevices
        .getUserMedia(options)
        .then(function (stream) {
          myRecorder.objects.stream = stream;
          myRecorder.objects.recorder = new Recorder(
            myRecorder.objects.context.createMediaStreamSource(stream),
            { numChannels: 1 }
          );
          myRecorder.objects.recorder.record();

          // Update button text and style
          $("#recordButton")
            .removeClass("btn-primary")
            .addClass("btn-danger")
            .text("Stop Recording");

          myRecorder.isRecording = true;
        })
        .catch(function (err) {});
    },

    stop: function (listObject) {
      if (null !== myRecorder.objects.stream) {
        myRecorder.objects.stream.getAudioTracks()[0].stop();
      }
      if (null !== myRecorder.objects.recorder) {
        myRecorder.objects.recorder.stop();

        if (
          null !== listObject &&
          "object" === typeof listObject &&
          listObject.length > 0
        ) {
          myRecorder.objects.recorder.exportWAV(function (blob) {
            var url = (window.URL || window.webkitURL).createObjectURL(blob);

            var audioObject = $("<audio controls></audio>").attr("src", url);
            var downloadObject = $("<a>&#9660;</a>")
              .attr("href", url)
              .attr("download", new Date().toUTCString() + ".wav");

            var holderObject = $('<div class="row"></div>')
              .append(audioObject)
              .append(downloadObject);

            listObject.append(holderObject);

            // Visualize the recorded audio using Wavesurfer.js
            myRecorder.visualize(url);
          });
        }
      }

      // Update button text and style
      $("#recordButton")
        .removeClass("btn-danger")
        .addClass("btn-primary")
        .text("Start Recording");

      myRecorder.isRecording = false;
    },

    visualize: function (url) {
      var wavesurfer = WaveSurfer.create({
        container: "#waveform",
        waveColor: "violet",
        progressColor: "purple",
        height: 100,
      });

      wavesurfer.load(url);
    },
  };

  var listObject = $('[data-role="recordings"]');

  $("#recordButton").click(function () {
    myRecorder.init();

    if (!myRecorder.isRecording) {
      myRecorder.start();
    } else {
      myRecorder.stop(listObject);
    }
  });
});
