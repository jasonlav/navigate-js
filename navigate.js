function Navigate(config, callback) {
	this.config = config;
	this.callback = callback;
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

	//Only parse links on browser that support HTML5 History API (push state)
	if(window.history && window.history.pushState) {
		var callback = function(e) {
			that.parseLinkCallback(e, that);
		};

		//If element contains linkClass, add event
		if(element.classList.contains(this.config.linkClass)) {
			element.classList.remove(this.config.linkClass);

			element.addEventListener(this.config.linkEvent, callback);
		} else {
		//Element does not contain linkClass, query all children and add event
			var elements = element.querySelectorAll("."+this.config.linkClass);
			var length = elements.length;

			for(var i=0; i<length; i++) {
				elements[i].classList.remove(this.config.linkClass);
				elements[i].addEventListener(this.config.linkEvent, callback);
			}
		}
	}
};

/**
 * Parse link callback
 */
Navigate.prototype.parseLinkCallback = function(e, that) {
	var element = e.target;
	var href = element.getAttribute("href");
	var target = element.getAttribute("target");

	//Ignore prefixes
	var length = that.config.ignorePrefixes.length;
	var prefix;

	for(var i=0; i<length; i++) {
		prefix = that.config.ignorePrefixes[i];
		if(href.substr(0, prefix.length) === prefix) {
			return;
		}
	}

	//Ignore target
	if(typeof target === "string") {
		length = that.config.ignoreTarget.length;
		for(i=0; i<length; i++) {
			prefix = that.config.ignoreTarget[i];

			if(target.substr(0, prefix.length) === prefix) {
				return;
			}
		}
	}

	//Prevent default
	e.preventDefault();
	
	//Remove base path
	if(href.substr(0, that.config.base.length) === that.config.base) {
		href = href.substr(that.config.base.length);
	}

	//Check canChange, trigger callback
	if(that.canChange) {
		that.callback(href, e);
	}
};