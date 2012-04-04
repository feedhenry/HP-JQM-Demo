# FeedHenry jQuery Mobile Tutorial - Construct a list view to show tweets.

## Overview
In this tutorial we will add a new view for a Twitter feed page. You will learn to use models and further use of FeedHenry APIs.

* Integrate an app with Twitter to pull tweets with a specified username 
* Use the $fh.web() function to make a web request for your app

![](https://github.com/feedhenry/FH-Training-App-JQM/raw/master/docs/TwitterView.png)

## Step 1
To create the Twitter page in the app, go to the views folder (client/default/app/views) amd create a twitter.html file. Use the code below in this file.

		<div  class="header" data-role="header">
			<img src="./images/logo.png"/>
		</div>
		<div>
			<div id="scrollWrapper">
				<ul id="tweets">
			
				</ul>
			</div>
		</div>


## Step 2
Update the index.html page to add a reference to the Twitter page that we created.

`<div data-add-back-btn="true" data-role="page" class="page" id="twitter"></div>`


## Step 3
Ìn the models folder (client/default/app/models) create a tweets.js file and add the following code. Examine this code to see how it works.

		var tweets={
			data:[],
			load:function(callback){
				var that=this;
				$fh.act({
					"act":"getTweets",
					"secure":false
				},function(res){
					
					if (res && res.data){
						that.data=res.data;
						if (callback){
							callback(res.data);
						}
					}
				})
			},
			getData:function(callback){
				if (this.data===[]){
					this.load(callback);
				}else{
					if (callback){
						callback(this.data);
					}
				}
			}
		}


## Step 4
To populate our list with tweets we add the following function to the main.js file in our cloud directory. It will be invoked to populate the list automatically due to its proxy.

		/*
		 * Twitter
		 */
		function getTweets() {
		  var username   = 'feedhenry';
		  var num_tweets = 10;
		  var url        = 'http://search.twitter.com/search.json?q=' + username;

		  var response = $fh.web({
		    url: url,
		    method: 'GET',
		    allowSelfSignedCert: true
		  });
		  return {'data': $fh.parse(response.body).results};
		}


## Step 5
A handler function will now need to be included to allow navigation to the Twitter page and to define how the information is displayed. In the nav.js file in the controllers folder (client/default/app/controllers), add the folllowing code.

		twitter : function() {
		$.mobile.showPageLoadingMsg()
		tweets.load(function(data) {
			var tpl = '<img src="{0}"/><p>{1}</p>';
			var html = ""
			for(var i = 0; i < data.length; i++) {
				var d = data[i];
				//single data instance
				var profileUrl = d['profile_image_url'];
				var user = d['from_user'];
				var text = d['text'];
				html += "<li>";
				html += tpl.replace("{0}", profileUrl).replace("{1}", user + text);
				html += "</li>";

			}
			$("#twitter #tweets").html(html);
			$.mobile.hidePageLoadingMsg();
			changeView("twitter");

		});
	}


## Step 6
To create custom styles for the Twitter page, create a tweet.css file in the css folder (client/default/css). Add the following code to this file.

		#tweets {
			list-style: none;
			margin: 0;
			-webkit-padding-start: 0px;
		}
		#tweets li {
			padding-bottom: 6px;
			margin-bottom: 6px;
			border-bottom: 1px solid #ccc;
			padding-left: 15px;
			padding-right: 15px;
			clear: both;
			min-height: 50px;
		}
		#tweets img {
			float: left;
			margin-right: 10px;
		}
		#tweets p {
			line-height: 1.4em;
			-webkit-margin-before: 0;
			-webkit-margin-after: 0;
		}

This stylesheet then needs to be referenced in the Twitter page. Add the following to the top of the twitter.html file.

`<link rel="stylesheet" type="text/css" href="./css/tweet.css"/>`

![](https://github.com/feedhenry/FH-Training-App-JQM/raw/master/docs/Tweets.png)

Checkout the [v4 branch](https://github.com/feedhenry/FH-Training-App-JQM/tree/v4) to see the completed code.

Next step will introduce how to use remote SOAP services -- Credit card validation