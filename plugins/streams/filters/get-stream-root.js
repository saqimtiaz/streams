/*\
title: $:/plugins/sq/streams/filters/get-stream-root.js
type: application/javascript
module-type: filteroperator

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function

//	[[xyz]get-stream-root[]]
//	[[xyz]get-stream-root:matchtitles[]]
//	[[xyz]get-stream-root:includeall,matchtitles[]]

*/
exports["get-stream-root"] = function(source,operator,options) {
	var results = [],
        suffixes = (operator.suffixes || []),
		includeAll = (suffixes[0] || []).indexOf("includeall") !== -1,
		matchTitles = (suffixes[0] || []).indexOf("matchtitles") !== -1;

	source(function(tiddler,title) {
		if(tiddler && tiddler.fields["parent"] && tiddler.fields["stream-type"]) {
			var parentTiddler = tiddler;
			while(parentTiddler && parentTiddler.fields.parent) {
				if(includeAll) {
					if(tiddler.fields.title.startsWith(parentTiddler.fields["title"]) || !matchTitles ) {
						//$tw.utils.pushTop(results,parentTiddler.fields.title);
						results.unshift(parentTiddler.fields.title);
					} else {
						//results.push(title);
						results.unshift(title);
					}
				}
				parentTiddler = options.wiki.getTiddler(parentTiddler.fields.parent);
			}
			if(!includeAll) {
				if(parentTiddler && parentTiddler.fields && ( tiddler.fields.title.startsWith(parentTiddler.fields["title"]) || !matchTitles ) ) {
					$tw.utils.pushTop(results,parentTiddler.fields.title);
				} else {
					results.push(title);
				}				
			}
		} else {
			results.push(title);
		}
	});
	return results;
};

})();

