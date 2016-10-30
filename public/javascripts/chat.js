var APIKey = '7a5d2622-4b5f-47d3-b2eb-45fcf2f7681d';

var multiparty = new MultiParty({
  "key": APIKey,
  "reliable": true,
  "debug": 3
});

var currentSpeakerIndex = 0;
var activeClass = "active";
var speakerTimeInSeconds = 2;

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

function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.text(minutes + ":" + seconds);
    if (--timer < 0) {
      timer = duration;
      nextSpeaker();
    }
  }, 1000);
}

function getSpeakersNumber() {
  return getVideos().length;
}

function getVideos() {
  return $("#videos video");
}

function startDiscussion() {
  currentSpeakerIndex = 0;
  getVideos()
    .eq(currentSpeakerIndex)
    .addClass(activeClass);
  startTimer(speakerTimeInSeconds, $('#time'));
}

function nextSpeaker() {
  currentSpeakerIndex = (currentSpeakerIndex + 1) % getSpeakersNumber();
  getVideos().each(function() {
    $(this).removeClass(activeClass);
  });
  getVideos()
    .eq(currentSpeakerIndex)
    .addClass(activeClass);
}

function start() {
  multiparty.start();
  setTimeout(startDiscussion(), 1000);
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
    console.log(err);
  });

  $("#video-mute").on("click", function(event) {
    muteBtn = event.target;
    muteVideo(muteBtn);
  });

  $("#audio-mute").on("click", function(event) {
    muteBtn = event.target;
    muteAudio(muteBtn);
  });

  start();
});
