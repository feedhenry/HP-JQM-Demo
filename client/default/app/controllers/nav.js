var nav = {
	map : function() {
		changeView("googleMap");
		mapController.renderMap();
	},
	twitter : function() {
		$.mobile.showPageLoadingMsg()
		tweets.load(function(data) {
			var tpl = '<img src="{0}"/><p>{1}</p>';
			var html = ""
			for(var i = 0; i < data.length; i++) {
				var d = data[i];
				//single data instance
				var profileUrl = d['profile_image_url'];
				var user = d['from_user'];
				var text = d['text'];
				html += "<li>";
				html += tpl.replace("{0}", profileUrl).replace("{1}", user + text);
				html += "</li>";

			}
			$("#twitter #tweets").html(html);
      
			$.mobile.hidePageLoadingMsg();
			changeView("twitter");

		});
	},
	creditcard : function() {
		changeView("creditcard");
	},
	camera : function() {
		$fh.cam({
			act : 'picture',
			uri : true
		}, function(res) {
			if(res.uri) {
				// Store the filepath to the image
				var pathToImage = res.uri;

				// Change the view
				changeView("camera");
				// Update the view
				$("#camera .content img").attr("src", pathToImage);
			}
		});
	},
	webview : function() {
		$fh.webview({
			title : 'FeedHenry',
			url : 'http://www.feedhenry.com/'
		});
	},
  stocks: function() {
    changeView('stocks');
  },
	settings : function() {
		changeView("settings");
		settingsController.loadSettings();
	}
}