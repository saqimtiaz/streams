/*\

title: $:/plugins/sq/streams/framed-engine-tweak
type: application/javascript
module-type: startup

\*/

var FramedEngine = require("$:/core/modules/editor/engines/framed.js").FramedEngine;

FramedEngine.prototype.focus = function() {
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