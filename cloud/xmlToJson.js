/**
 * part_xml.js
 * variable definition
 */
var $xml={};
var opt={};

(function(_opt){
  $xml={};
  $xml.opt=_opt;
	$xml.ext=function(parent,key,tarObj){
		if (typeof parent!="object"){
			throw("first param of extension should be entry object.");
		}
		if (typeof key!="string"){
			throw("second param of extension should be key as string.");
		}
		parent[key]=tarObj;
	}
	
})(opt);

//key registration
$xml.ext($xml,"selector",{});
$xml.ext($xml,"public",{});

/**
 * Core Definition
 * ./core/core.js
 */

$xml.ext($xml,"core", function(xmlStr) {
	var _public= {
		/**
		 * Return E4X Xml Object
		 */
		getXmlObj: function() {
			return _private.getXmlObj();
		}
	};

	var _props= {
		selector:null,
		xmlObject:null //E4X Xml Object
	};
	var _private= {
		init: function() {
			for (var key in $xml['public']) {
				_public[key]=_private.publicFuncWrapper($xml['public'][key]);
			}
			if (typeof xmlStr =="xml") {
				_props.xmlObject=xmlStr;
			} else {
				var xmlData=xmlStr;
				// remove line breakers
				xmlData = xmlData.replace(/[\r\n]/g, "");
				var startPos = xmlData.indexOf("?>") +2;
				if (startPos < 2) {
					startPos = 0;
				}
				// remove <?xml ?> head.
				xmlData = xmlData.substring(startPos, xmlData.length);
				//trimleft xml string
				xmlData=xmlData.replace(/^\s/,"");
				if (_private.selector(xmlData)==="xmlString") {
					_props.xmlObject= new XML(xmlData);
				}
			}
		},
		getXmlObj: function() {
			return _props.xmlObject;
		},
		publicFuncWrapper: function(func) {
			return function() {
				return func.apply({
					pub:_public,
					pvt:_private
				}
				,arguments);
			}
		},
		selector: function(selector) {
			for (var key in $xml.selector) {
				var selFunc=$xml.selector[key];
				var res=selFunc(selector);
				if (res===true) {
					return key;
				}
			}
			if (res==null) {
				log("Count find selector for:"+xmlStr.toString());
			}
			return false;
		}
	};
	_private.init();
	return _public;
});/**
/**
 * Init
 * ./core/init.js
 */
var xml=$xml.core;
/**
 * Return true if xml string is parsed in. e.g. <hello>world</hello>
 */
$xml.ext($xml.selector,"xmlString", function(selector) {
	if (typeof selector==="string") {
		if (selector.charAt(0)==="<") {
			return true;
		}
	}
	return false;
});/**
 * Single Element tag selector. e.g. "test"
 * ./selector/elementTag.js
 */
$xml.ext($xml.selector,"elementTag", function(selector) {
	if (typeof selector==="string") {
		if (/^[a-zA-Z0-9_\-]*$/.test(selector)) {
			return true;
		}
	}
	return false;
})/**
 * Multiple element tag selector. e.g. "test hello"
 * ./selector/multiTag.js
 */

$xml.ext($xml.selector,"multiTag", function(selector) {
	if (typeof selector==="string"){
		if (selector.indexOf(" ")>0) {
			return true;
		}
	}
	return false;
})/**
 * number selector.e.g. 0 23 1293570
 * ./selector/number.js
 */

$xml.ext($xml.selector,"number",function(selector){
	if (/^[0-9]*$/.test(selector)){
		return true;
	}
	return false;
})
/**
 * Retrive or set text of current element
 * ./public/text.js
 */

$xml.ext($xml['public'],"text",function(text){
	var xmlObj=this.pvt.getXmlObj();
	if (text===undefined){
		return xmlObj.toString();
	}else{
		xmlObj.setChildren(text);
		return xmlObj.toString();
	}
});
/**
 * Find a element descendant of current xmlObject
 * ./public/find.js
 */
$xml.ext($xml['public'],"find",function(selector){
	//single tag selector
	if ("elementTag"===this.pvt.selector(selector)){
    
		var xmlObj=this.pvt.getXmlObj();
    //log(xmlObj.toString());
    //log(selector);
		var desc=xmlObj.descendants(selector);
    //log(desc.toXMLString());
    return xml(desc);
	}
	
	//multiple tag
	if ("multiTag"===this.pvt.selector(selector)){
		var selArr=selector.split(" ");
		var tmpObj=this.pub;
		for (var i=0;i<selArr.length;i++){
			tmpObj=tmpObj.find(selArr[i]);
		}
		return tmpObj;
	}
	log("cannot find descendants:" + selector +" of current xml object");
	//return current scope;
	return this.pub;
});
/**
 * Pass a native message to xml Object
 * ./public/native.js
 */

$xml.ext($xml['public'],'native',function(msg,args){
	if (args==undefined){
		args=[];
	}else{
		if (!args instanceof Array){
			args=[args];
		}
	}
	var xmlObj=this.pvt.getXmlObj();
	var code="xmlObj[msg]({params})";
	var params="";
	//TODO process arguments.
	/*for (var i=0;i<args.length;i++){
		params+=
	}*/
	code.replace("{params}",params);
	log("eval for code:"+code);
	return eval(code);
})
/**
 * Retrive parent of current xml Object
 * ./public/parent.js
 */
$xml.ext($xml['public'],"parent",function(){
	var xmlObj=this.pvt.getXmlObj();
	return xml(xmlObj.parent());
})
/**
 * retrive text including element tag.
 * E.g. <hello>world</hello> . method text() will return world while xmlText() will return <hello>world</hello>
 * ./public/xmlText.js
 */

$xml.ext($xml['public'],"xmlText",function(){
	var xmlObj=this.pvt.getXmlObj();
	return xmlObj.toXMLString();
})
/**
 * If xml has multiple root. at method will retrive specific one. e.g.
 * <test>1</test><test>2</test><test>3</test>
 * at(0) will retrive first test element
 * ./public/at.js
 * 
 */
$xml.ext($xml['public'],"at",function(index){
	if ("number"===this.pvt.selector(index)){
		var xmlObj=this.pvt.getXmlObj();
		return xml(xmlObj[index].toXMLString());
	}
})
/**
 * return how many roots are there in xml object
 * e.g.
 *  <test>1</test><test>2</test><test>3</test>
 * length() will return 3
 * ./public/length.js
 */
$xml.ext($xml['public'],"length",function(){
	var xmlObj=this.pvt.getXmlObj();
	return xmlObj.length();
})
/**
 * select all the children of current root element in xml object.
 * ./public/children.js
 */
$xml.ext($xml['public'],"children",function(){
	var xmlObj=this.pvt.getXmlObj();
	return xml(xmlObj.children());
})
/**
 * Change or retrive a specified attribute of current element/ first element
 * ./public/attr.js
 */
$xml.ext($xml['public'],"attr",function(name,val){
	if (val===undefined){
		var xmlObj=this.pvt.getXmlObj();
		if (xmlObj.length()>1){
			xmlObj=xmlObj[0];
		}
		return xmlObj.attribute(name).toString();
	}else{
		//TODO change attribute
	}
})
/**
 * Append a child xmlelement to current xml object
 * ./public/append.js
 */

$xml.ext($xml['public'],"append",function(xmlO){
	var xmlObj=this.pvt.getXmlObj();
	xmlObj.appendChild(xmlO);
});