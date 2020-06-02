var FramedEngine = require("$:/core/modules/editor/engines/framed.js").FramedEngine;

FramedEngine.prototype.focus = function() {
	if(this.domNode.focus && this.domNode.select) {
		this.domNode.focus();
		if(this.widget.getAttribute("select")==="false") {
			this.domNode.setSelectionRange(this.domNode.value.length,this.domNode.value.length);
		} else {
			this.domNode.select();
		}
	}
}