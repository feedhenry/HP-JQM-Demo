var creditCard = {
	data : [],
	validate : function(type, number, callback) {
		var that = this;
		if(number.length != 16) {
			if(callback) {
				callback({
					res : "Card Number should be 16 digits"
				});
			}
			return;
		}
		$fh.act({
			act : "payment",
			req : {
				cardType : type,
				cardNumber : number
			}
		}, function(res) {
			var regEx = new RegExp("<\s*string[^>]*>(.*?)<\s*/\s*string>", "g");
			var result = regEx.exec(res.body)[1];
			if (callback){
				callback({res:result});
			}
		})
	}
}