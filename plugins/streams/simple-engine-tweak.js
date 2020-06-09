/*\

title: $:/plugins/sq/streams/simple-engine-tweak
type: application/javascript
module-type: startup

\*/

var SimpleEngine = require("$:/core/modules/editor/engines/simple.js").SimpleEngine;

SimpleEngine.prototype.focus = function() {
	if(this.domNode.focus && this.domNode.select) {
		this.domNode.focus();
		if(this.widget.getAttribute("select")==="false") {
			this.domNode.setSelectionRange(this.domNode.value.length,this.domNode.value.length);
		} else {
			this.domNode.select();
		}
	}
}