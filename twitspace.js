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
              
              // highlight text
              var re = new RegExp(artist,"i");
              $('.focused-stream-item .tweet-text').html($('.focused-stream-item .tweet-text').html().replace(re,function (matched) {return "<span class=\"highlight\">"+matched+"</span>";}));
              
              
              // playRandomSong(id);
              
              $.getJSON("http://ws.audioscrobbler.com/2.0/",
                {
                  api_key: "b25b959554ed76058ac220b7b2e0a026",
                  artist: artist,
                  method: "artist.getImages",
                  format: "json"
                },
                function(data) {
                  var body_image = data.images.image[0].sizes.size[5]['#text'];
                  var details_image = data.images.image[1].sizes.size[2]['#text'];
                  $('body').css("background", "url(" + body_image + ") center center repeat").addClass('myspacerized');
                  setTimeout(function(){
                    $('.details-pane-tweet .tweet-text').append("<img src=\"" + details_image + "\" class=\"details_image\" />");
                  }, 1000);
                  
                  
                  
                  
                  
                }
              );
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
