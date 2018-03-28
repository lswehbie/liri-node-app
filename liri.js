// Load the fs package to read and write

//require("dotenv").config();

var fs = require("fs");

var keys = require("./keys.js");



var Spotify = require('node-spotify-api');
//var spotify = new Spotify(keys.spotify);

var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

spotify.search({ type: 'track', query: 'All the Small Things'},
	function(err, data) {
		if(err) {
		console.log('Error Occured:' + err);
	}

	console.log(data);
});


var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

var userInput = process.argv;
var songOrMovie = "";

var command = process.argv[2];

var request = require("request");

// We will then create a switch-case statement (if-else would also work).
// The switch-case will direct which function gets run.

switch(command) {
	case "my-tweets":
	blursomeTweets();
	break;

	case "spotify-this-song":
	spotifyThisSong();
	break;

	case "movie-this":
	movieThis();
	break;

	case "do-what-it-says":
	doWhatItSays();
	break;
}


function blursomeTweets() {

	//This will show your last 20 tweets and when they were created at in your terminal/bash window.
	var params = {screen_name: "blursome", count: 20};

	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if (error) {
			console.log(error);
		} else {
			var tweetsBlursome; 
			
			for (var x in tweets) {
				tweetsBlursome = tweets[x].text + "\r\nDate: " + tweets[x].created_at + "\r\n";
				console.log(tweetsBlursome);
				appendToFile("\r\n" + tweetsBlursome + "\r\n");
			}
		}
	});
}


function spotifyThisSong() {

	// This will show the following information about the song in your terminal/bash window

	//If no song is provided then your program will default to "The Sign" by Ace of Base.
	
	checkIfMoreThanOneWord();
	var params = {type: "track", query: songOrMovie, limit: 1};

	spotify.search(params, function(err, data) {
		if (err) {
			console.log("Error occured: " + err);
		} else {
			var artist = data.tracks.items[0].artists[0].name;
			var trackTitle = "'" + data.tracks.items[0].name + "'";
			var songLink = data.tracks.items[0].external_urls.spotify;
			var album = data.tracks.items[0].album.name;
			console.log("Artist: " + artists);
			console.log("Song Name: " + trackTitle);
			console.log("Song Preview: " + songLink);
			console.log("Album: " + albumName);

			appendToFile("\r\nArtist: " + artist + "\r\nTrack Title: " + trackTitle + "\r\nSong Preview: " + songLink +
				"\r\nAlbum: " + album + "\r\n");
		}
	});
}

debugger;

function movieThis() {

	checkIfMoreThanOneWord();
	
	
	var queryURL = "http://www.omdbapi.com/?t=" + songOrMovie + "&y=&plot=short&apikey=trilogy";

	//This will output the following information to your terminal/bash window:

	
	request(queryURL, function(error, response, body) {

		
		if (!error && response.statusCode === 200) {

			var movieTitle = JSON.parse(body).Title;
			var yearReleased = JSON.parse(body).Year;
			var imdbRating = JSON.parse(body).imdbRating;
			var rtRating = JSON.parse(body).Ratings[1].Value;
			var movieCountry = JSON.parse(body).Country;
			var movieLanguage = JSON.parse(body).Language;
			var moviePlot = JSON.parse(body).Plot;
			var movieActors = JSON.parse(body).Actors;

			console.log("Title: " + movieTitle);
			console.log("Year Released: " + yearReleased);
			console.log("IMDB Rating: " + imdbRating);
			console.log("Rotten Tomatoes Rating: " + rtRating);
			console.log("Country Produced: " + movieCountry);
			console.log("Language(s): " + movieLanguage);
			console.log("Plot: " + moviePlot);
			console.log("Actors: " + movieActors);

			appendToFile("\r\nTitle: " + movieTitle + "\r\nYear Released: " + yearReleased + "\r\nIMDB Rating: " + imdbRating +
				"\r\nRotten Tomatoes Rating: " + rtRating + "\r\nCountry Produced: " + movieCountry +
				"\r\nLanguage(s): " + movieLanguage + "\r\nPlot: " + moviePlot + "\r\nActors: " + movieActors + "\r\n");
		}
	});
}

debugger;

// function if the title is more than one word 

function checkIfMoreThanOneWord() {

	if (command == "spotify-this-song" && !process.argv[3]) {
		songOrMovie = "I Want it That Way";
	}

	if (command == "movie-this" && !process.argv[3]) {
		songOrMovie = "Mr. Nobody";
	 }

	for (var i = 3; i < userInput.length; i++) {
		if (i > 3 && i < userInput.length) {
			songOrMovie = songOrMovie + "+" + userInput[i];
		} else {
			songOrMovie += userInput[i];
		}
	}
}

debugger;

function doWhatItSays() {

	fs.readFile("random.txt", "utf8", function(error, data) {

		
		if (error) {
			return console.log(error);
		}

		var dataArray = data.split(",");
		var commandNew = dataArray[0];
		songOrMovie = dataArray[1];

		switch(commandNew) {
		case "my-tweets":
		blursomeTweets();
		break;

		case "spotify-this-song":
		spotifyThisSong();
		break;

		case "movie-this":
		movieThis();
		break;

		case "do-what-it-says":
		doWhatItSays();
		break;
		}
	});
}

debugger;

function appendToFile(results) {
	fs.appendFile("log.txt", results, function(err) {

		
		if (err) {
			console.log(err);
		} else {
			console.log("Success!");
		}
	})
}
