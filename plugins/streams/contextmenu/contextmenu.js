/*\

title: $:/plugins/sq/streams/contextmenu/contextmenu
type: application/javascript
module-type: widget-subclass

\*/
(function(){
	
exports.baseClass = "button";

exports.name = "contextmenu";
	
exports.constructor = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

exports.prototype = {};	

exports.prototype.render = function(parent,nextSibling) {
	var self = this;
	// Remember parent
	this.parentDomNode = parent;
	// Compute attributes and execute state
	this.computeAttributes();
	this.execute();
	// Create element
	var tag = "div";
	if(this.buttonTag && $tw.config.htmlUnsafeElements.indexOf(this.buttonTag) === -1) {
		tag = this.buttonTag;
	}
	var domNode = this.document.createElement(tag);
	this.domNode = domNode;
	var classes = this.getAttribute("class","").split(" ");;
	var isPoppedUp = (this.popup || this.popupTitle) && this.isPoppedUp();
	if(this.selectedClass) {
		if((this.set || this.setTitle) && this.setTo && this.isSelected()) {
			$tw.utils.pushTop(classes,this.selectedClass.split(" "));
		}
	}
	if(isPoppedUp) {
		$tw.utils.pushTop(classes,"tc-popup-handle");
	}	
	classes.push("sq-contextmenu-container");
	domNode.className = classes.join(" ");	
	domNode.addEventListener("contextmenu",function(event) {
		event.preventDefault();
		if(self.popup || self.popupTitle) {
			self.triggerPopup(event);
			if(self.set || self.setTitle) {
				self.setTiddler();
				handled = true;
			}
			if(self.actions) {
				self.invokeActionString(self.actions,self,event);
			}
		}
	});
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);
	this.domNodes.push(domNode);	
}

})();