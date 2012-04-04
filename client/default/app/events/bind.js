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
	
}


