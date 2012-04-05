# FeedHenry jQuery Mobile Tutorial - Getting to v7

## Overview

'git checkout v6' to get the starting code for this section.

In this tutorial we will adding a new view for a stocks mash up. This will demonstrate the use of other API's in the app.

* Yahoo Finance: Look up company stock symbol using company name.

* Yahoo API: http://d.yimg.com/autoc.finance.yahoo.com/autoc?query={0}&callback=YAHOO.Finance.SymbolSuggest.ssCallback

* WebServiceX: Retrieve company information based on stock symbol.

* WebServiceX API: http://www.webservicex.net/stockquote.asmx

#### Steps taken
* Create stock.js, xmlToJson.js and util.js in cloud folder
* Create a new stock view, update model and controller in client.


![](https://github.com/feedhenry/HP-JQM-Demo/raw/master/docs/Stocks.png)

## Step 1 - Client Side (View)
Begin by creating the stokcs.html file in the views folder (client/default/app/views) and add the following code.

		/**
		 * stocks.html View
	 	**/
		<link rel="stylesheet" type="text/css" href="./css/stocks.css"/>
		<div  class="header" data-role="header">
			<img src="./images/logo.png"/>
		</div>

		<div class="content">

			<h2>Seach for stock info</h2>
			<h4>Do a mash-up on stocks</h4>
			<label for="compNam">Company Name</label>
			<input type="text" name="compName" id="compName" value=""  />
			
			<p class="info">Enter company name above to perform a mash-up</p>
			<div data-role="button" id="stockSubmit">Submit</div>
			<h4 id="stockSymbol"></h4>
		  
			<!--<div id="stockInfo"></div-->
		  <ul id="stockInfo" data-role="listview" data-inset="true" data-theme="c"></ul

		</div>

## Step 2 - Client Side (index.html)

Update the index.html page to add a reference to the stocks page that we created.

		/**
		 * index.html
	 	**/
		<div data-add-back-btn="true" data-role="page" class="page" id="stocks"></div>

## Step 3 -- Client side (Model)
In the models folder (client/default/app/models), create a stocks.js file and add the following code. Examine the code to see how it works.

	 /**
	 * stocks.js Model
	 **/

	var stocks={
  
		getStockInfo:function(name, callback){
			if (name &&name!=""){
				$fh.act({
					act : 'getStockInfo',
					secure : false,
					req : {
						name:name
					}
				}, function(res) {
	        if (typeof callback !== 'undefined') {
	          callback(res);
	        }
				},
					function(code,errorprops,params) {
						loading(false);
						alert("Error. Please try again.");
				});
			}
		}
	}

## Step 4 -- Client side (Controller)
Now we need to add the necessary controllers for the functionality of the stocks section. The controller relies on a cloud call which is done using $fh.act(). The function called from the cloud is getStockInfo as specified by 'act: getStockInfo'. Create a stocks.js file in the controllers folder and paste in the folowing code.

	 /**
	 * stocks.js Controller
	 **/

	var stocksController={
	  
		validateStock:function(){
			var name = $('#compName').val();
			if (!name){
				alert("Please enter company name.");
				return;
			}
			$.mobile.showPageLoadingMsg();
	    
			stocks.getStockInfo(name, function(res) {
	      console.log("result from stocksController")
	  	  console.log(res);
	      
	      var element = [];
	    
	      $.each(res.stockInfo, function(index, value) {
	        console.log(index);
	        console.log(value);
	        
	        element.push('<li>' + index + ': ' + value + '</li>');
	      });	
	      
	      $("#stockSymbol").html("Stock: " + res.stockSymbol);
	      $('#stockInfo').html(element.join(''));
	      $('#stockInfo').listview('refresh')
	      
	      $.mobile.hidePageLoadingMsg();
			});
		}
	}

## Step 5 -- Client side (Nav)
A handler function will now need to be included to allow navigation to the Payment page. In the nav.js file, add the following code.

	 /**
	 * nav.js Controller
	 **/

	stocks: function() {
	    changeView('stocks');
	}

## Step 6 -- Cloud side (main.js)
The stocks function now needs to be added to our cloud functions in main.js in the cloud directory. This function will perform a call to the stocks.js file with the parameters provided by our $fh.act call in the stocks file in the controllers folder.

	/**
	 * Get stock symbol and detailed information by company name
	 */
	function getStockInfo(param) {
	  return stock.getStockInfo(param.name);
	}

## Step 7 -- Cloud side (main.js)
create stock.js in cloud folder and put the following code inside:

	/**
	 * Mash multiple business apis returned data.
	 * Stock Symble lookup: Using YAHOO API. JSONP
	 * Stock Info lookup: Using WebServiceX API . SOAP
	 *
	 **/

	    var stock = {
	        //YAHOO finance api for looking up stock symbol with a company name. It is a JSONP service.
	        yahooApi : "http://d.yimg.com/autoc.finance.yahoo.com/autoc?query={0}&callback=YAHOO.Finance.SymbolSuggest.ssCallback",
	        //WebServiceX API (Open API). It returns stock details with specific stock symbol.
	        webServiceXApi : "http://www.webservicex.net/stockquote.asmx",
	        /**
	         * The function will look for stock symbol based on "name" param, and return stock info from WebServiceX
	         *
	         * Return stock information.
	         */
	        getStockInfo : function(name) {
	            //Compose request url using user input.
	            var yahooApiUrl = this.yahooApi.replace("{0}", name);
	            /*
	             * Perform Webcall
	             * Raw response from YAHOO JSONP api which contains stock symbol as well as other information we do not want.
	             *
	             */
	            var symbolRes = $fh.web({
	                url : yahooApiUrl,
	                method : "GET",
	                charset : "UTF-8",
	                period : 3600
	            });

	        //Clear up YAHOO response and only keep the information "stock symbol" we need.
	        var stockSymbol = this.processSymbolRes(symbolRes);

	        // construct SOAP envelop. We could do this manually or just use a Javascript Library.
	        var soapEnvolope = '<?xml version="1.0" encoding="utf-8"?>' + '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' + '<soap:Body>' + '<GetQuote xmlns="http://www.webserviceX.NET/">' + '<symbol>' + stockSymbol + '</symbol>' + '</GetQuote>' + '</soap:Body>' + '</soap:Envelope>';

	        //Retrieve SOAP url
	        var stockInfoUrl = this.webServiceXApi;

	        //Prepare webcall parameters
	        var opt = {
	            url : stockInfoUrl,
	            method : "POST",
	            charset : "UTF-8",
	            contentType : "text/xml",
	            body : soapEnvolope,
	            period : 3600
	        }

	        //Perform webcall
	        var stockInfoSoapRes = $fh.web(opt);

	        //getSOAPElement will retrieve specific XML object within SOAP response
	        var body=stockInfoSoapRes.body.replace(/&lt;/g,"<").replace(/&gt;/g,">");
	        var xmlData = getSOAPElement("GetQuoteResult", body);

	        var xmlObj=xml(xmlData);

	        //Create Object
	        var stockInfo={
	          Symbol:xmlObj.find("Symbol").text(),
	          Last:xmlObj.find("Last").text(),
	          Open:xmlObj.find("Open").text(),
	          "Date":xmlObj.find("Date").text(),
	          Time:xmlObj.find("Time").text(),
	          Change:xmlObj.find("Change").text(),
	          Name:xmlObj.find("Name").text()
	        }

	        //mash up the data and return to client.
	        return {
	            stockSymbol : stockSymbol,
	            stockInfo :stockInfo
	    };
	    },

	    /**
	     * Process Response from YAHOO stock symbol api.
	     * It will clear up the response and only return stock symbol as string.
	     */
	    processSymbolRes : function(res) {
	        var resBody = res.body;
	        var removedHeadRes = resBody.replace("YAHOO.Finance.SymbolSuggest.ssCallback(", "");
	        //remove jsonp callback header
	        var removedTailRes = removedHeadRes.substr(0, removedHeadRes.length - 1);
	        //remove jsonp callback bracket
	        var resObj = $fh.parse(removedTailRes);
	        //parse result to JSON object
	        return resObj.ResultSet.Result[0].symbol;
	        //return the first matched stock symbol
	    }
	}

We also use a XML to JSON parser and a util.js file. Make sure to add these also.

## Step 8 -- Client side (bind.js)
A handler must be added to the button on the stocks screen. To do this, add the following code to bind.js in the events folder.

	 //stocks submit click event
	$("#stocks #stockSubmit").bind("click",function(){
		var num=$("#compName").val();
		stocksController.validateStock(name);
	});

## Step 9 -- Client side (CSS)
To create custom styles for the stocks page, create a stocks.css file in the css folder (client/default/css). Add the following code to this file.

	#stocks .content{
		padding:20px;
	}

	#stocks .info{
		font-size:0.8em;
		color:#aaa;
		text-align:center;
	}

This stylesheet then need to be referenced in the Payment page. Add the following to the top of the payment file.
	<link rel="stylesheet" type="text/css" href="./css/stocks.css"/>

## Step 10
Verify what you have made is working by trying to to do a look up of Google. You should receive the output shown below.

![](https://github.com/feedhenry/HP-JQM-Demo/raw/master/docs/Stocks.png)


Checkout the [v7 branch](https://github.com/feedhenry/HP-JQM-Demo/tree/v7) to see the completed code.

Next step will introduce how to use On-Device Local storage to save/load data.
