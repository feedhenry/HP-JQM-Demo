//on document is loaded
$(document).ready(function() {
	importViews(function() {
		changeView("home");
		bindEvent();
	});
});
