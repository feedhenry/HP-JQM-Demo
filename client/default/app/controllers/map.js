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
