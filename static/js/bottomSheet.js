;(function($, window, document, undefined) {

"use strict";

$.fn.bottomSheet = function(parameters) {
	var $allModules = (typeof this === "function") ? $(window) : $(this);

	var query = arguments[0];
	var methodInvoked = (typeof query == 'string');
	var queryArguments = [].slice.call(arguments, 1);

	var returnedValue;

	$allModules.each(function() {
		var settings = ($.isPlainObject(parameters))
				? $.extend(true, {}, $.fn.bottomSheet.settings, parameters)
				: $.extend({}, $.fn.bottomSheet.settings);

		var namespace = settings.namespace;
		var eventNamespace = '.' + namespace;
		var moduleNamespace = 'module-' + namespace;

		// var selector = settings.selector;

		var $module = $(this);
		var element = this;
		var instance = $module.data(moduleNamespace);

		var $ui_dimm, $ui_sheetClose, $ui_body;

		var module = {
			initialize: function() {
				// $module.before('<div class="bottom-sheet-dimm"></div>');

				// $ui_dimm = $module.prev();
				$ui_sheetClose = $module.find("[data-action=sheet-close]");
				$ui_body = $("body");

				module.close();
				
				module.bind.events();				
				module.instantiate();
			},
			instantiate: function() {
				instance = module;
				$module.data(moduleNamespace, module);
			},
			open: function(duration) {
				var duration = (duration === undefined) ? settings.duration : duration;
				// $module.animate({
				// 	'bottom': 0
				// }, duration);
				$module.addClass('is-active');
				// $ui_dimm.fadeIn(duration);
				gfn_dim.show($module.css('z-index') - 1);
				// module.bodyHold(true);
				gfn_body.hold(true);
			},
			close: function(duration) {
				var duration = (duration === undefined) ? settings.duration : duration;
				// $module.animate({
				// 	'bottom': -$module.outerHeight()
				// }, duration);
				$module.removeClass('is-active');
				// $ui_dimm.fadeOut(duration);
				gfn_dim.hide();
				// module.bodyHold(false);
				gfn_body.hold(false);
			},
			// bodyHold: function(tf) {
			// 	if (tf) {
			// 		$uigfn_body.css("overflow","hidden");
			// 	} else {
			// 		$uigfn_body.css("overflow","");
			// 	}
			// },
			bind: {
				events: function() {
					// $ui_dimm.on('click' + eventNamespace, module.event.dimm_click);
					$ui_sheetClose.on('click' + eventNamespace, module.close);
				}
			},
			event: {
				dimm_click: function() {
					module.close();
				}
			},
			invoke: function(query, passedArguments, context) {
				var object = instance;
				var maxDepth, found, response;

				passedArguments = passedArguments || queryArguments;
				context = element || context;

				if (typeof query == 'string' && object !== undefined) {
					query = query.split(/[\. ]/);
					maxDepth = query.length - 1;
					$.each(query, function(depth, value) {
						var camelCaseValue = (depth != maxDepth)
								? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
						if ($.isPlainObject(object[camelCaseValue]) && (depth != maxDepth)) {
							object = object[camelCaseValue];
						} else if (object[camelCaseValue] !== undefined) {
							found = object[camelCaseValue];
							return false;
						} else if ($.isPlainObject(object[value]) && (depth != maxDepth)) {
							object = object[value];
						} else if (object[value] !== undefined) {
							found = object[value];
							return false;
						} else {
							return false;
						}
					});
				}
				if (typeof found === "function") {
					response = found.apply(context, passedArguments);
				} else if (found !== undefined) {
					response = found;
				}
				if (Array.isArray(returnedValue)) {
					returnedValue.push(response);
				} else if (returnedValue !== undefined) {
					returnedValue = [returnedValue, response];
				} else if (response !== undefined) {
					returnedValue = response;
				}
				return found;
			}
		};

		if (methodInvoked) {
			if (instance === undefined) {
				module.initialize();
			}
			module.invoke(query);
		} else {
			if (instance !== undefined) {
				instance.invoke('destroy');
			}
			module.initialize();
		}
	});
	return (returnedValue !== undefined) ? returnedValue : this;
} 

$.fn.bottomSheet.settings = {
	name: 'BottomSheet',
	namespace: 'bottomsheet',
	duration: 500
}

})(jQuery, window, document);
