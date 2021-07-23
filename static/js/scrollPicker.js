;(function($, window, document, undefined) {

"use strict";

$.fn.scrollPicker = function(parameters) {
	var $allModules = (typeof this === "function") ? $(window) : $(this);
	// var moduleSelector = $allModules.selector || '';

	var query = arguments[0];
	var methodInvoked = (typeof query == 'string');
	var queryArguments = [].slice.call(arguments, 1);

	var returnedValue;

	$allModules.each(function() {
		var settings = ($.isPlainObject(parameters))
				? $.extend(true, {}, $.fn.scrollPicker.settings, parameters)
				: $.extend({}, $.fn.scrollPicker.settings);

		var namespace = settings.namespace;
		var eventNamespace = '.' + namespace;
		var moduleNamespace = 'module-' + namespace;

		var selector = settings.selector;

		var $module = $(this);
		var element = this;
		var instance = $module.data(moduleNamespace);

		var $ui_container;
		var swiper = {};

		var module = {
			initialize: function() {
				module.ui.build();
				module.bind.events();
				module.instantiate();
			},
			instantiate: function() {
				instance = module;
				$module.data(moduleNamespace, module);
			},
			bind: {
				events: function() {
					// $ui_button.on('click' + eventNamespace, module.event.button_click);
					// $ui_close.on('click' + eventNamespace, module.event.close_click);
				}
			},
			event: {
				// button_click: function() {
				// 	var returnArray = [];
				// 	for (var key in swiper) {
				// 		var text = swiper[key].slides[swiper[key].activeIndex].innerText;
				// 		var value = swiper[key].slides[swiper[key].activeIndex].dataset.value;
				// 		returnArray.push({ text: text, value: value });
				// 	}
				// 	settings.onClickButton(returnArray);
				// 	module.close();
				// },
				// close_click: function() {
				// 	module.close();
				// 	return false;
				// }
			},
			ui: {
				build: function() {
					$module.html(settings.template);
					$ui_container = $module.find(selector.container);
					// $ui_button = $module.find(selector.button);
					// $ui_close = $module.find(selector.close);
					// $ui_title = $module.find(selector.title);
					// $ui_wrap = $module.find(".picker-wrap");

					settings.pickers.map((picker) => {
						module.ui.swiper(picker.id, picker.width, picker.onChange);
						module.setOptions(picker.id, picker.options, picker.defaultIndex);
					});
				},
				swiper: function(id, width, onChange) {
					$ui_container.append(`<div class="swiper-container" id="${id}Picker" style="width:${width}"><div class="swiper-wrapper"></div></div>`);
					swiper[id] = new Swiper('#'+id+'Picker', {
						direction: 'vertical',
						slidesPerView: 5,
						centeredSlides: true,
						freeMode: true,
						freeModeSticky: true,
						on: {
							activeIndexChange: function(swiper) {
								if (swiper.slides[swiper.activeIndex]) {
									var text = swiper.slides[swiper.activeIndex].innerText;
									var value = swiper.slides[swiper.activeIndex].dataset.value;
									onChange(text, value);
								}
							}
						}
					});
				}
			},
			open: function() {
				// $ui_wrap.animate({bottom: 0}, 500);
			},
			close: function() {
				// $ui_wrap.animate({bottom: -380}, 500);
				// $ui_wrap.animation
			},
			setOptions: function(id, options, defaultIndex) {
				var defaultIndex = defaultIndex || 0;
				swiper[id].removeAllSlides();
				options.map((opt) => {
					swiper[id].appendSlide(`<div class="swiper-slide" data-value="${opt.value}">${opt.text}</div>`);
				});
				swiper[id].slideTo(defaultIndex, 0);
			},
			// setTextTitle: function(str) {
			// 	$ui_title.text(str);
			// },
			// setTextButton: function(str) {
			// 	$ui_button.text(str);
			// },
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

$.fn.scrollPicker.settings = {
	name: 'ScrollPicker',
	namespace: 'scrollpicker',
	template: '<div class="picker-container"></div>',
	selector: {
		container: '.picker-container'
	}
}

})(jQuery, window, document);

/*

$(".scroll-picker").scrollPicker({
	text: {
		title: '년월 선택'
	},
	onClickButton: function(array) {
		console.log("onClickButton");
		console.table(array);
	},
	pickers: [
		{
			id: 'year',
			width: '50%',
			options: [
				{ text: '2019년', value: 2019 },
				{ text: '2020년', value: 2020 },
				{ text: '2021년', value: 2021 },
				{ text: '2022년', value: 2022 },
				{ text: '2023년', value: 2023 },
				{ text: '2024년', value: 2024 },
				{ text: '2025년', value: 2025 },
				{ text: '2026년', value: 2026 },
				{ text: '2027년', value: 2027 },
				{ text: '2028년', value: 2028 }
			],
			defaultIndex: 2,
			onChange: function(text, value) {
				console.log(`text: ${text} , value: ${value}`);
			}
		},
		{
			id: 'month',
			width: '50%',
			options: [
				{ text: '1월', value: 1 },
				{ text: '2월', value: 2 },
				{ text: '3월', value: 3 },
				{ text: '4월', value: 4 },
				{ text: '5월', value: 5 },
				{ text: '6월', value: 6 },
				{ text: '7월', value: 7 },
				{ text: '8월', value: 8 },
				{ text: '9월', value: 9 },
				{ text: '10월', value: 10 },
				{ text: '11월', value: 11 },
				{ text: '12월', value: 12 }
			],
			defaultIndex: 3,
			onChange: function(text, value) {
				console.log(`text: ${text} , value: ${value}`);
			}
		}
	]
});

function aaa() {
	$(".scroll-picker").scrollPicker("setOptions", "month", [
		{text:'A',value:'a'},
		{text:'B',value:'b'},
		{text:'C',value:'c'}
	], 1)
}

*/