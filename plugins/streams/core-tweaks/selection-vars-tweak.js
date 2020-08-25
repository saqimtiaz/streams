/*\

title: $:/plugins/sq/streams/selection-vars-tweak.js
type: application/javascript
module-type: startup
\*/



var Widget = require("$:/core/modules/widgets/widget.js").widget;

Widget.prototype.selection_original_invokeActionString = Widget.prototype.invokeActionString;

Widget.prototype.invokeActionString = function(actions,triggeringWidget,event,variables) {
	//variables.selection = "xyz";
	if(!variables) {
		variables = {};
	}
	
	var activeElement = document.activeElement;
	var selection;
	if(activeElement && activeElement.tagName === "IFRAME") {
		var idoc = activeElement.contentDocument || activeElement.contentWindow.document;
		activeElement = idoc.activeElement;
		selection = idoc.getSelection();
	} else {
		selection = window.getSelection();
	}
	
	if(activeElement && selection && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
		variables["selectionStart"] = activeElement.selectionStart.toString();
		variables["selectionEnd"] = activeElement.selectionEnd.toString();
		variables["selection"] = selection.toString();
	}
	
	
	this.selection_original_invokeActionString(actions,triggeringWidget,event,variables);
}

