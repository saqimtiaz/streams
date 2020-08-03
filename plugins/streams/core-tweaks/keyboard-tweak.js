/*\

title: $:/plugins/sq/streams/keyboard-tweak
type: application/javascript
module-type: startup

\*/

var kb = require("$:/core/modules/widgets/keyboard.js").keyboard;

kb.prototype.render = function(parent,nextSibling) {
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
	this.preventDefault = this.getAttribute("preventDefault") == "false" ? false : true;	
	domNode.addEventListener("keydown",function (event) {
		if($tw.keyboardManager.checkKeyDescriptors(event,self.keyInfoArray)) {
			self.invokeActions(self,event);
			if(self.actions) {
				self.invokeActionString(self.actions,self,event);
			}
			self.dispatchMessage(event);
			event.stopPropagation();
			if(self.preventDefault) {
				event.preventDefault();
			}
			return true;
		}
		return false;
	},false);
	// Insert element
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);
	this.domNodes.push(domNode);	
}