/****** INITIAL GLOBAL VARIABLES ******/
var globalLat = 0;
var globalLon = 0;
var clicksRemaining = 15;
var userVacationScore = 0;

/****** END OF GLOBAL VARIABLES ******/

var googleInitializer = function (lat, lon) {
    initialize(globalLat, globalLon);
}

var defaultInput = [ [ "Asparagus",   "asparagus-2039__180.jpg", 5 ],
                     [ "Avocado",     "avocado-161822__180.png", 5 ],
                     [ "Cherries",    "bing-cherries-805416__180.jpg", 5 ],
                     [ "Turkey",      "blueMarinatedTurkey.jpg", 1 ],
                     [ "Condiments",  "condimentSprays.jpg", 2 ],
                     [ "CornDogs",    "cornDogs.jpg", 3 ],
                     [ "Candles",     "cranberryCandles.jpg", 2 ],
                     [ "CreamPuffs",  "cream-puffs-427181__180.jpg", 5 ],
                     [ "Egg",         "egg-157224__180.png", 4 ],
                     [ "Shrimp",      "frozenShrimp.jpg", 2 ],
                     [ "Casserole",   "frozenWhatAreThese.jpg", 1 ],
                     [ "Garlic",      "garlic-84691__180.jpg", 2 ],
                     [ "Soda",        "heatedSoda.jpg", 4 ],
                     [ "Jello",       "jelloMayoTurkey.jpg", 1 ],
                     [ "Fruit",       "kiwifruit-400143__180.jpg", 5 ],
                     [ "Mushrooms",   "mushrooms-756406__180.jpg", 4 ],
                     [ "Pasta",       "pasta-503952__180.jpg", 2 ],
                     [ "Tomato",      "tomatoes-320860__180.jpg", 5 ],
                     [ "Soup",        "whipcreamSoup.jpg", 2 ],
                     [ "Pepper",      "yellowpepper-22111__180.jpg", 3 ] ];

/* * * * * * * * * * * * * * * * * * *
* * * * * * CONSTRUCTORS  * * * * * *
* * * * * * * * * * * * * * * * * * */

function Picture( name, fileName, vacation ) {
    this.name = name;
    this.fileName = fileName;
    this.vote = 0;
    this.vacationPoints = vacation;
}

function JQImage( fileName, position ) {
    this.$element = $('<img></img>')
	   .attr( { 'src': "img/" + fileName,
		 'id':  position } )
	    .addClass( 'contestants' );
}

