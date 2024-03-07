document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

var listObject = $('[data-role="recordings"]');

document.getElementById('fileInput').addEventListener('change', function() {

    const file = this.files[0];

    if (file) {

        var url = URL.createObjectURL(file);
        var audioObject = $("<audio controls></audio>").attr("src", url);

        var downloadObject = $("<a>&#9660;</a>")
            .attr("href", url)
            .attr("download", new Date().toUTCString() + ".wav");

        var holderObject = $('<div class="row"></div>')
            .append(audioObject)
            .append(downloadObject);

        listObject.append(holderObject);
    }
});