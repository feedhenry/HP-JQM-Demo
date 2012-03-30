/**
 * Mash multiple business apis returned data.
 * Stock Symble lookup: Using YAHOO API. JSONP
 * Stock Info lookup: Using WebServiceX API . SOAP
 *
 */

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