/*\

title: $:/plugins/sq/bullets/action-withselection.js
type: application/javascript
module-type: widget

Triggers an action string, providing certain variables.
For use in conjunction with the keyboard widget
selectionStart : start position in characters of the selection
selectionEnd: end position in characters of the selection

Example:

\define kb-actions()
<$action-withselection actions="""
<$action-setfield $tiddler=debug text=<<selection>> start=<<selectionStart>> end=<<selectionEnd>>/>
"""/>
\end

<$keyboard key="Enter" actions=<<kb-actions>> >
<$edit-text tiddler="temp"/>
</$keyboard>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var WithSelectionWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
WithSelectionWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
WithSelectionWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
	this.parentDomNode = parent;
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
WithSelectionWidget.prototype.execute = function() {
	this.actions = this.getAttribute("actions");
	this.makeChildWidgets();
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
WithSelectionWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["actions"]) {
		this.refreshSelf();
		return true;
	}	
	return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/
WithSelectionWidget.prototype.invokeAction = function(triggeringWidget,event) {
	var selection = window.getSelection();
	var el = selection.focusNode.children[0];
	if(selection && el) {
		this.setVariable("selectionStart",el.selectionStart.toString());
		this.setVariable("selectionEnd",el.selectionEnd.toString());
		this.setVariable("selection",selection.toString());
	}
	this.invokeActionString(this.actions,this,event);
	return true;
};


WithSelectionWidget.prototype.allowActionPropagation = function() {
	return false;
};

exports["action-withselection"] = WithSelectionWidget;

})();