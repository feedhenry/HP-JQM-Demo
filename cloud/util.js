/**
 * Retrieve a XML object that is in SOAP response.
 */
function getSOAPElement(eleTagWithNS, SOAPRes) {
  var start_index = SOAPRes.indexOf("<" + eleTagWithNS + ">");
	var end_tag = "</" + eleTagWithNS + ">";
	var end_index = SOAPRes.indexOf(end_tag) + end_tag.length;
	var xmlData = new XML(SOAPRes.substring(start_index, end_index));
	return xmlData;
}