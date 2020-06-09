/*\
title: $:/plugins/sq/streams/delete-hook/hook
type: application/javascript
module-type: startup

\*/

$tw.hooks.addHook("th-deleting-tiddler",function(tiddler) {
	if(tiddler.fields["draft.of"]) {
		return;
	}
	
	var executeDeleteHookTiddlers = function(tag) {
		$tw.utils.each($tw.wiki.filterTiddlers("[all[shadows+tiddlers]tag[" + tag + "]!has[draft.of]]"),function(title) {
			var parser = $tw.wiki.parseText("text/vnd.tiddlywiki",$tw.wiki.getTiddlerText(title),{
					parentWidget: $tw.rootWidget,
					document: this.document
				}),
				widgetNode = $tw.wiki.makeWidget(parser,{
					parentWidget: $tw.rootWidget,
					document: this.document,
					variables: {currentTiddler : tiddler.fields.title}
				});
			var container = this.document.createElement("div");
			widgetNode.render(container,null);
			widgetNode.invokeActions(this,null);	
		});
	}
	
	executeDeleteHookTiddlers("$:/tags/deleteTiddlerAction");

});