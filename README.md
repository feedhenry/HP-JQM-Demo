# Preparation

Before any Application code, we need to prepare our working environment.

Create an empty folder. Init git repository in that folder.

##Step 1 -- Feedhenry App structure:

* Create "client" folder at /: client folder will be storing all client-side source files.
* Create "cloud" folder at /: cloud folder will be storing all cloud-side source files.
* (Optional) Create "share" folder at /: scripts in share folder will be used by both client and cloud. Share folder is not used in this tutorial.
* Create "default" folder at /client: default pakcage that client-side will use.

##Step 2 -- Client-side structure:

* Create "index.html" file at /client/default: index.html is the main entry file for client. Put simple html content in:

		<!DOCTYPE html>
		<html>
			<head>
			</head>
			<body>
		
			</body>
		</html>

* Create "js" folder at /client/default: js (javascript) folder will contain used Javascript library and utility files.
* Create "app" folder at /client/default: app folder will contain client app logic( Model, View and Controller).
* Create "css" folder at /client/default: css folder contains CSS files.
* Create "images" folder at /client/default: images folder contains images file used by app.
* Create "controllers" folder at /client/default/app: App controller files go here.
* Create "views" folder at /client/default/app: App view related files.
* Create "models" folder at /cilent/default/app: App models.
* Create "events" folder at /client/default/app: DOM events handlers.
* Create "bind.js" file in /clint/default/app/events: All DOM events will be bound/triggered here.
* Create "init.js" file in /client/default/app/js: init.js is used to initialise the app.


##Step 3 -- import necessary libraries (jQuery & jQuery Mobile):

* Download latest jQuery Library from http://jquery.com. Import jQuery Script to index.html.
* Download latet jQuery Mobile Library from http://jquerymobile.com/download/: Import jQuery Script and CSS file to index.html

##Step 4 -- MVC essential code:

* Create "viewutil.js" file at /client/default/app/js: it helps with some tedious and repeated view managing work. Put following code:
		
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

##Step 5 -- Link all files to index.html

Content of index.html:

		<!DOCTYPE html>
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
				<meta name = "viewport" content = "width = device-width, height=device-height, initial-scale=1.0, user-scalable=no"/> 
		
				<script type="text/javascript" src="./js/jquery.min.js"></script>
				<script type="text/javascript" src="./js/jquery.mobile.min.js"></script>
				<script type="text/javascript" src="./js/viewutil.js"></script>
				<script type="text/javascript" src="./js/init.js"></script>
				<script type="text/javascript" src="./app/events/bind.js"></script>
			</head>
			<body>
		
			</body>
		</html>

-----

Next Step: 
[v1 branch](https://github.com/feedhenry/FH-Training-App-JQM/tree/v1), constuct app navigation structure.

