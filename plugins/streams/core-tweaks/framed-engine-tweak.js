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
	/*
	if(!this.setupDblClick) {
		this.domNode.addEventListener("dblclick",this.propagateDblClick.bind(this));
		this.setupDblClick = true;
	}
	*/
}

/*
FramedEngine.prototype.propagateDblClick = function(event) {
	if(this.widget.wiki.getTiddlerText("$:/config/sq/streams/dblclick-editor-to-exit") === "yes") {
		var newEvent = this.widget.document.createEventObject ? this.widget.document.createEventObject() : this.widget.document.createEvent("Events");
		if(newEvent.initEvent) {
			newEvent.initEvent("dblclick", true, true);
		}
		newEvent.keyCode = event.keyCode;
		newEvent.which = event.which;
		newEvent.metaKey = event.metaKey;
		newEvent.ctrlKey = event.ctrlKey;
		newEvent.altKey = event.altKey;
		newEvent.shiftKey = event.shiftKey;
		return !this.widget.parentDomNode.dispatchEvent(newEvent);
	}
	return false;
}
*/