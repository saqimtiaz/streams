/*\

title: $:/plugins/sq/streams/action-unselect.js
type: application/javascript
module-type: widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var UnselectWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
UnselectWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
UnselectWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
	this.parentDomNode = parent;
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
UnselectWidget.prototype.execute = function() {
	this.makeChildWidgets();
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
UnselectWidget.prototype.refresh = function(changedTiddlers) {
	return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/
UnselectWidget.prototype.invokeAction = function(triggeringWidget,event) {
	if (window.getSelection) {
		window.getSelection().removeAllRanges();
	} else if (document.selection) {
		document.selection.empty();
	}
	return true;
};

UnselectWidget.prototype.allowActionPropagation = function() {
	return false;
};

exports["action-unselect"] = UnselectWidget;

})();