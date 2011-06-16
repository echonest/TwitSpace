var twitspaceOn;

(function() {
    
  chrome.extension.sendRequest({}, function(response) {
      twitspaceOn = response.twitspaceOn;
  });
      
  console.log('hello world');
  $('.stream-item-content').live('click', function() {
    console.log('clicked');
    var tweet_txt = $(this).find(".tweet-text").text();
    console.log(tweet_txt);
    
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
            console.log(artist);
      
            if (artist) {
              var image = "http://ws.audioscrobbler.com/2.0/?method=artist.getimageredirect&artist=" + encodeURI(artist) + "&api_key=b25b959554ed76058ac220b7b2e0a026";
              console.log(image);
              $('body').css("background-image", "url(" + image + ")");
            }
          });
    }
  });
}());