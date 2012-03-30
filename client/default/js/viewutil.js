/**
 * Since HTML/DOM manipulating is a repeated and tedious work,We write some functions here to help us out of that
 *  
 * 
 */



/**
 * 	 hide last view (div) and Load next view(div). View is specified by id.
 */
var lastView = null;
function changeView(viewId) {
	$.mobile.changePage(getView(viewId),{ transition: "slide"});
}

/**
 *  get view with specified id
 * 
 */
function getView(viewId){
	return $("body>#"+viewId);
}

/**
 * import views html content to DOM.
 */
function importViews(callback){
	var pages=$("body>.page");
	var viewFolder="./app/views/";
	var count=pages.length;
	pages.each(function(){
		var page=$(this);
		var path=viewFolder+page.attr("id")+".html";
		$.ajax({
			url:path,
			dataType:"text",
			success:function(res){
				console.log(page.attr("id"));
				$("body>#"+page.attr("id")).html(res);
				count--;
				if (count===0 && callback){
					callback();
				}
			},
			error:function(){
				count--;
				if (count===0 && callback){
					callback();
				}
			}
		});
	});
}
