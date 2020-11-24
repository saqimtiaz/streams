/*\

title: $:/plugins/sq/streams/btn-dblclick
type: application/javascript
module-type: widget-subclass

\*/
(function(){
	
exports.baseClass = "button";

exports.name = "btn-dblclick";
	
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
	var classes = this["class"].split(" ") || [];
	domNode.className = classes.join(" ");
	domNode.addEventListener("dblclick",function(event) {
		event.preventDefault();
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection) {
			document.selection.empty();
		}
		if(self.set || self.setTitle) {
			self.setTiddler();
		}
		if(self.actions) {
			self.invokeActionString(self.actions,self,event);
		}
		var x = self.invokeActions(self,event);
		return true;
	},false);
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);
	this.domNodes.push(domNode);	
}	
	
})();