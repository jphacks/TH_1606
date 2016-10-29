var APIKey = '7a5d2622-4b5f-47d3-b2eb-45fcf2f7681d';

var multiparty = new MultiParty({
  "key": APIKey,
  "reliable": true,
  "debug": 3
});

function createVideoNode(video, customClass) {
  var videoNode = MultiParty.util.createVideoNode(video);
  videoNode.setAttribute("class", "video " + customClass);
  return videoNode;
}

function muteMedia(mediaType, muteBtn) {
  var options = {};
  var isMuted = !$(muteBtn).data("muted");
  options[mediaType] = isMuted;
  multiparty.mute(options);
  $(muteBtn)
    .text(mediaType + " " + (isMuted ? "unmute" : "mute"))
    .data("muted", isMuted);
}

function muteVideo(muteBtn) {
  muteMedia('video', muteBtn);
}

function muteAudio(muteBtn) {
  muteMedia('audio', muteBtn);
}

$('document').ready(function() {
  multiparty
    .on('my_ms', function(video) {
      var videoNode = createVideoNode(video, 'my-video');
      videoNode.volume = 0;
      $(videoNode).appendTo("#videos");
    })
    .on('peer_ms', function(video) {
      var videoNode = createVideoNode(video, 'peer-video');
      $(videoNode).appendTo("#videos");
    })
    .on('ms_close', function(peerId) {
      $("#" + peerId).remove();
    });

  multiparty.on('error', function(err) {
    alert(err);
  });

  $("#video-mute").on("click", function(event) {
    muteBtn = event.target;
    muteVideo(muteBtn);
  });

  $("#audio-mute").on("click", function(event) {
    muteBtn = event.target;
    muteAudio(muteBtn);
  });

  multiparty.start();
});
