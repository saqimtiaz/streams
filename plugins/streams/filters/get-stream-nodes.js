/*\
title: $:/plugins/sq/streams/filters/get-stream-nodes.js
type: application/javascript
module-type: filteroperator

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports["get-stream-nodes"] = function(source,operator,options) {
	var results = [],
        suffixes = (operator.suffixes || []),
		matchTitles = (suffixes[0] || []).indexOf("matchtitles") !== -1;

	source(function(tiddler,title) {
		
		var processNode = function(node,nodeTitle) {
			if(node && node.fields["stream-list"] && node.fields["stream-type"]) {
				results.push(nodeTitle);
				var streamList = $tw.utils.parseStringArray(node.fields["stream-list"]);
				$tw.utils.each(streamList,function(streamListNodeTitle) {
					var streamListNode = options.widget.wiki.getTiddler(streamListNodeTitle);
					if(streamListNode) {
						processNode(streamListNode,streamListNodeTitle);
					}
				});
			} else {
				results.push(nodeTitle);
			}
		}
		if(tiddler) {
			processNode(tiddler,title);
		}
	});
	return results;
};

})();
