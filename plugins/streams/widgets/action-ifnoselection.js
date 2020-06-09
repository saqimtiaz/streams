/*\

title: $:/plugins/sq/streams/action-ifnoselection.js
type: application/javascript
module-type: widget

Do not trigger actions within if there is text selected.
Allows to select text in a button widget without triggering a click.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var IfNoSelectionWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
IfNoSelectionWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
IfNoSelectionWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
	this.parentDomNode = parent;
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
IfNoSelectionWidget.prototype.execute = function() {
	this.makeChildWidgets();
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
IfNoSelectionWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/
IfNoSelectionWidget.prototype.invokeAction = function(triggeringWidget,event) {
	
	var selection = window.getSelection();
	if(!selection.toString()) {
		this.invokeActions(this,event);
		return true;
	}
};

IfNoSelectionWidget.prototype.allowActionPropagation = function() {
	return false;
};

exports["action-ifnoselection"] = IfNoSelectionWidget;

})();