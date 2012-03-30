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