function bindEvent(){

	//homepage menu click event
	$("#menu li").bind("click",function(){
		var id=$(this).attr("id");
		if (id!=undefined){
			nav[id]();
		}
	});
	
	//creditcar validate click event
	$("#creditcard #validateCard").bind("click",function(){
		var type=$("#cardType").val();
		var num=$("#cardNum").val();
		creditCardController.validateCard(type,num);
	});

	//stocks submit click event
	$("#stocks #stockSubmit").bind("click",function(){
		var num=$("#compName").val();
		stocksController.validateStock(name);
	});
	
	//save setting click event
	$("#settings #saveSetting").bind("click",function(){
		settingsController.saveSettings();
	});
}


