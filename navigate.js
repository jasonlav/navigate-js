function Navigate(filter, callback, config) {
	var defaultConfig = {
		"linkEvent": "click",
		"selector": "a",
		"ignoreHrefPrefix": ["http://", "https://", "mailto:"],
		"ignoreTarget": ["_blank"],
		"preventDefault": true
	};

	if(typeof config !== "object") {
		config = {};
	}

	this.config = this.extend({}, defaultConfig, config);
	this.callback = callback;
	this.filter = filter;
	this.canChange = true;
}

/**
 * Enable
 */
Navigate.prototype.enable = function() {
	this.canChange = true;
};

/**
 * Disable
 */
Navigate.prototype.disable = function() {
	this.canChange = false;
};

/**
 * Parse links
 */
Navigate.prototype.parseLinks = function(element) {
	var that = this;

	var callback = function(e) {
		that.parseLinkCallback(e, this);

		//Prevent default
		if(that.config.preventDefault) {
			if(typeof e === "object" && typeof e.preventDefault === "function") {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
		}
	};

	if(this.filter(element) && this.exceptions(element)) {
		this.addEvent(element, this.config.linkEvent, callback);
	} else {
		var elements = element.querySelectorAll(this.config.selector);
		var length = elements.length;

		for(var i=0; i<length; i++) {
			if(this.filter(elements[i]) && this.exceptions(elements[i])) {
				this.addEvent(elements[i], this.config.linkEvent, callback);
			}
		}
	}
};

/**
 * Parse link callback
 */
Navigate.prototype.parseLinkCallback = function(e, element) {
	var href = element.getAttribute("href");
	var length, prefix, i;	
	
	//Remove base path
	if(this.config.removeHrefPrefix) {
		length = this.config.removeHrefPrefix.length;

		for(i=0; i<length; i++) {
			prefix = this.config.removeHrefPrefix[i];

			if(href.substr(0, prefix.length) === prefix) {
				href = href.substr(prefix.length);
				break;
			}
		}
	}

	//Check canChange, trigger callback
	if(this.canChange) {
		this.callback(href, e);
	}	
};

/**
 * Exceptions
 */
Navigate.prototype.exceptions = function(element) {
	var href = element.getAttribute("href");
	var target = element.getAttribute("target");
	var length, prefix, i;

	//Ignore prefixes
	if(this.config.ignoreHrefPrefix) {
		length = this.config.ignoreHrefPrefix.length;
		
		for(i=0; i<length; i++) {
			prefix = this.config.ignoreHrefPrefix[i];

			if(href.substr(0, prefix.length) === prefix) {
				return false;
			}
		}
	}

	//Ignore target
	if(typeof target === "string" && this.config.ignoreTarget) {
		length = this.config.ignoreTarget.length;
		for(i=0; i<length; i++) {
			prefix = this.config.ignoreTarget[i];

			if(target.substr(0, prefix.length) === prefix) {
				return false;
			}
		}
	}

	return true;
};

/**
 * Extend
 */
Navigate.prototype.extend = function(out) {
	out = out || {};

	for (var i = 1; i < arguments.length; i++) {
		if (!arguments[i]) {
			continue;
		}

		for (var key in arguments[i]) {
			if (arguments[i].hasOwnProperty(key)) {
				out[key] = arguments[i][key];
			}
		}
	}

	return out;
};

/**
 * Add event listener
 */
Navigate.prototype.addEvent = function(el, eventName, handler) {
	if (el.addEventListener) {
		el.addEventListener(eventName, handler);
	} else {
		el.attachEvent('on' + eventName, function(e){
			handler.call(el, e);
		});
	}
};
