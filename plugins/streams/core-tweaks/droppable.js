/*\
title: $:/plugins/sq/streams/droppable-tweaks.js
type: application/javascript
module-type: startup
\*/

var DroppableWidget = require("$:/core/modules/widgets/droppable.js").droppable;

DroppableWidget.prototype.render = function(parent,nextSibling) {
    var self = this;
    // Remember parent
    this.parentDomNode = parent;
    // Compute attributes and execute state
    this.computeAttributes();
    this.execute();
    var tag = this.parseTreeNode.isBlock ? "div" : "span";
    if(this.droppableTag && $tw.config.htmlUnsafeElements.indexOf(this.droppableTag) === -1) {
        tag = this.droppableTag;
    }
    // Create element and assign classes
    var domNode = this.document.createElement(tag),
        classes = (this.droppableClass || "").split(" ");
	this.domNode = domNode;
    classes.push("tc-droppable");
    domNode.className = classes.join(" ");
    // Add event handlers
    if(this.droppableEnable) {
        $tw.utils.addEventListeners(domNode,[
            {name: "dragenter", handlerObject: this, handlerMethod: "handleDragEnterEvent"},
            {name: "dragover", handlerObject: this, handlerMethod: "handleDragOverEvent"},
            {name: "dragleave", handlerObject: this, handlerMethod: "handleDragLeaveEvent"},
            {name: "drop", handlerObject: this, handlerMethod: "handleDropEvent"}
        ]);		
    }
    // Insert element
    parent.insertBefore(domNode,nextSibling);
    this.renderChildren(domNode,null);
    this.domNodes.push(domNode);
    // Stack of outstanding enter/leave events
    this.currentlyEntered = [];
};

DroppableWidget.prototype.leaveDrag = function(event) {
    var pos = this.currentlyEntered.indexOf(event.target);
    if(pos !== -1) {
        this.currentlyEntered.splice(pos,1);
    }
    // Remove highlighting if we're leaving externally. The hacky second condition is to resolve a problem with Firefox whereby there is an erroneous dragenter event if the node being dragged is within the dropzone
    if(this.currentlyEntered.length === 0 || (this.currentlyEntered.length === 1 && this.currentlyEntered[0] === $tw.dragInProgress)) {
        this.currentlyEntered = [];
        if(this.domNodes[0]) {
            $tw.utils.removeClass(this.domNodes[0],"tc-dragover");
        }
    }
};

DroppableWidget.prototype.execute = function() {
	this.droppableActions = this.getAttribute("actions");
	this.droppableEffect = this.getAttribute("effect","copy");
	this.droppableTag = this.getAttribute("tag");
	this.droppableClass = this.getAttribute("class");
	this.droppableEnable = (this.getAttribute("enable") || "yes") === "yes";
	// Make child widgets
	this.makeChildWidgets();
};