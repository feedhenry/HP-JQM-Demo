var settings = {
	data : {},
	load : function(callback) {
		var that=this;
		$fh.data({
			act : 'load',
			key : 'settings'
		}, function(res) {
			if(res.val === null){
				if (callback){
					callback({});
					return;
				}
			}
			that.data=res;
			var settings = JSON.parse(res.val);
			
			if (callback){
				callback(settings);
			}
		});
	},
	save : function(title,name,toggle,slider,callback) {
		var settings = {
			title : title,
			fullname : name,
			toggle : toggle,
			slider : slider
		};

		// Save to local storage
		$fh.data({
			act : 'save',
			key : 'settings',
			val : JSON.stringify(settings)
		});
		if (callback){
			callback('Your settings have been saved.');
		}
		
	}
}