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
			// CM triggers two events
			// second event has:
			//		defaultPrevented : true
			//		detail: 0
			// 		eventPhase 3 (instead of 2)
			// 		isComposing : false
			if(!event.defaultPrevented) {
				var key, action, preventDefault;
				for(var i=0; i<self.shortcutTiddlers.length; i++) {
					if(self.shortcutParsedList[i] !== undefined && $tw.keyboardManager.checkKeyDescriptors(event,self.shortcutParsedList[i])) {
						key = self.shortcutParsedList[i];
						action = self.shortcutActionList[i];
						preventDefault = self.shortcutPreventDefaultList[i];
						break;
					}
				}
				if(key !== undefined) {
					if(preventDefault) {
						event.preventDefault();
					}
					Object.defineProperty(event,"sqHandled",{value:true});
					//event.sqHandled = true;
					event.stopPropagation();
					//event.stopImmediatePropagation();
					self.invokeActionString(action,self,event);
					return true;
				}
				return false;
		}
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


KeyboardWidget.prototype.invokeActionString = function(actions,triggeringWidget,event,variables) {
	if(!variables) {
		variables = {};
	}
	
	var activeElement = document.activeElement;
	var selection;
	if(activeElement && activeElement.tagName === "IFRAME") {
		var idoc = activeElement.contentDocument || activeElement.contentWindow.document;
		activeElement = idoc.activeElement;
		selection = idoc.getSelection();
	} else {
		selection = window.getSelection();
	}

	if(window.CodeMirror && document.activeElement.closest(".CodeMirror")) {
		var cm = document.activeElement.closest(".CodeMirror").CodeMirror;
		var cursor = cm.getCursor("start");
		var startRange = cm.getRange({"line":0,"ch":0},{"line":cursor.line,"ch":cursor.ch});
		var selectionStart = startRange.length;
		var selection = cm.getSelection();
		var selectionEnd = selectionStart + selection.length;
		
		variables["selectionStart"] = startRange.length.toString();
		variables["selectionEnd"] = (selectionStart + selection.length).toString();
		variables["selection"] = cm.getSelection().toString();
	} else if(activeElement && selection && ((activeElement.tagName === "INPUT" && activeElement.type === "TEXT") || activeElement.tagName === "TEXTAREA")) {
		variables["selectionStart"] = activeElement.selectionStart.toString();
		variables["selectionEnd"] = activeElement.selectionEnd.toString();
		variables["selection"] = selection.toString();
	}

	//this.selection_original_invokeActionString(actions,triggeringWidget,event,variables);
	Object.getPrototypeOf(Object.getPrototypeOf(this)).invokeActionString.call(this,actions,triggeringWidget,event,variables);
}

exports["keyboard-plus"] = KeyboardWidget;

})();	