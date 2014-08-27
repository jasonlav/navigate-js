#navigate-js
####Parses links and attaches click events for HTML5 push state, Hash tags, and other navigation methods.

Installation
------------

Include navigate.min.js to your HTML file; this library has no dependencies. Library should be loaded at the bottom of the HTML body.

``` html
<script src="navigate.js"></script>
```

Usage
-----

#####Simple
``` javascript
var config = {};
var filter = function(element) {
	if(element.tagName === "A") {
		return true;
	}
	return false;
};
var callback = function(href, e) {
	alert(href);
};

var nav = new Navigate(filter, callback, config);
nav.parseLinks(document.getElementById("wrapper"));
```
``` html
<div id="wrapper">
	<a href="example1">Example 1</a>
	<a href="example2">Example 2</a>
</div>
```

#####Backbone style hash tag example
``` javascript
var config = {
	"removeHrefPrefix": ["#/"],
	"preventDefault": false
};
var filter = function(element) {
	if(element.tagName === "A" && element.getAttribute("href").substr(0, 2) === "#/") {
		return true;
	}
	return false;
};
var callback = function(href, e) {
	alert(href);
};

var nav = new Navigate(filter, callback, config);
nav.parseLinks(document.getElementById("wrapper"));
```

```html
<div id="wrapper">
	<a href="/test">test</a>
</div>
```

#####HTML5 History API Example
``` javascript
var config = {
	"removeHrefPrefix": ["/"]
};
var filter = function(element) {
	if(element.tagName === "A" && element.getAttribute("href").substr(0, 1) === "/") {
		return true;
	}
	return false;
};
var callback = function(href, e) {
	//Call history api...
	alert(href);
};

var nav = new Navigate(filter, callback, config);
nav.parseLinks(document.getElementById("wrapper"));
```

```html
<div id="wrapper">
	<a href="/test">test</a>
</div>
```

Options
-----
#####filter
A function called on parsed elements and children found via config.selector. The element is based as the first parameter of the function. Function returns true or false based on if the element should be handled by navigate.js or not. Required.

#####callback
A function called when the user triggers the navigate event (typically click). First parameter passed is the href (may be modified by config.removeHrefPrefix); second parameter is the event object. Required.

#####default config
``` javascript
{
	"linkEvent": "click",
	"selector": "a",
	"ignoreHrefPrefix": ["http://", "https://", "mailto:"],
	"ignoreTarget": ["_blank"],
	"preventDefault": true
}
```

#####config.linkEvent
Event type to attach to element. Default is "click".

#####config.selector
Selector (querySelectorAll) to search for children when parsing links. Default is "a".

#####config.ignoreHrefPrefix
Ignore elements with matching href prefixes. Default is "http://", "https://", "mailto". Typically, these prefixes indicate that the link is going to an external page and should not be captured by navigate.js.

#####config.ignoreTarget (array of strings)
Ignore elements with match targets. Default is "_blank". Typically, these targets indicate that the link is going to an external page and should not be captured by navigate.js.

#####config.removeHrefPrefix (array of strings)
When using hash tags, the prefix (commonly "#' or "#/") will be included in the href returned to the callback. This option allows a simple way to remove these unnecessary prefixes. Note that prefixes are removed in order; once a match is found the following prefixes will be ignored.

#####config.preventDefault (true | false)
Prevent default behavior of event with necessary IE fallbacks. Default is true. Typically disabled on hash tag method.

Compatibility
-------------
Path.js has been tested in all modern browsers and Internet Explorer 8+.

License
-------------
Released under [MIT License].
[MIT License]: http://mit-license.org/