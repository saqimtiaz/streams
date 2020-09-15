/*\
title: $:/plugins/sq/streams/widgets/keyboard-plus.js
type: application/javascript
module-type: widget
\*/
(function(){
	
var Widget = require("$:/core/modules/widgets/widget.js").widget;

var KeyboardWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
KeyboardWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
KeyboardWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	// Remember parent
	this.parentDomNode = parent;
	// Compute attributes and execute state
	this.computeAttributes();
	this.execute();
	var tag = this.parseTreeNode.isBlock ? "div" : "span";
	if(this.tag && $tw.config.htmlUnsafeElements.indexOf(this.tag) === -1) {
		tag = this.tag;
	}
	// Create element
	var domNode = this.document.createElement(tag);
	// Assign classes
	var classes = (this["class"] || "").split(" ");
	classes.push("tc-keyboard");
	domNode.className = classes.join(" ");
	
	
	// Add a keyboard event handler
	domNode.addEventListener("keydown",function (event) {
	
		var key, action, preventDefault;
		for(var i=0; i<self.shortcutTiddlers.length; i++) {
			if(self.shortcutParsedList[i] !== undefined && $tw.keyboardManager.checkKeyDescriptors(event,self.shortcutParsedList[i])) {
				key = self.shortcutParsedList[i];
				action = self.shortcutActionList[i];
				preventDefault = self.shortcutPreventDefaultList[i];
			}
		}
		if(key !== undefined) {
			if(preventDefault) {
				event.preventDefault();
			}
			event.stopPropagation();
			self.invokeActionString(action,self,event);
			return true;
		}
		return false;	
	},false);
	
	// Insert element
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);
	this.domNodes.push(domNode);	
}	
	
KeyboardWidget.prototype.execute = function() {
	var self = this;
	// Get attributes
	this.tag = this.getAttribute("tag","");
	this["class"] = this.getAttribute("class","");
	this.shortcutTiddlerTag = this.getAttribute("shortcutTag");
	//var keyInfoArray = [];
	
	this.shortcutTiddlers = this.wiki.getTiddlersWithTag(this.shortcutTiddlerTag);
	this.shortcutKeysList = [];
	this.shortcutActionList = [];
	this.shortcutParsedList = [];
	this.shortcutPreventDefaultList = [];
	
	for(var i=0; i<this.shortcutTiddlers.length; i++) {
		var title = this.shortcutTiddlers[i],
			tiddlerFields = this.wiki.getTiddler(title).fields;
		this.shortcutKeysList[i] = tiddlerFields.key !== undefined ? tiddlerFields.key : undefined;
		this.shortcutActionList[i] = tiddlerFields.text;
		this.shortcutPreventDefaultList[i] = tiddlerFields["prevent-default"] && tiddlerFields["prevent-default"] === "no" ? false : true;
		this.shortcutParsedList[i] = this.shortcutKeysList[i] !== undefined ? $tw.keyboardManager.parseKeyDescriptors(this.shortcutKeysList[i]) : undefined;
	}
	
	// Make child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
KeyboardWidget.prototype.refresh = function(changedTiddlers) {
	
	var newList = this.wiki.getTiddlersWithTag(this.shortcutTiddlerTag)
	var hasChanged = $tw.utils.hopArray(changedTiddlers,this.shortcutTiddlers) ? true :
		($tw.utils.hopArray(changedTiddlers,newList) ? true :
		($tw.keyboardManager.detectNewShortcuts(changedTiddlers))
	);
	// Re-cache shortcuts if something changed
	if(hasChanged) {
	//	this.updateShortcutLists(newList);
		this.refreshSelf();
		return true;
	}
	
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["class"] || changedAttributes.tag) {
		this.refreshSelf();
		return true;
	}

	return this.refreshChildren(changedTiddlers);
};
	
exports["keyboard-plus"] = KeyboardWidget;

})();	