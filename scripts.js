/**
 * Need api server side debugging
 * server somehow doesnt support jsonp
 * 
 * http://en.wikipedia.org/wiki/JSONP
 * http://bob.pythonmac.org/archives/2005/12/05/remote-json-jsonp/
 * http://stackoverflow.com/questions/2681466/jsonp-with-jquery
 * 
 * @author serkan
 */
$(document).ready(function() {
	/**
	 * Request class to create one ajax api request
	 */
	var Request = Class.extend({
		endpoint: null, 
		params: null,
		callback: false, 
		type: new Array('GET', 'POST', 'PUT', 'DELETE'),
		/**
		 * Constructor
		 * 
		 * @param object Endpoint
		 */
	    init: function(endpoint) {
	        this['endpoint'] = endpoint.endpoint();
	        this['params'] = endpoint.get_filters();
	    	// check & set request type. GET as default.
	    	var req_type = endpoint.req_type();
	    	this['type'] = typeof(req_type) != 'undefined' && 
				    		this['type'].in_array(req_type.toUpperCase()) 
	    						? req_type.toUpperCase() : 'GET';
			// init etc..
	    },
	    /**
    	 * Returns token with sync request
    	 * 
    	 * @return string
    	 */
	    _getToken: function() {
	    	var response = null;
	    	
	    	$.ajax({
	    		// @BUG: need to integrate relative url prefix
			    url: 'getkey.php',
			    async: false,
			    type: 'GET',
				error: function(xhr, ajaxOptions, thrownError) {
					// @TODO: error handling
					console.log('getting api token failed: ' + xhr.toSource());
				},
			    success: function(resp) {
			    	response = resp;
			    }
			});
			
			return response;
	    },
	    /**
	     * Do an API request and return response "sync"ly
	     */
	    doRequest: function() {
	    	var token = this._getToken();
	    	var response = null;
	    	
	    	$.ajax({
			    url: this['endpoint'] + '.json?callback=?',
			    type: this['type'],
			    data: this['params'],
			    beforeSend: function(xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + token);
				},
				error: function(xhr, ajaxOptions, thrownError) {
					// @TODO: error handling
					$('pre#response').text(xhr.toSource())
					console.log(xhr.toSource());
				},
			    success: function(resp) {
			    	response = resp;
			    }
			});
			
			return response;
	    }
	});
	
	/**
	 * Endpoint wrapper interface
	 */
	var Endpoint = Class.extend({
		_filters: {},
		_type: null,
		endpoint: function() {
			return 'https://store-3fc26.mybigcommerce.com/api/v2';
		},
		get: function() {
			this._type = 'GET';
			var request = new Request(this);
			return request.doRequest();
		},
		put: function() {
			// etc..
		},
		del: function() {
			// etc
		},
		req_type: function() {
			return this._type;
		},
		add_filter: function(field, value) {
			this._filters[field] = value;
		},
		get_filters: function() {
			return $.param(this._filters);
		}
	});
	
	/**
	 * Orders main endpoint 
	 */
	var OrdersEndpoint = Endpoint.extend({
		endpoint: function() {
			return this._super() + '/orders';
		}
	});
	
	/**
	 * Order products endpoint
	 */
	var OrderProductsEndpoint = OrdersEndpoint.extend({
		// etc
	});
	
	
	
	/**
	 * Click events, page interactions etc
	 */
	
	// trigger an orders request
	function getOrders(page) {
		var page = parseInt(page)===page ? page : 1;
		var endpoint = new OrdersEndpoint();
		// @TODO: get filters from html, apply page etc
		endpoint.add_filter('size', 10);
		var response = endpoint.get();
		// refresh html ui with response
		// ...
	};
	
	getOrders();
});