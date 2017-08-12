/**
 * jQuery Unveil 2
 * A very lightweight jQuery plugin to lazy load images
 *
 * Licensed under the GPL 3 license.
 * Copyright 2017 Nereo Costacurta
 * https://github.com/madebycambiamentico
 */
(function(wdw,$) {

	// oRefSet = optional reference object which will contain some useful function and properties:
	//			options -> update options object. take object. returns options object (see below)
	//			addImgs -> add images to current set. take selector (string or jquery object). returns new set.
	//			delImgs -> remove images from current set. take selector (string or jquery object). returns new set.
	$.fn.unveil = function(options, oRefSet) {
		
		var $images = this,			// original set of selected images, for example $('#gallery img.lazy')
			loaded,					// temp variable. Will contain the images unveiled each scroll event*
			$window = $(wdw);
		
		options = $.extend({
			thr		: [0,0],					// threshold (top and bottom): how much pixel down the image has to be (in the viewport) to be unveiled
												// - positive values -> load image when at least 'thr' pixels are into view;
												// - negative values -> pre-load images outside view.
			uclass	: "unveiled",				// which class to add when image is unveiled
			hasEnd	: undefined === oRefSet		// stop script when all images in set are unveiled
		}, options);
		
		if (oRefSet){
			oRefSet.options = function(o){ // edit current options
				options = $.extend(options, o);
				return options;
			};
			oRefSet.addImgs = function(selector){ // add images to the set
				return $images.add(selector);
			};
			oRefSet.delImgs = function(selector){ // remove images from set
				$images = $images.not(selector);
				return $images;
			};
		}

		/*function getDocHeight(){
			return Math.max(
				$(document).height(),
				$window.height(),
				// For opera:
				document.documentElement.clientHeight
			);
		};*/
		
		function unveilTrigger() {
			// if an image has data-src attribute, unveil it when conditions are met (see below)
			var source = $(this).data("src");
			if (source) {
				this.src = source;
			}
		}
		$images.one("unveil", unveilTrigger);

		var rect,
			wh = $window.height();
				// updater for window height
				$window.on("resize.unveil", function(){
					wh = $window.height();
				});
		// main unveil function: resize the images set when unveiled, calculate if any image is in view
		function unveil() {
			var inview = $images.filter(function() {
				if (this.offsetParent === null) return false; // check if element is display none (or its parents)
				rect = this.getBoundingClientRect();
				return (
					(										// *** image SHORTER than window height
						rect.top >= options.thr[0]			// top border greater than top of the window (plus some threshold)
						&& rect.top <= wh-options.thr[1]	// top border is higher than bottom of the window (minus some threshold)
					) || (									// *** image TALLER than window height
						rect.top <= options.thr[0]			// threshold counted as a window reduced height.
						&& rect.bottom >= wh-options.thr[1]	// threshold should not be greater than 1/2 wiewport height.
					) ||									// *** images in first row could be skipped. Prevent this from happening here...
						this.offsetTop <= options.thr[0]
				);
			});
			// show images in view, add class "unveiled"
			loaded = inview.addClass(options.uclass).trigger("unveil");
			// update images set to be unveiled
			$images = $images.not(loaded);
			// return number of images not yet unveiled
			return $images.length;
		}
		
		var raf = wdw.requestAnimationFrame ||
			wdw.webkitRequestAnimationFrame ||
			wdw.mozRequestAnimationFrame ||
			wdw.msRequestAnimationFrame ||
			wdw.oRequestAnimationFrame ||
			false;
		if (raf){
			// very high performance scroll events, using requestAnimationFrame
			console.info("Using requestAnimationFrame for unveil detection");
			var lastScrollTop = $window.scrollTop();
			function loop() {
				var scrollTop = $window.scrollTop();
				if (lastScrollTop === scrollTop) {
					raf(loop);
					return;
				} else {
					lastScrollTop = scrollTop;
					// fire scroll function if scrolls vertically
					if (unveil() || !options.hasEnd) raf(loop);
					else $window.off(".unveil");
				}
			}
			$window.on('resize.unveil',function(){raf(loop)});
			loop();
		}
		else{
			// high performance scroll events, if requestAnimationFrame isn't available
			console.info("Using scroll event 100ms for unveil detection");
			var waiting = false, endScrollHandle;
			$window.on("scroll.unveil resize.unveil", function () {
				if (waiting) {
					return;
				}
				waiting = true;
				// clear previous scheduled endScrollHandle
				clearTimeout(endScrollHandle);
				unveil();
				setTimeout(function () {
					waiting = false;
				}, 100);
				// schedule an extra execution of scroll() after 200ms
				// in case the scrolling stops in next 100ms
				endScrollHandle = setTimeout(function () {
					if (!unveil() && options.hasEnd) $window.off(".unveil");
				}, 200);
			});
		}
		
		//first row 
		unveil();

		return this;
	};

})(window,jQuery);
