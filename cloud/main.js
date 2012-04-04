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

/*
 * Maps
 */
// Cache points for 10 seconds
var CACHE_TIME = 30;
var MARKERS = {
  locations: [
    {
      lat: '52.245671',
      lon: '-7.080002'
    },
    {
      lat: '52.257861',
      lon: '-7.136993'
    }
  ]
};

function getCachedPoints() {
  var ret = $fh.cache({
    "act": "load",
    "key": "points"
  });
  return ret.val;
}

function cachePoints(hash, data) {
  var obj = {
    "hash": hash,
    "data": data,
    "cached": true
  };
  $fh.cache({
    "act": "save",
    "key": "points",
    "val": obj,
    "expire": CACHE_TIME
  });
}

function getPoints() {
  var response = {};
  var cache    = getCachedPoints();

  if (cache.length === 0) {
    var data = MARKERS;
    var hash = $fh.hash({
      algorithm: 'MD5',
      text: $fh.stringify(data)
    });

    // Cache the data
    cachePoints(hash, data);

    // Build the response
    response = {'data': data, 'hash':hash, 'cached':false};
  } else {
    // Parse the cached data
    cache = $fh.parse(cache);

    if( $params.hash && $params.hash === cache.hash ) {
      // Client data is up to date
      response = {'hash':$params.hash, 'cached':true};
    } else {
      // Hash value from client missing or incorrect, return cached cloud data
      response = cache;
    }
  }
  return response;
}