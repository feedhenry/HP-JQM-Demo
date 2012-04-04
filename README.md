# FeedHenry jQuery Mobile Tutorial - Getting to v5

## Overview
In this tutorial we will be adding a new view for credit card validation. This will demonstrate the use of input fields and web requests using $fh.web().

* Integrate an app with a credit card validation service 'CCChecker'
* Learn to use input fields and read from them
* Use $fh.web()

![](https://github.com/feedhenry/FH-Training-App-JQM/raw/master/docs/CreditCard.png)

## Step 1
Begin by creating the creditcard.html file in the views folder (client/default/app/views) and add the following code.

		<div  class="header" data-role="header">
			<img src="./images/logo.png"/>
		</div>
		<div class="content">
			<h2>Payment Info</h2>
			<label for="cardType">Card Type</label>
			<select name="cardType" id="cardType">
				<option value="visa">Visa</option>
				<option value="mastercard">Mastercard</option>
			</select>
			<label for="cardNum">Card Number</label>
			<input type="number" name="cardNum" id="cardNum" value=""  />
			
			<p class="info">Please enter the payment information above.</p>
			<div data-role="button" id="validateCard">Validate Card Number</div>
			
		</div>


## Step 2
Update the index.html page to add a reference to the Twitter page that we created.

`<div data-add-back-btn="true" data-role="page" class="page" id="creditcard"></div>`


## Step 3
In the models folder (client/default/app/models), create a creditcard.js file and add the following code. Examine the code to see how it works.

		var creditCard = {
			data : [],
			validate : function(type, number, callback) {
				var that = this;
				if(number.length != 16) {
					if(callback) {
						callback({
							res : "Card Number should be 16 digits"
						});
					}
					return;
				}
				$fh.act({
					act : "payment",
					req : {
						cardType : type,
						cardNumber : number
					}
				}, function(res) {
					var regEx = new RegExp("<\s*string[^>]*>(.*?)<\s*/\s*string>", "g");
					var result = regEx.exec(res.body)[1];
					if (callback){
						callback({res:result});
					}
				})
			}
		}


## Step 4
Now we need to add the necessary controllers for the functionality of the Payment section. The controller relies on a cloud call which is done using $fh.act(). The function called from the cloud is payment as specified by 'act: payment'. Create a creditCard.js file in the controllers folder and paste in the folowing code.

		var creditCardController={
			validateCard:function(type,number){
				if (!type){
					alert("please choose a type!");
					return;
				}
				
				if (!number){
					alert("please input card number.");
					return;
				}
				$.mobile.showPageLoadingMsg()
				creditCard.validate(type,number,function(res){
					$.mobile.hidePageLoadingMsg();
					//update view with model response.
					alert(res.res);
				});
			}
		}

## Step 5
A handler function will now need to be included to allow navigation to the Payment page. In the nav.js file, add the following code.

		creditcard : function() {
			changeView("creditcard");
		}


## Step 5
The payment function now needs to be added to our cloud functions in main.js in the cloud directory. This function will perform a web request ($fh.web) to the URL specified with the parameters provided by our $fh.act call in the creditCard file in the controllers folder.

		/*
		 * Payment
		 */ 
		function payment() {
		  var cardType   = $params.cardType;
		  var cardNumber = $params.cardNumber;
		  var url = "http://www.webservicex.net/CreditCard.asmx/ValidateCardNumber?cardType=" + cardType + "&cardNumber=" + cardNumber;

		  return $fh.web({
		    url: url,
		    method: 'GET'
		  });
		}


## Step 6
A handler must be added to the button on the Payment screen. To do this, add the following code to bind.js in the events folder.

		//creditcard validate click event
		$("#creditcard #validateCard").bind("click",function(){
			var type=$("#cardType").val();
			var num=$("#cardNum").val();
			creditCardController.validateCard(type,num);
		});


## Step 7
To create custom styles for the Payment page, create a creditcard.css file in the css folder (client/default/css). Add the following code to this file.

		#creditcard .content{
			padding:20px;
		}

		#creditcard .info{
			font-size:0.8em;
			color:#aaa;
			text-align:center;
		}

This stylesheet then need to be referenced in the Payment page. Add the following to the top of the payment file.

`<link rel="stylesheet" type="text/css" href="./css/creditcard.css"/>`


## Step 8
Verify what you have made is working by trying to validate a number sequence such as '0000000000000000'. You should receive the output shown below.

![](https://github.com/feedhenry/FH-Training-App-JQM/raw/master/docs/CreditCardCall.png)

Checkout the [v5 branch](https://github.com/feedhenry/FH-Training-App-JQM/tree/v5) to see the completed code.


Next step will introduce how to access native functionality -- Camera.

