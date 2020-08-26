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
			var caretPosition = this.widget.getAttribute("caretPosition","end");
			caretPosition = (caretPosition === "end") ? this.domNode.value.length : parseInt(caretPosition);
			this.domNode.setSelectionRange(caretPosition,caretPosition);
		} else {
			this.domNode.select();
		}
	}
}