/*\
title: $:/plugins/sq/streams/widgets/swiper.js
type: application/javascript
module-type: widget

Swipe event handler widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;
//var SwipeListener = require("$:/sq/lib/swipe-listener");
var SwipeEvents = require("$:/plugins/sq/lib/swipeevents.js").SwipeEvents;

var SwipeWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
SwipeWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
SwipeWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	// Remember parent
	this.parentDomNode = parent;
	// Compute attributes and execute state
	this.computeAttributes();
	this.execute();
	// Create element
	var tag = this.parseTreeNode.isBlock ? "div" : "span";
	var domNode = this.document.createElement(tag);
	this.domNode = domNode;
	//var listener = SwipeListener(domNode,{minHorizontal:100});
/*	domNode.addEventListener('swipe', function (e) {
      console.log('swipe', e.detail);
	});*/
	SwipeEvents(domNode,{"swipe-threshold": this.swipeThreshold});
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);
	this.domNodes.push(domNode);
}

/*
Compute the internal state of the widget
*/
SwipeWidget.prototype.execute = function() {
	var self = this;
	// Get attributes that require a refresh on change
//	this.types = this.getAttribute("events","").split(" ");
//	this.elementTag = this.getAttribute("tag");
	// Make child widgets
	this.swipeThreshold = parseInt(this.getAttribute("swipethreshold","100"));
	this.makeChildWidgets();
};

SwipeWidget.prototype.assignDomNodeClasses = function() {
	var classes = this.getAttribute("class","").split(" ");
	classes.push("tc-eventcatcher");
	this.domNode.className = classes.join(" ");	
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
SwipeWidget.prototype.refresh = function(changedTiddlers) {
/*
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["events"] || changedAttributes["tag"]) {
		this.refreshSelf();
		return true;
	} else if(changedAttributes["class"]) {
		this.assignDomNodeClasses();
	}
*/	
	return this.refreshChildren(changedTiddlers);
};

exports.swiper = SwipeWidget;

})();