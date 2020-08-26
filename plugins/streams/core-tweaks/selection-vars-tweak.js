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

$tw.hooks.addHook("th-page-refreshed",function handleEvent() {
	$tw.wiki.deleteTiddler("$:/state/sq/streams/caret-position");
});

/*

if(window.CodeMirror && document.activeElement.closest(".CodeMirror")) {
	var cm = document.activeElement.closest(".CodeMirror").CodeMirror;
	var cursor = cm.getCursor("start");
	var startRange = cm.getRange({"line":0,"ch":0},{"line":cursor.line,"ch":cursor.ch});
	var selectionStart = startRange.length;
	var selection = cm.getSelection();
	var selectionEnd = selectionStart + selection.length();
}

*/