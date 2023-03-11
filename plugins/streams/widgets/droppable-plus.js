/*\
title: $:/core/modules/widgets/droppable-plus.js
type: application/javascript
module-type: widget

Droppable widget

\*/
(function(){

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";
	
	var Widget = require("$:/core/modules/widgets/widget.js").widget;
	
	var DroppableWidget = function(parseTreeNode,options) {
		this.initialise(parseTreeNode,options);
	};
	
	/*
	Inherit from the base widget class
	*/
	DroppableWidget.prototype = new Widget();
	
	/*
	Render this widget into the DOM
	*/
	DroppableWidget.prototype.render = function(parent,nextSibling) {
		var self = this,
			tag = this.parseTreeNode.isBlock ? "div" : "span",
			domNode;
		// Remember parent
		this.parentDomNode = parent;
		// Compute attributes and execute state
		this.computeAttributes();
		this.execute();
		if(this.droppableTag && $tw.config.htmlUnsafeElements.indexOf(this.droppableTag) === -1) {
			tag = this.droppableTag;
		}
		// Create element and assign classes
		domNode = this.document.createElement(tag);
		this.domNode = domNode;
		this.assignDomNodeClasses();
		// Add event handlers
		if(this.droppableEnable) {
			$tw.utils.addEventListeners(domNode,[
				{name: "dragenter", handlerObject: this, handlerMethod: "handleDragEnterEvent"},
				{name: "dragover", handlerObject: this, handlerMethod: "handleDragOverEvent"},
				{name: "drop", handlerObject: this, handlerMethod: "handleDropEvent"},
				{name: "dragend", handlerObject: this, handlerMethod: "handleDragEndEvent"}
			]);
		} else {
			$tw.utils.addClass(this.domNode,this.disabledClass);
		}
		// Assign dom-data- attributes
		$tw.utils.each(this.attributes,function(v,a) {
			if(a.substring(0,10) === "data-node-") {
				try {
					self.domNode.setAttributeNS(null,a,v);
				} catch(e){
					
				}
			}
		});
		// Insert element
		parent.insertBefore(domNode,nextSibling);
		this.renderChildren(domNode,null);
		this.domNodes.push(domNode);
		// Stack of outstanding enter/leave events
		this.currentlyEntered = null;
	};

	DroppableWidget.prototype.getSelectedNode = function(event) {
		var selectedNode = event.target,
			selector = this.getAttribute("selector");
		if(!selectedNode) {
			return null;
		}
		// Firefox can fire dragover and dragenter events on text nodes instead of their parents
		if(selectedNode.nodeType === 3) {
			selectedNode = selectedNode.parentNode;
		}
		// Search ancestors for a node that matches the selector
		while(!$tw.utils.domMatchesSelector(selectedNode,selector) && selectedNode !== this.domNode) {
			selectedNode = selectedNode.parentNode;
		}
		// Exit if we didn't find one
		if(selectedNode === this.domNode) {
			return null;
		}
		return selectedNode;
	}
	
	// Handler for transient event listeners added when the droppable zone has an active drag in progress
	DroppableWidget.prototype.handleEvent = function(event) {
		if(event.type === "dragenter") {
			if(event.target && event.target !== this.domNode && !$tw.utils.domContains(this.domNode,event.target)) {
				this.resetState();
			}
		} else if(event.type === "dragleave") {
			// Check if drag left the window
			if(event.relatedTarget === null || (event.relatedTarget && event.relatedTarget.nodeName === "HTML")) {
				this.resetState();
			}
		}
	};
	
	DroppableWidget.prototype.resetState = function(options,event) {
		if(this.currentlyEntered) {
			$tw.utils.removeClass(this.currentlyEntered,"sq-dragover");
			this.currentlyEntered = null;
		}
		this.document.body.removeEventListener("dragenter",this,true);
		this.document.body.removeEventListener("dragleave",this,true);
	};

	DroppableWidget.prototype.handleDragEnterEvent  = function(event) {
		this.document.body.addEventListener("dragenter",this,true);
		this.document.body.addEventListener("dragleave",this,true);
		var selectedNode = this.getSelectedNode(event);
		if(!selectedNode) {
			this.resetState();
			return true;
		}
		if(this.currentlyEntered !== selectedNode) {
			if(this.currentlyEntered) {
				$tw.utils.removeClass(this.currentlyEntered,"sq-dragover");
			}
			this.currentlyEntered = selectedNode
			// If we're entering for the first time we need to apply highlighting
			$tw.utils.addClass(selectedNode,"sq-dragover");
			console.log("entered: ",selectedNode.getAttribute("data-id"));
		}
		// Tell the browser that we're ready to handle the drop
		event.preventDefault();
		// Tell the browser not to ripple the drag up to any parent drop handlers
		event.stopPropagation();
		return false;
	};

	DroppableWidget.prototype.handleDragOverEvent  = function(event) {
		// Check for being over a TEXTAREA or INPUT
		if(["TEXTAREA","INPUT"].indexOf(event.target.tagName) !== -1) {
			return false;
		}
		var selectedNode = this.getSelectedNode(event);
		if(!selectedNode) {
			return false;
		}
		// Tell the browser that we're still interested in the drop
		event.preventDefault();
		// Set the drop effect
		event.dataTransfer.dropEffect = this.droppableEffect;
		return false;
	};
	

	DroppableWidget.prototype.handleDragEndEvent = function(event) {
		this.resetState();
	};
	
	DroppableWidget.prototype.handleDropEvent  = function(event) {
		var self = this,
			selectedNode = this.getSelectedNode(event);
		// Check for being over a TEXTAREA or INPUT
		if(["TEXTAREA","INPUT"].indexOf(event.target.tagName) !== -1 || !selectedNode) {
			return false;
		}
		var dataTransfer = event.dataTransfer;
		// Remove highlighting
		this.resetState();
		var selectedNode = this.getSelectedNode(event),
			variables = $tw.utils.collectDOMVariables(selectedNode,self.domNode,event);
		// Try to import the various data types we understand
		$tw.utils.importDataTransfer(dataTransfer,null,function(fieldsArray) {
			fieldsArray.forEach(function(fields) {
				self.performActions(fields.title || fields.text,event,variables);
			});
		});
		// Tell the browser that we handled the drop
		event.preventDefault();
		// Stop the drop ripple up to any parent handlers
		event.stopPropagation();
		return false;
	};
	
	DroppableWidget.prototype.performActions = function(title,event,variables) {
		if(this.droppableActions) {
			var modifierKey = $tw.keyboardManager.getEventModifierKeyDescriptor(event);
			this.invokeActionString(this.droppableActions,this,event,$tw.utils.extend(variables,{actionTiddler: title, modifier: modifierKey}));
		}
	};
	
	/*
	Compute the internal state of the widget
	*/
	DroppableWidget.prototype.execute = function() {
		this.droppableActions = this.getAttribute("actions");
		this.droppableEffect = this.getAttribute("effect","copy");
		this.droppableTag = this.getAttribute("tag");
		this.droppableEnable = (this.getAttribute("enable") || "yes") === "yes";
		this.disabledClass = this.getAttribute("disabledClass","");
//		this.dragEnterActions = this.getAttribute("dragenteractions");
//		this.dragLeaveActions = this.getAttribute("dragleaveactions");
//		this.dragEndActions = this.getAttribute("dragendactions");
		this.selector = this.getAttribute("selector");
		// Make child widgets
		this.makeChildWidgets();
	};
	
	DroppableWidget.prototype.assignDomNodeClasses = function() {
		var classes = this.getAttribute("class","").split(" ");
		classes.push("sq-droppable");
		this.domNode.className = classes.join(" ");
	};
	
	/*
	Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
	*/
	DroppableWidget.prototype.refresh = function(changedTiddlers) {
		var changedAttributes = this.computeAttributes();
		if(changedAttributes.tag || changedAttributes.enable || changedAttributes.disabledClass || changedAttributes.actions || changedAttributes.effect || changedAttributes.dragenteractions || changedAttributes.dragleaveactions || changedAttributes.dragendactions) {
			this.refreshSelf();
			return true;
		} else if(changedAttributes["class"]) {
			this.assignDomNodeClasses();
		}
		var retValue = this.refreshChildren(changedTiddlers);
		if(this.currentlyEntered) { //what would happen if currentlyEntered domNode reference existed but domNode had been removed?
			$tw.utils.addClass(this.currentlyEntered,"sq-dragover");
		} // otherwise remove class from all matching items?
		return retValue;
	};
	
	exports["droppable-plus"] = DroppableWidget;
	
	})();


	/*

	alt approach is dont add sq-dragover class from javascript, as this might be prone to refresh failure
		instead, use dragenter and dragleave actions to set a state tiddler, and use the value of that either to assign a class to items via filtered transclusion, or to set a dynamic css rule to indicate which item to highlight


	*/