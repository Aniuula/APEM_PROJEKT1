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
          myRecorder.isRecording = true;
        })
        .catch(function (err) {
          console.error("Error accessing microphone:", err);
        });
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
            var downloadObject = $("<a><img src='./images/mixer.png'></a>");
            var holderObject = $('<div class="row"></div>')
              .append(audioObject)
              .append(downloadObject);
            listObject.append(holderObject);
          });
        }
      }
      myRecorder.isRecording = false;
    },
    edit: function (audioSrc) {
      console.log("Editing:", audioSrc);
    },
  };

  var listObject = $('[data-role="recordings"]');

  listObject.on("click", ".row", function () {
    var audioSrc = $(this).find("audio").attr("src");
    myRecorder.edit(audioSrc);

    $("#recordButton, #uploadButton").remove();
  });

  $("#recordButton").on("click", function () {
    myRecorder.init();

    var buttonState = $(this).hasClass("btn-stop-recording");

    if (!buttonState) {
      myRecorder.start();
      $(this).removeClass("btn-record").addClass("btn-stop-recording");
    } else {
      myRecorder.stop(listObject);
      $(this).removeClass("btn-stop-recording").addClass("btn-record");
    }
  });
});

function refreshPage() {
  location.reload();
}
