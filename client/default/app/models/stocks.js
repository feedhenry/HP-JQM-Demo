var stocks={
  
	getStockInfo:function(name, callback){
		if (name &&name!=""){
			$fh.act({
				act : 'getStockInfo',
				secure : false,
				req : {
					name:name
				}
			}, function(res) {
        if (typeof callback !== 'undefined') {
          callback(res);
        }
        /*
				console.log(res);
				//return res;
				if (res.stockInfo){
				 	var stockInfoXmlStr=res.stockInfo;
				 	var stockSymbol=res.stockSymbol;
				 	$("#stockSymbol").text("Stock:"+stockSymbol);
				 	$("#stockInfo").text(stockInfoXmlStr);
				}
        $.mobile.hidePageLoadingMsg();
        */
			},
				function(code,errorprops,params) {
					loading(false);
					alert("Error. Please try again.");
			});
		}
	}
  
}