/*\
title: $:/plugins/sq/lib/swipeevents.js
type: application/javascript
module-type: library
Based on https://github.com/john-doherty/swiped-events
https://github.com/umanghome/swipe-listener
https://github.com/scriptex/touchsweep/blob/master/src/touchsweep.js
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.platforms = ["browser"];

function SwipeEventsFactory(element,options) {

	if(typeof window.CustomEvent !== 'function') {
		
		window.CustomEvent = function (event, params) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		};
		window.CustomEvent.prototype = window.Event.prototype;
	}
	
	if(!element) {
		return;
	}
	element.addEventListener("touchstart", handleTouchStart, false);
	element.addEventListener("touchmove", handleTouchMove, false);
	element.addEventListener("touchend", handleTouchEnd, false);
	
	options = options || {};
	
	var xDown = null,
		yDown = null,
		xDiff = null,
		yDiff = null,
		timeDown = null,
		startEl = null,
		defaults = {
			"swipe-threshold": 20,
			"swipe-timeout": 500
		};
		
	$tw.utils.extend(defaults,options);	

	/**
	 * Fires swiped event if swipe detected on touchend
	 * @param {object} e - browser event object
	 * @returns {void}
	 */
	function handleTouchEnd(e) {

		// if the user released on a different target, cancel!
		if (startEl !== e.target) return;

		var swipeThreshold = parseInt(getNearestAttribute(startEl, 'data-swipe-threshold', defaults["swipe-threshold"]), 10); // default 20px
		var swipeTimeout = parseInt(getNearestAttribute(startEl, 'data-swipe-timeout', defaults["swipe-timeout"]), 10);	   // default 500ms
		var timeDiff = Date.now() - timeDown;
		var eventType = '';
		var changedTouches = e.changedTouches || e.touches || [];

		if (Math.abs(xDiff) > Math.abs(yDiff)) { // most significant
			if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
				if (xDiff > 0) {
					eventType = 'swiped-left';
				}
				else {
					eventType = 'swiped-right';
				}
			}
		}
		else if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
			if (yDiff > 0) {
				eventType = 'swiped-up';
			}
			else {
				eventType = 'swiped-down';
			}
		}

		if (eventType !== '') {

			var eventData = {
				dir: eventType.replace(/swiped-/, ''),
				xStart: parseInt(xDown, 10),
				xEnd: parseInt((changedTouches[0] || {}).clientX || -1, 10),
				yStart: parseInt(yDown, 10),
				yEnd: parseInt((changedTouches[0] || {}).clientY || -1, 10)
			};

			// fire `swiped` event event on the element that started the swipe
			startEl.dispatchEvent(new CustomEvent('swiped', { bubbles: true, cancelable: true, detail: eventData }));

			// fire `swiped-dir` event on the element that started the swipe
			startEl.dispatchEvent(new CustomEvent(eventType, { bubbles: true, cancelable: true, detail: eventData }));
		}

		// reset values
		xDown = null;
		yDown = null;
		timeDown = null;
	}

	/**
	 * Records current location on touchstart event
	 * @param {object} e - browser event object
	 * @returns {void}
	 */
	function handleTouchStart(e) {

		// if the element has data-swipe-ignore="true" we stop listening for swipe events
		if (e.target.getAttribute('data-swipe-ignore') === 'true') return;

		startEl = e.target;

		timeDown = Date.now();
		xDown = e.touches[0].clientX;
		yDown = e.touches[0].clientY;
		xDiff = 0;
		yDiff = 0;
	}

	/**
	 * Records location diff in px on touchmove event
	 * @param {object} e - browser event object
	 * @returns {void}
	 */
	function handleTouchMove(e) {

		if (!xDown || !yDown) return;

		var xUp = e.touches[0].clientX;
		var yUp = e.touches[0].clientY;

		xDiff = xDown - xUp;
		yDiff = yDown - yUp;
	}

	/**
	 * Gets attribute off HTML element or nearest parent
	 * @param {object} el - HTML element to retrieve attribute from
	 * @param {string} attributeName - name of the attribute
	 * @param {any} defaultValue - default value to return if no match found
	 * @returns {any} attribute value or defaultValue
	 */
	function getNearestAttribute(el, attributeName, defaultValue) {

		// walk up the dom tree looking for data-action and data-trigger
		while (el && el !== document.documentElement) {

			var attributeValue = el.getAttribute(attributeName);

			if (attributeValue) {
				return attributeValue;
			}

			el = el.parentNode;
		}

		return defaultValue;
	}
};

exports.SwipeEvents = SwipeEventsFactory;

})();