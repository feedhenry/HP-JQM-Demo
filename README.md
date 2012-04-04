# FeedHenry jQuery Mobile Tutorial - Google Map Implementation

## Overview
In this tutorial we will add a new page for the Google Maps page. You will learn the following:

* Integrate an app with the Google Maps API
* Learn to use FeedHenry APIs

![](https://github.com/feedhenry/FH-Training-App-JQM/raw/master/docs/MapView.png)

## Step 1
Create a file called googleMap.html in the views folder (client/default/app/views) and add the following code to create the Maps page:

                    <link rel="stylesheet"  type="text/css" href="./css/map.css"/>
	    <!-- Google Maps API -->
	    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"></script>


	    <div  class="header" data-role="header">
	        <img src="./images/logo.png"/>
	    </div>
	    <div class="relative">
	    <div id="mapCanvas">

	    </div>
	    </div>


## Step 2
Update the index.html page to add a reference to the Google Maps page that we created.
		
		<div data-add-back-btn="true" data-role="page" class="page" id="googleMap"></div>


## Step 3
In the models folder (client/default/app/models), create a map.js file and add the following code. Examine the code and comments to see how it works.

		var mapModel = {
			data : null,
			//load local points first and compare hash value with cloud retrieved data. update if cloud version has updated.
			loadPoints : function(callback) {
				var that = this;
				$fh.data({
					key : 'points'
				}, function(res) {
					if(res.val === null) {// No client data found
						that.data={};
						that.data.hash="";
					} else {
						var cache = JSON.parse(res.val);
						that.data = cache;
					}
					var hash = that.data.hash;
					$fh.act({
						act : 'getPoints',
						req : {
							hash : hash,
							timestamp : new Date().getTime()
						}
					}, function(res) {
						that.data = res;
						if(hash && hash === res.hash) {
							console.log("Client data is at the latest version");
						} else {
							$fh.data({
								act : 'save',
								key : 'points',
								val : JSON.stringify(res)
							});

						}
						if(callback) {
							callback(that.data);
						}
					});
				});
			}
		}


## Step 4
In the controllers directory create a new file called 'map.js' with the following code. This file contains code that controls the map
functionality. This uses some of the FeedHenry APIs such as 'fh.data' for loading stored map points from local storage. Examine this 
file closely and read the API information [here](http://docs.feedhenry.com/api-reference/)

		var mapController = {
			markers : [], // Keep track of any map markers
			map : null,
			renderMap : function() {
				var that = this;
				if($("#mapCanvas").children().length == 0) {
					$("#mapCanvas").height($(window).height() - $(".header").height());
					$fh.map({
						target : '#mapCanvas',
						lat : -34.397,
						lon : 150.644,
						zoom : 11
					}, function(map) {
						that.map=map.map;
						var map = that.map;
						setTimeout(function() {
							that.getLocation();
							mapModel.loadPoints(function(res) {
								for(var i = 0; i < res.data.locations.length; i++) {
									var point = res.data.locations[i];
									var pos = new google.maps.LatLng(point.lat, point.lon);
									that.markers.push(new google.maps.Marker({
										position : pos,
										map : map,
										icon : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + (i + 1) + '|FF0000|000000'
									}));
								}

							});
						}, 800);

					}, function(msg) {
						console.log(msg);
					});
					
					
				}
			},
			/*
			 * Get the users location and draw a marker at their location
			 */
			getLocation : function() {
				// Instance of the google map
				var map = this.map;
				var pos = {};
				var that = this;
				$fh.geo({
					interval : 0
				}, function(res) {
					pos = new google.maps.LatLng(res.lat, res.lon);
					map.setCenter(pos);

					// Create a marker at the current location
					that.markers.push(new google.maps.Marker({
						position : pos,
						map : map,
						icon : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=0|00FF00|000000'
					}));

				}, function() {
					// We failed to get the users geolocation, fallback to geo ip
					alert("$fh.geo failed");
					alert(JSON.stringify(res.geoip));
				});
			}
		};


## Step 5
Now we are going to implement the Cloud features of the FeedHenry platform. You might have noticed in the Map controller we call the 
FeedHenry $fh.act() call. This allows us to call a function from the server (cloud), read more about this [here](http://docs.feedhenry.com/api-reference/actions/). In the cloud directory add the following code to the main.js file. Functions in the Cloud directory can be called from devide via a $fh.act() call.

		/*
		 * Maps
		 */
		// Cache points for 10 seconds
		var CACHE_TIME = 30;
		var MARKERS = {
		  locations: [
		    {
		      lat: '52.245671',
		      lon: '-7.080002'
		    },
		    {
		      lat: '52.257861',
		      lon: '-7.136993'
		    }
		  ]
		};

		function getCachedPoints() {
		  var ret = $fh.cache({
		    "act": "load",
		    "key": "points"
		  });
		  return ret.val;
		}

		function cachePoints(hash, data) {
		  var obj = {
		    "hash": hash,
		    "data": data,
		    "cached": true
		  };
		  $fh.cache({
		    "act": "save",
		    "key": "points",
		    "val": obj,
		    "expire": CACHE_TIME
		  });
		}

		function getPoints() {
		  var response = {};
		  var cache    = getCachedPoints();

		  if (cache.length === 0) {
		    var data = MARKERS;
		    var hash = $fh.hash({
		      algorithm: 'MD5',
		      text: $fh.stringify(data)
		    });

		    // Cache the data
		    cachePoints(hash, data);

		    // Build the response
		    response = {'data': data, 'hash':hash, 'cached':false};
		  } else {
		    // Parse the cached data
		    cache = $fh.parse(cache);

		    if( $params.hash && $params.hash === cache.hash ) {
		      // Client data is up to date
		      response = {'hash':$params.hash, 'cached':true};
		    } else {
		      // Hash value from client missing or incorrect, return cached cloud data
		      response = cache;
		    }
		  }
		  return response;
		}


## Step 6
Update the references to these new files in the index.html page so that jQuery Mobile is aware of them.

To the body section add:

`<div data-add-back-btn="true" data-role="page" class="page" id="googleMap"></div>`

To the models section add: 

`<script type="text/javascript" src="./app/models/map.js"></script>`


## Step 7
A handler function will now need to be included to allow navigation to the map view. In the controllers folder (client/default/app/controllers), create a file called nav.js and add the following code:

		var nav = {
			map : function() {
			changeView("googleMap");
			mapController.renderMap();
			}
		}

Again, this file will have to be referenced, so in index.html add the following to the controllers section:

`<script type="text/javascript" src="./app/controllers/nav.js"></script>`


## Extra Task
In the 'main.js' file found in the cloud directory, find the following code snippet.

		var MARKERS = {
		  locations: [
		    {
		      lat: '52.245671',
		      lon: '-7.080002'
		    },
		    {
		      lat: '52.257861',
		      lon: '-7.136993'
		    }
		  ]
		};

Change the longitude and latitude values and then view the map page. The markers on the page should now be located in a new position.

Checkout the [v3 branch](https://github.com/feedhenry/FH-Training-App-JQM/tree/v3) to see the completed code.

Next will introduce how to implement a list view using twitter resource.