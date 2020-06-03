/*\

title: $:/plugins/sq/bullets/action-withinput.js
type: application/javascript
module-type: widget

Prompt user for input before executing actions contained inside the widget.
The string entered by the user is available in the variable userInput in the actions contained in the widget.

Prompt user for confirmation before executing actions contained inside the widget.
If the user cancels, the actions are not executed.

Example:
<$button>go
<$action-withinput message="What is your name?" actions="""<$action-setfield $tiddler="name" $value=<<userInput>>/>""" />
</$button>

Parameters:
message : message to display
default: default value, defaults to an empty string




\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var WithInputWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
WithInputWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
WithInputWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
	this.parentDomNode = parent;
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
WithInputWidget.prototype.execute = function() {
	this.message = this.getAttribute("message");
	this.defaultValue = this.getAttribute("default","");
	this.actions = this.getAttribute("actions");
	this.makeChildWidgets();
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
WithInputWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["message"] || changedAttributes["default"] || changedAttributes["actions"]) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/
WithInputWidget.prototype.invokeAction = function(triggeringWidget,event) {
	if(this.message && this.actions) {
		var userData = prompt(this.message,this.defaultValue);
		if(userData != null) {
			this.setVariable("userInput",userData);
			this.invokeActionString(this.actions,this,event);
			return true;
		}
	}
};

WithInputWidget.prototype.allowActionPropagation = function() {
	return false;
};

exports["action-withinput"] = WithInputWidget;

})();