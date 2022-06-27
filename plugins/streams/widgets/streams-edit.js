/*\

title: $:/plugins/sq/streams/streams-edit
type: application/javascript
module-type: widget-subclass

\*/

exports.baseClass = "edit";
exports.name = "streams-edit";

exports.constructor = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
}
exports.prototype = {};

exports.prototype.getEditorType = function() {
	var tiddler = this.wiki.getTiddler(this.editTitle);
	var type = tiddler.fields.type || "text/vnd.tiddlywiki";
	var editorType;
	if(type === "text/vnd.tiddlywiki") {
		editorType = this.wiki.getTiddlerText("$:/config/sq/streams/editor-engine");
		if((!$tw.wiki.getTiddler("$:/plugins/tiddlywiki/codemirror") || $tw.wiki.getTiddlerText("$:/config/Plugins/Disabled/$:/plugins/tiddlywiki/codemirror","no") === "yes" || !$tw.modules.titles["$:/plugins/tiddlywiki/codemirror/edit-codemirror.js"]) && (editorType === "codemirror") ) {
			editorType = "text";
		}
		return editorType;
	}
	if(typeof EDITOR_MAPPING_PREFIX !== 'undefined' && EDITOR_MAPPING_PREFIX) {
		editorType = this.wiki.getTiddlerText(EDITOR_MAPPING_PREFIX + type);
	}
	if(!editorType) {
		var typeInfo = $tw.config.contentTypeInfo[type];
		if(typeInfo && typeInfo.encoding === "base64") {
			editorType = "binary";
		} else {
			editorType = "text";
		}
	}
	return editorType;
};