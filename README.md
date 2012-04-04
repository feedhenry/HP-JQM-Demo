# FeedHenry jQuery Mobile Tutorial - Navigation structure

## Overview
This tutorial will tell how does the app navigation work by:

* View: Render two buttons (google map and twitter) to home view.
* Controller: Add event listener to navigation buttons. Send user action messages to controller.
* App initialisation: Display view.


## View: Render two buttons in home view
### Step 1 -- Create Home view

* Add home view placeholder in index.html

		<div data-role="page" class="page" id="home"></div>
		
* Create home.html in /client/default/app/views (the id of the placeholder above should equal to the name prefix of the file)	

The content in home.html will be imported to the placeholder defined in index.html while app starts up.

### Step 2 -- Add Navigation buttons' HTML code.

In the home.html file in the views directory, add the following code to the content div:

            <div>
                  <ul id="menu">
                        <li id="map">
                              <div></div>
                        </li>
                        <li class="spacer"><div></div></li>
                        <li id="twitter">
                              <div></div>
                        </li>
                        
                  </ul>
            </div>

This will add the Google Maps and Twitter icons to the home view. 

### Step 3 -- Assign CSS.

* Create home.css
* Put following content:

		
		#menu{
			list-style:none;
			width:280px;
			margin:20px auto;
			clear:both;
		}
		
		#menu li{
			float:left;
			margin-top:20px;
		}
		
		#menu li div{
			width:100px;
			height:100px;
		}
		
		#menu li.spacer div{
			width:60px;
		}
		#menu li div::after,#menu li div::before{
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
		-webkit-user-select: none;
		-webkit-text-size-adjust: none;
		-webkit-touch-callout: none;
		-webkit-tap-highlight-color: rgba(0,0,0,0);
		}
		#menu #map div{
               background:url(../images/icons/maps_icon.png) no-repeat;
               background-size:100% 100%;
        }

        #menu #twitter div{
              background:url(../images/icons/twitter_icon.png) no-repeat;
              background-size:100% 100%;
        }
		
* Link home.css to home.html:
		
		<link rel="stylesheet" type="text/css" href="./css/home.css"/>
		
* Resources used (like maps_icon.png) could be found from google.


## Controller: Events handling and message dispatching

Open bins.js in /client/default/app/events folder, put following code:

		function bindEvent(){
              //homepage menu click event
              $("#menu li").bind("click",function(){
                    var id=$(this).attr("id");
                    if (id!=undefined){
                          nav[id]();
                    }
              });

        }
        



## Initialise

In init.js in /client/default/js folder. Put following code:

		//on document is loaded
		$(document).ready(function() {
			importViews(function() {
				changeView("home");
				bindEvent();
			});
		});


Checkout the [v2 branch](https://github.com/feedhenry/FH-Training-App-JQM/tree/v2) to see the completed code.
Next step will introduce how to implment google map.
