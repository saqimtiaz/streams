/*\

title: $:/plugins/sq/bullets/action-ifconfirmed.js
type: application/javascript
module-type: widget

Prompt user for confirmation before executing actions contained inside the widget.
If the user cancels, the actions are not executed.

Example:
<$button>go
<$action-ifconfirmed $message="Proceed?">
	<$action-setfield $tiddler="lego" $value="chopper"/>
</$action-ifconfirmed>
</$button>

Parameters:
$message : message to display

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var IfConfirmedWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
IfConfirmedWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
IfConfirmedWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
	this.parentDomNode = parent;
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
IfConfirmedWidget.prototype.execute = function() {
	this.message = this.getAttribute("$message");
	this.makeChildWidgets();
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
IfConfirmedWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["$message"]) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/
IfConfirmedWidget.prototype.invokeAction = function(triggeringWidget,event) {
	if(this.message) {
		var status = confirm(this.message);
		if(status) {
			this.invokeActions(this,event);
			return true;
		}
	}
};

IfConfirmedWidget.prototype.allowActionPropagation = function() {
	return false;
};

exports["action-ifconfirmed"] = IfConfirmedWidget;

})();