var stocksController={
  
	validateStock:function(){
		var name = $('#compName').val();
		if (!name){
			alert("Please enter company name.");
			return;
		}
		$.mobile.showPageLoadingMsg();
    
		stocks.getStockInfo(name, function(res) {
      console.log("result from stocksController")
  	  console.log(res);
      
      var element = [];
    
      $.each(res.stockInfo, function(index, value) {
        console.log(index);
        console.log(value);
        
        element.push('<li>' + index + ': ' + value + '</li>');
      });	
      
      $("#stockSymbol").html("Stock: " + res.stockSymbol);
      $('#stockInfo').html(element.join(''));
      $('#stockInfo').listview('refresh')
      
      $.mobile.hidePageLoadingMsg();
		});
	}
  
}
