# FeedHenry jQuery Mobile Tutorial - Getting to v8

## Overview
This part of the tutorial will teach you how to use save and load setting from the device local storage using the $fh.data() API call. More information on this API call can be found [here](http://docs.feedhenry.com/api-reference/local-storage/). After completing this tutorial you will be able to:

* Save and load data from local storage on a device
* Use the $fh.data() function
* Use many types of input fields and components.

![](https://github.com/feedhenry/FH-Training-App-JQM/raw/master/docs/SettingsView.png)


## Step 1
First we develop our controller for settings. The purpose of the controller is to save and load our settings from local storage when the settings view is called. $fh.data has 3 possible parameters for 'act' - these are: remove, save, and load. A key is also required because $fh.data() works on a key value pair.

A new file, settings.js should be created in the controllers folder (client/default/app/controllers) and the following code copied in.

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


## Step 2
A settings.js file must now be created in the models folder (client/default/app/models) and the following code used

		var settings = {
			data : {},
			load : function(callback) {
				var that=this;
				$fh.data({
					act : 'load',
					key : 'settings'
				}, function(res) {
					if(res.val === null){
						if (callback){
							callback({});
							return;
						}
					}
					that.data=res;
					var settings = JSON.parse(res.val);
					
					if (callback){
						callback(settings);
					}
				});
			},
			save : function(title,name,toggle,slider,callback) {
				var settings = {
					title : title,
					fullname : name,
					toggle : toggle,
					slider : slider
				};

				// Save to local storage
				$fh.data({
					act : 'save',
					key : 'settings',
					val : JSON.stringify(settings)
				});
				if (callback){
					callback('Your settings have been saved.');
				}
				
			}
		}



## Step 3
Now we need to create a page for settings. This will be a form containing multiple input types; feel free to use any you like for now. We will read the value of these inputs which will be saved as the 'settings' key value by the controller. An example of a settings page is shown below.

		<link rel="stylesheet" type="text/css" href="./css/settings.css"/>
		<div class="header" data-role="header">
			<img src="./images/logo.png"/>
		</div>
		<div class="content">
			<div data-role="fieldcontain">
			<h3>Personal Info</h3>
			
			<label for="title">Title</label>
			<select name="title" id="title">
				<option value="mr">Mr</option>
				<option value="ms">Ms</option>
			</select>
			<label for="name">Name</label>
			<input type="text" name="name" id="name" value=""  />
			</div>
			<p class="info">
				Please enter the payment information above.
			</p>
			<div data-role="fieldcontain">
			<h3>App Config</h3>
			<label for="slider">Slider:</label>
			<input type="range" name="slider" id="slider" value="25" min="0" max="100" step="5" />
			<label for="toggle">Toggle Switch:</label>
			<select name="slider" id="toggle" data-role="slider">
				<option value="off">Off</option>
				<option value="on">On</option>
			</select>
			</div>
			<div data-role="button" id="saveSetting">Save Settings</div>
		</div>

This page also needs to be referneced in the index.html page.

		<div data-add-back-btn="true" data-role="page" class="page" id="settings"></div>

Checkout the [v8 branch](https://github.com/feedhenry/FH-Training-App-JQM/tree/v8) to see the completed code.