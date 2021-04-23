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
			while(parentTiddler) {
					if(tiddler.fields.title.startsWith(parentTiddler.fields["title"].split("/")[0]) || !matchTitles ) {
						results.unshift(parentTiddler.fields.title);
					} else {
						break;
					}
				if(parentTiddler.fields.parent) {	
					parentTiddler = options.wiki.getTiddler(parentTiddler.fields.parent);
				} else {
					break;
				}
			}
		} else {
			results.push(title);
		}
		if(!includeAll) {
			results.splice(1);
		}		
	});
	return results;
};

})();

