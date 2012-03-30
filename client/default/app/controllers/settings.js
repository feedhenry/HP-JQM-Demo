var settingsController={
	saveSettings:function(){
		var title=$("#title").val();
		var name=$("#name").val();
		var slider=$("#slider").val();
		var toggle=$("#toggle").val();
		$.mobile.showPageLoadingMsg();
		settings.save(title,name,toggle,slider,function(status){
			$.mobile.hidePageLoadingMsg()
			alert(status);
		});
	},
	loadSettings:function(){
		$.mobile.showPageLoadingMsg();
		settings.load(function(data){
			$.mobile.hidePageLoadingMsg();
			var title=data.title;
			var name=data.fullname;
			var toggle=data.toggle;
			var slider=data.slider;
			if (undefined == title || undefined==name || undefined ==toggle || undefined == slider){
				return;
			}
			//update view data
			$("#title").val(title).selectmenu('refresh');
			$("#name").val(name);
			$("#slider").val(slider).slider('refresh');
			$("#toggle").val(toggle).slider('refresh');
		});
	}
}
