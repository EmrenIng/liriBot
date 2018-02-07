require("dotenv").config();

const result = require("dotenv").config();

if (result.error) {
  throw result.error
}
 
//console.log(result.parsed)

//REQUIRE: 
var allKeys = require("./keys.js");
var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
//var Spotify = require('spotify');

//console.log(allKeys);
// Set to input. 
var input = process.argv;
var songNa = input[3];

 
// Link to bring in the keys js so that they can be linked like:
 //var spotify = new Spotify(keys.spotify);
 // var client = new Twitter(keys.twitter);

 // LIRI COMMANDS:
 switch (input[2]) {
	case "my-tweets":
	tweets();
	break;

	case "spotify-this-song":
	spotifys(songNa);
	break;

	case "movie-this":
	movie(songNa);
	break

	case "do-what-it-says":
	random(songNa);
	break;
	
};
//TWITTER
 //my-tweets
 	// Last 20 tweets + when they were created. 
function tweets() {
		// set up credentials object for Twitter access
	
	var client = new Twitter({
		consumer_key: allKeys.twitter.consumer_key,
		consumer_secret: allKeys.twitter.consumer_secret,
		access_token_key: allKeys.twitter.access_token_key,
		access_token_secret: allKeys.twitter.access_token_secret
	});

	var params = {screen_name: 'WaywardPavus', count: 20};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
		    //console.log(tweets);
		    for (i=0; i<tweets.length; i++) {
	            var returnedData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
	            console.log(returnedData);
	            console.log("-------------------------");
		  }
		}
		  else {
		  	console.log("error")
		  }
	});
}

//SPOTIFY
 //spotify-this-song 'song name'
 	// Artist + Song Name + preview link + The Album song is from. 
 	// Default "The Sign" by Ace of Base.
 function spotifys(songNa) {

 
	var spotify = new Spotify(allKeys.spotify);
		if (!songNa){
        	songNa = 'The Sign';
    	}
		spotify.search({ type: 'track', query: songNa }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }

	        var songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name  + '\n' + "Song Name: " + songInfo[0].name  + '\n' + "Preview: " + songInfo[0].preview_url  + '\n' + "Album: " + songInfo[0].album.name);
	        console.log("-------------------------");
	});
   
}
//OMDB
 //movie-this 'Movie name'
 	// Title + Year + Rating + COuntry of Production + Language + Plot + Actors
 	// Default Mr.Nobody
 function movie(songNa) {

 	//var key = '610cc50c';
	var queryUrl = "http://www.omdbapi.com/?t=" + songNa + "&y=&plot=short&apikey=610cc50c";

	request(queryUrl, function(error, response, body) {
		if (!songNa){
        	songNa = 'Mr Nobody';
        	console.log("default");
    	}
		if (!error && response.statusCode === 200) {

		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Year: " + JSON.parse(body).Year);
		    console.log("Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		    console.log("-------------------------");
		}
	});
};
//RANDOM
//do-what-it-says
 	// Liri will use what is in the random.txt and execute it. 
 function random() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		// Then split it by commas (to make it more readable)
		var dataArr = data.split(",");
		//console.log(dataArr);
		var spot = dataArr[0];
	    var name = dataArr[1];

	  if( spot === 'spotify-this-song') {
	  	 songNa = name;
	  	 spotifys(songNa);

	  }
		
  	});

};


