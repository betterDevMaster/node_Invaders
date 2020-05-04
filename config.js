// this is globalconfig
var config = function(){};


config.prototype = {
	// port list
	'PORT1' : 8000,
	'PORT2' : 8200,

	'BASE_IP' : "192.168.0.44",

	// base url
	'BASE_URL' : "http://localhost:"
}

module.exports = new config();


