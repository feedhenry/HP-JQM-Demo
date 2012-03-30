var creditCardController={
	validateCard:function(type,number){
		if (!type){
			alert("please choose a type!");
			return;
		}
		
		if (!number){
			alert("please input card number.");
			return;
		}
		$.mobile.showPageLoadingMsg()
		creditCard.validate(type,number,function(res){
			$.mobile.hidePageLoadingMsg();
			//update view with model response.
			alert(res.res);
		});
	}
}
