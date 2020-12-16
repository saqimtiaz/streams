/*\
title: $:/plugins/sq/streams/draggable-tweaks.js
type: application/javascript
module-type: widget-subclass
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.baseClass = "draggable";

exports.constructor = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

exports.prototype = {};

exports.prototype.render = function(parent,nextSibling) {
	// Call the base class handleChangeEvent function
	Object.getPrototypeOf(Object.getPrototypeOf(this)).render.call(this,parent,nextSibling);
	var self = this;
	$tw.utils.each(this.attributes,function(v,a) {
		if(a.substring(0,10) === "data-node-") {
			try {
				self.domNodes[0].setAttributeNS(null,a,v);
			} catch(e){
				
			}
		}
	});
};

})();