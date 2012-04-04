# FeedHenry jQuery Mobile Tutorial - Getting to v6

## Overview
For this part of the tutorial we will create a page with access to the camera. The FeedHenry Camera API, $fh.cam(), is used to do this

* Learn to use $fh.cam()

![](https://github.com/feedhenry/FH-Training-App-JQM/raw/master/docs/CameraView.png)


## Step 1
First we need to create our controller for the Camera. This will be a function contained within nav.js in controllers (client/default/app/controllers). It will contain a call to the $fh.cam() API call. you can read more about the camera API [here](http://docs.feedhenry.com/api-reference/camera/). The following code is used to create our camera controller.

		camera : function() {
				$fh.cam({
					act : 'picture',
					uri : true
				}, function(res) {
					if(res.uri) {
						// Store the filepath to the image
						var pathToImage = res.uri;

						// Change the view
						changeView("camera");
						// Update the view
						$("#camera .content img").attr("src", pathToImage);
					}
				});
		},



## Step 2
Now we need to create the page that will be populated with our captured image. It should have the same basic structure as previous pages.

		<div  class="header" data-role="header">
			<img src="./images/logo.png"/>
		</div>
		<div class="content">
			<img />
		</div>


## Step 3
Now that we have our code completed we need to update index.html to include our new files. Add the following line under the body tag.

	`<div data-add-back-btn="true" data-role="page" class="page" id="camera"></div>`

Checkout the [v6 branch](https://github.com/feedhenry/FH-Training-App-JQM/tree/v6) to see the completed code.

Next step of tutorial will introduce how to use webview to open external web pages.

