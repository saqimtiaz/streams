/*\

title: $:/plugins/sq/streams/refresh-hook.js
type: application/javascript
module-type: startup
\*/

$tw.hooks.addHook("th-page-refreshed",function handleEvent() {
	$tw.wiki.deleteTiddler("$:/state/sq/streams/caret-position");
});

