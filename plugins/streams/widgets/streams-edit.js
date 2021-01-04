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
	if(type === "text/vnd.tiddlywiki") {
		return this.wiki.getTiddlerText("$:/config/sq/streams/editor-engine");
	}
	var editorType = this.wiki.getTiddlerText(EDITOR_MAPPING_PREFIX + type);
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