var VOTE_MODULE = (function() {

    var my = { };
    my.pictures = [ ];
    my.randomizedIndices = [ ];
    my.contestants = [ ];
    my.voteTotal = 0;
    my.chart = { };
    my.dailyForecasts = [ ];


    /* * * * * * * * * * * * * * * * * * *
     * * * * PUBLIC MODULE METHODS * * * *
     * * * * * * * * * * * * * * * * * * */

    my.pictures.init = function( initData ) {
    	for ( var ii=0; ii < initData.length; ii++ ) {
    	    var picture = new Picture( initData[ii][0],
          initData[ii][1],
				  initData[ii][2]);
    	    my.pictures.push( picture );
          my.voteTotal += picture.vote;
    	   }
       }

    my.generateRandomIndices = function( length ) {
	    var tempIndexArray = [ ];
	    for ( var ii = 0; ii < length; ii++ ) {
	       tempIndexArray.push( ii );
	      }
	    my.randomizedIndices = [ ];
	    while ( tempIndexArray.length > 0 ) {
	       var index = Math.floor( Math.random() * tempIndexArray.length );
	      // Splice() deletes an element from an array and returns it as a single
	     // element array. We dereference it and push onto our array of indices.
	       my.randomizedIndices.push( tempIndexArray.splice( index , 1 ) );
	      }
      }

    my.postNewPics = function() {
	// I'm gonna pop two indices so my array needs at least that many.
	// If there is 1 or 0, we start fresh with a new randomization.
	   if ( my.randomizedIndices.length < 2 ) {
	       my.generateRandomIndices( my.pictures.length );
	    }
	// Store left and right index
	   my.contestants = [ my.randomizedIndices.pop(), my.randomizedIndices.pop() ];
	// If the image tags exist, update their source tags. Otherwise, create them.
	   if ( $( '#left' )[0] && $( '#right' )[0] ) {
	       $( '#left' ).attr( 'src', "img/" +  my.pictures[ my.contestants[0] ].fileName );
	       $( '#right' ).attr( 'src', "img/" +  my.pictures[ my.contestants[1] ].fileName );
	   } else {
	       var $anchorNode = $( "#AnchorNode" );
	       var leftImage = new JQImage( my.pictures[ my.contestants[0] ].fileName, 'left' );
	       var rightImage = new JQImage( my.pictures[ my.contestants[1] ].fileName, 'right' );
	       $anchorNode.after( leftImage.$element );
	       $anchorNode.after( rightImage.$element );
	   }
	// We also need to update the chart
	   my.chartBuilder();
  }

    my.eventHandler = function() {
	// JQuery replacement of JavaScript code
        $("#left").on("click",function() {if(clicksRemaining == 0) { return; } else {my.click( "left" )} });
        $("#right").on("click",function() { if(clicksRemaining == 0) { return; } else {my.click( "right" )} } );
        $("#submitButton").on("click", function() { my.weather( $("#cityInput").val() ) } );
     }

    my.default = function() {
      clicksRemaining = 15;
      userVacationScore = 0;
      var clickCount = document.getElementById("clicksRemaining");
      clickCount.innerHTML= ("Number of Clicks Remaining: " + clicksRemaining);
      $( "#weatherShow" ).attr("id", "weatherHidden" );
      $( "#loser" ).attr("id", "loserHide" );
      $( "#winner" ).attr("id", "winnerHide" );
       $( "#chartHide" ).attr("id", "chart" );
       $( "#reset" ).attr("id", "resetHide" );
       $("#cityInput").val("");
       var street = document.getElementById( 'street-view' );
       street.parentNode.removeChild(street);
       $( "#MainBody" ).append( "<div id='street-view'></div>");
       if ( my.chart ) {
            my.chart.destroy()
           }
    }

    my.winner = function() {
        var paragraphWin = document.getElementById('score');
        paragraphWin.innerHTML = ("CONGRATS!!!! You won, you got a score of " +
        userVacationScore + " which exceeded the required 40 points. Your prize" +
        " is a vaction to wherever you want. Please enter the city you want to go to and" +
        " hit the submit button to see what the weather will be like and a street view of" +
        " your city. If you would like to restart the game simply start clicking pictures again.")
         $( "#winnerHide" ).attr("id", "winner" );
          $( "#chart" ).attr("id", "chartHide" );
    }

    my.loser = function () {
      var paragraphLost = document.getElementById("loserscore");
      paragraphLost.innerHTML = ("Unfortunately, you do not have very good taste in food but it's okay." +
    " We forgive you and will still send you on vaction to good ole Ketchikan, Alaska. If the picture below" +
    " doesn't want to make you jump out of chair with excitement, simply hit the reset clicker button and " +
    "make better choices when it comes to your taste in food. ");
    $( "#loserHide" ).attr("id", "loser" );
     $( "#chart" ).attr("id", "chartHide" );
    }

    my.click = function( position ) {
        if(clicksRemaining < 0) {
          return;
        }
        if( position == "left" ) {
            my.pictures[ my.contestants[0] ].vote++;
            my.voteTotal++;
	          clicksRemaining--;
	          userVacationScore += my.pictures[ my.contestants[0] ].vacationPoints;

        } else if( position == "right" ) {
            my.pictures[my.contestants[1]].vote++;
            my.voteTotal++;
	          clicksRemaining--;
	          userVacationScore += my.pictures[ my.contestants[1] ].vacationPoints;

        } else {
            console.log( " MODULE method my.click() was passes an invalid parameter" );
            return false;
        }

       var clickCount = document.getElementById("clicksRemaining");
       clickCount.innerHTML= ("Number of Clicks Remaining: " + clicksRemaining);
       if ( my.chart ) {
	          my.chart.destroy()
	         }
      my.postNewPics();
	    if( clicksRemaining == 0 ) {
	         if( userVacationScore > 50 ) {
               my.winner();
               $( "#resetHide" ).attr("id", "reset" );
              $("#reset").on("click", function() { my.default(); } );
	         } else {
		           my.loser();
		           my.weather("Ketchikan");
               $( "#resetHide" ).attr("id", "reset" );
              $("#reset").on("click", function() { my.default(); } );

	         }
	       }
        }

    my.chartBuilder = function() {
	// var canvasAnchor = document.getElementById( "myChart" ).getContext( "2d" );
	     var $canvasAnchor = $( "#myChart" ).get( 0 ).getContext( "2d" );
	     var leftContestant = my.pictures[ my.contestants[0] ];
	     var rightContestant = my.pictures[ my.contestants[1] ];
	     var contestantData = {
            labels: [ leftContestant.name, rightContestant.name ],
            datasets: [ { label:           "Raw votes",
			      fillColor:       "rgba(220,220,220,0.5)",
			      strokeColor:     "rgba(220,220,220,0.8)",
			      highlightFill:   "rgba(220,220,220,0.75)",
			      highlightStroke: "rgba(220,220,220,1)",
			      data: [ leftContestant.vote, rightContestant.vote ]
			      },
			      { label:           "Percentage split",
			      fillColor:       "rgba(151,187,205,0.5)",
			      strokeColor:     "rgba(151,187,205,0.8)",
			      highlightFill:   "rgba(151,187,205,0.75)",
			      highlightStroke: "rgba(151,187,205,1)",
			      data: [ leftContestant.vote/( leftContestant.vote + rightContestant.vote ),
				    rightContestant.vote/( leftContestant.vote + rightContestant.vote ) ]
			      }
		      ]
	     };
	     my.chart = new Chart($canvasAnchor).Bar(contestantData);
    }

    my.weatherChartBuilder = function() {

	    var $weatherChartAnchor = $( "#weatherChart" ).get( 0 ).getContext( "2d" );
	    var dailyLabels = [ ];
	    var dailyTemps = [ ];
	    console.log(my.dailyForecasts[0]);
	    for (var ii = 0; ii < 7; ii++ ) {
	       dailyLabels.push( my.dailyForecasts[ii].date );
	       dailyTemps.push( my.dailyForecasts[ii].temp );
	      };
	    var weatherChartData = {
         labels: dailyLabels,
         datasets: [ { label:           "Temperature",
			   fillColor:       "rgba(220,220,220,0.5)",
			   strokeColor:     "rgba(220,220,220,0.8)",
			   highlightFill:   "rgba(220,220,220,0.75)",
			   highlightStroke: "rgba(220,220,220,1)",
			   data: dailyTemps
			    } ]
	      };
	    my.chart = new Chart( $weatherChartAnchor ).Bar( weatherChartData );
    }

   my.weather = function(city) {
	   var cityName = city;
	   var daysCount = 7;
	   var weatherURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q="
	                 + cityName + "&cnt=" + daysCount
	                 + "&units=imperial&APPID=ee8ca027aca5a5ddd4994e6a9dcca05c";
	   $.ajax( { url: weatherURL } )
	     .done( function( weatherData ){
		   var city = weatherData.city.name;
		   var country = weatherData.city.country;
		   var description = weatherData.list[0].weather[0].description;
		   globalLat = weatherData.city.coord.lat;
		   globalLon = weatherData.city.coord.lon;
		   for ( var ii = 0; ii < daysCount; ii++ ) {
		     var temp = weatherData.list[ii].temp.day;
		     var description = weatherData.list[ii].weather[0].description;
		     var dateAndTime =  weatherData.list[ii].dt;
		     var date = new Date( dateAndTime * 1000 );
		     my.dailyForecasts.push(
			      { temp: temp,
			      description: description,
			      date: date.toDateString() } );
		     }
		     my.weatherChartBuilder();
		     googleInitializer(globalLat, globalLon);

	     })
      }


    /***********************************
     ***** Stuff Gets Called Here ******
     ***********************************/

    my.pictures.init( defaultInput );
    my.postNewPics();
    my.eventHandler();

    return my;

} )();
