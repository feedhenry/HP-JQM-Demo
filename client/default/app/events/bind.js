function bindEvent(){
	//homepage menu click event
	$("#menu li").bind("click",function(){
		var id=$(this).attr("id");
		if (id!=undefined){
			nav[id]();
		}
	});
	
}


