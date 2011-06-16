var twitspaceOn;
var songmp3;

(function() {
    
  chrome.extension.sendRequest({}, function(response) {
      twitspaceOn = response.twitspaceOn;
  });
      
  console.log('hello world');
  $('.stream-item-content').live('click', function() {
    console.log('clicked');
    var tweet_txt = $(this).find(".tweet-text").text();
    console.log(tweet_txt);
    audio = document.getElementById('audio');
    if (audio) audio.src = ''; // stop playback
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
              playRandomSong(id);
            }
      });
    }
});
}());

function playRandomSong(id) {
    $.getJSON("http://developer.echonest.com/api/v4/song/search?callback=test&bucket=tracks&bucket=id:7digital",
        {
          api_key: "N6E4NIOVYMTHNDM8J",
          artist_id: id,
          results: 3,
          sort: "song_hotttnesss-desc",
          format: "json"
        },
        function(data) {
            songmp3 = false;
            if (data.response.songs) {
                theSong = data.response.songs[Math.floor(Math.random() * data.response.songs.length)];
                if (theSong.tracks) {
                    songmp3 = theSong.tracks[0].preview_url;
                }
            }   
            if (songmp3) {
                audio = document.getElementById('audio');
                if (!audio) {
                    $('body').append('<audio id="audio" src="" autoplay="true" loop="true">');
                    audio = document.getElementById('audio');
                }
                audio.src = songmp3;
            }
        }
    );
}
