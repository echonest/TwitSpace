var twitspaceOn;
var songmp3;

$(function() {
    
  chrome.extension.sendRequest({}, function(response) {
      twitspaceOn = response.twitspaceOn;
  });
      
  console.log('hello world');
  $('.stream-item-content').live('click', function() {
        ts_myspacifyTweet($(this).find(".tweet-text").text());
  });
  
  if (window.location.hash.indexOf("status") != -1) {
      ts_myspacifyPerma(0);
  }
  
}());

function ts_myspacifyPerma(tries) {
  var $permas = $('.permalink-tweet');
  console.log("Permacheck "+tries);
      if ($permas.length) {
           ts_myspacifyTweet($permas.find(".tweet-text").text());
      }
      else {
          if (tries < 10) {
            tries++;
            setTimeout('ts_myspacifyPerma('+tries+')', 2000);
          }
      }
}
  
function ts_myspacifyTweet(tweet_txt) {
  console.log('found tweet');
  console.log(tweet_txt);
  ts_newAudio(false); // stop playback
  if (twitspaceOn) {
      $.getJSON("http://developer.echonest.com/api/v4/artist/extract?callback=test",
        {
          api_key: "N6E4NIOVYMTHNDM8J",
          text: tweet_txt,
          results: 10,
          sort: "familiarity-desc",
          format: "json"
        },
        function(data) {
          var artist = data.response.artists[0].name;
          var id = data.response.artists[0].id;
          console.log(artist);

          if (artist) {
            var image = "http://ws.audioscrobbler.com/2.0/?method=artist.getimageredirect&artist=" + encodeURI(artist) + "&api_key=b25b959554ed76058ac220b7b2e0a026&size=mega";
            console.log(image);
            $('body').css("background", "url(" + image + ") center center repeat").addClass('myspacerized');
            ts_playRandomSong(id);
          }
    });
  }
}

function ts_playRandomSong(id) {
  $.getJSON("http://developer.echonest.com/api/v4/song/search?callback=test&bucket=tracks&bucket=id:7digital",
      {
        api_key: "N6E4NIOVYMTHNDM8J",
        artist_id: id,
        results: 5,
        sort: "song_hotttnesss-desc",
        format: "json"
      },
      function(data) {
          if (data.response.songs) {
              songmp3 = false;
              tries = 0;
              while (!songmp3 && tries <= data.response.songs.length) {
                  randomIndex = Math.floor(Math.random() * data.response.songs.length);
                  console.log("Picked random index "+randomIndex+" out of "+data.response.songs.length+" possible audio files");
                  theSong = data.response.songs[randomIndex];
                  if (theSong.tracks) {
                    songmp3 = theSong.tracks[0].preview_url;
                    ts_newAudio(songmp3);
                  }
                  else {
                    console.log("No track for some reason");
                  }
                tries++;
              }
          }   
      }
  );
}

function ts_newAudio(mp3) {
    // rip it up and start again
    audio = document.getElementById('audio');
    if (!audio) {
        $('body').append('<audio id="audio" src="" loop="true">');
        audio = document.getElementById('audio');
    }
    if (mp3) {
        audio.src = mp3;
        audio.play();
        console.log("Loading/playing "+mp3);
    } else {
        audio.pause();
        console.log("Stopped audio");
    }
}