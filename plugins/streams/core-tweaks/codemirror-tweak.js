/*\

title: $:/plugins/sq/streams/codemirror-tweak
type: application/javascript
module-type: startup

\*/

exports.platforms = ["browser"];
exports.synchronous = true;

exports.startup = function() {

	if($tw.wiki.getTiddler("$:/plugins/tiddlywiki/codemirror") && ($tw.wiki.getTiddlerText("$:/config/Plugins/Disabled/$:/plugins/tiddlywiki/codemirror","no") === "no")) {
		var CMEngine = require("$:/plugins/tiddlywiki/codemirror/engine.js").CodeMirrorEngine;
		CMEngine.prototype.focus = function() {
			this.cm.focus();
			var caretPosition = this.widget.getAttribute("caretPosition","end");	
			var index = (caretPosition === "end") ? this.cm.getValue().length : parseInt(caretPosition);
			this.cm.doc.setSelection(this.cm.doc.posFromIndex(index));
		}
	}

}