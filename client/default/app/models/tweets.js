var tweets={
	data:[],
	load:function(callback){
		var that=this;
		$fh.act({
			"act":"getTweets",
			"secure":false
		},function(res){
			
			if (res && res.data){
				that.data=res.data;
				if (callback){
					callback(res.data);
				}
			}
		})
	},
	getData:function(callback){
		if (this.data===[]){
			this.load(callback);
		}else{
			if (callback){
				callback(this.data);
			}
		}
	}
}
