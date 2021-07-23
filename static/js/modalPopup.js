(function($, window, document, undefined) {

"use strict";

$.fn.modalPopup = function(parameters) {
	var $allModules = (typeof this === "function") ? $(window) : $(this);

	var query = arguments[0];
	var methodInvoked = (typeof query == 'string');
	var queryArguments = [].slice.call(arguments, 1);

	var returnedValue;

	$allModules.each(function(){
		var settings = ($.isPlainObject(parameters)) 
			? $.extend(true, {}, $.fn.modalPopup.settings, parameters) 
			: $.extend({}, $.fn.modalPopup.settings);

		var namespace = settings.namespace;

		var eventNamespace = '.' + namespace;
		var moduleNamespace = 'module-' + namespace;

		var selector = settings.selector;

		var $module = $(this);
		var $body = $("body");
		var $dimm;
		var $wrap = $module;
		var $btnOk = $module.find(selector.buttonOk);
		var $btnCancel = $module.find(selector.buttonCancel);

		var instance = $module.data(moduleNamespace);

		var element = this;
		var module;

		module = {
			initialize: function() {
				$module.before('<div class="dim" style="z-index:399;display:none;"></div>');
				$dimm = $module.prev();
				module.bind.events();
				module.instantiate();
			},

			instantiate: function() {
				instance = module;
				$module.data(moduleNamespace, module);
			},

			destroy: function() {
				$module.removeData(moduleNamespace).off(eventNamespace);
				$dimm.off(eventNamespace);
				$btnOk.off(eventNamespace);
				$btnCancel.off(eventNamespace);
				if (settings.autoDestroy) {
					$module.remove();
					$dimm.remove();
				}
			},

			bind: {
				events: function() {
					//$dimm.on('click' + eventNamespace, module.close);
					// $dimm.on('click' + eventNamespace, function(e) {
					// 	e.stopPropagation();
					// 	module.close();
					// });
					$btnOk.on('click' + eventNamespace, module.event.clickOk);
					$btnCancel.on('click' + eventNamespace, module.event.clickCancel);
				}
			},

			event: {
				clickOk: function() {
					settings.onOk.call(this);
					module.close();
				},
				clickCancel: function() {
					settings.onCancel.call(this);
					module.close();
				}
			},

			open: function() {
				$body.addClass("is-hold");
				$dimm.fadeIn(settings.duration);
				$wrap.fadeIn(settings.duration);				
			},

			close: function() {
				$body.removeClass("is-hold");
				$dimm.fadeOut(settings.duration);
				$wrap.fadeOut(settings.duration, function() {
					if (settings.autoDestroy) {
						module.destroy();
					}
				});
			},

			invoke: function(query, passedArguments, context) {
				var object = instance;
				var maxDepth;
				var found;
				var response;

				passedArguments = passedArguments || queryArguments;
				context = element || context;

				if (typeof query == 'string' && object !== undefined) {
					query = query.split(/[\. ]/);
					maxDepth = query.length - 1;
					$.each(query, function(depth, value) {
						var camelCaseValue = (depth != maxDepth)
							? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
							: query;

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
};

$.fn.modalPopup.settings = {
	name: 'ModalPopup',
	namespace: 'modalpopup',
	selector: {
		buttonOk:     '.btn-area button.ok',
		buttonCancel: '.btn-area button.cancel'
	},
	onOk: function() {},
	onCancel: function() {},
	autoDestroy: false,
	duration: 300
}

var modalPopupIdx = 0;

function modalPopup(parameters) {
	var defaultSettings = {
		title: "알림",
		message: "알림 메시지",
		type: "alert",	// alert , confirm
		textOkButton: "확인",
		textCancelButton: "취소",
		onOk: undefined
	}

	var settings = ($.isPlainObject(parameters))
		? $.extend(true, {}, defaultSettings, parameters)
		: $.extend({}, defaultSettings);

	modalPopupIdx++;

	var id = "MD" + modalPopupIdx;
	var html = '';
	// html += `	<div class="modal-popup" id="${id}">`;
	// html += `		<div class="modal-popup-dimm"></div>`;
	// html += `		<div class="modal-popup-container">`;
	// html += `			<div class="popup-wrap">`;
	// html += `				<div class="popup-header">`;
	// html += `					<strong class="title">${settings.title}</strong>`;
	// html += `				</div>`;
	// html += `				<div class="popup-body">`;
	// html += `					<p class="static">`;
	// html += `						${settings.message}`;
	// html += `					</p>`;
	// html += `				</div>`;
	// html += `				<div class="popup-button">`;
	// if (settings.type === "confirm") {
	// 	html += `					<button class="cancel" type="button">${settings.textCancelButton}</button>`;
	// }
	// html += `					<button class="ok" type="button">${settings.textOkButton}</button>`;
	// html += `				</div>`;
	// html += `			</div>`;
	// html += `		</div>`;
	// html += `	</div>`;
	html += `	<div class="modal" id="${id}">`;
	if (settings.title != "") {
		html += `		<div class="modal_header">`;
		html += `			<strong class="tit">${settings.title}</strong>`;
		html += `		</div>`;
	}
	html += `		<div class="modal_contents">`;
	html += `			${settings.message}`;
	html += `		</div>`;
	html += `		<div class="modal_buttons btn-area">`;
	if (settings.type === "confirm") {
		html += `					<button class="btn-solid_sticky lv2 cancel"><span>${settings.textCancelButton}</span></button>`;
	}
	html += `			<button class="btn-solid_sticky ok"><span>${settings.textOkButton}</span></button>`;
	html += `		</div>`;
	html += `	</div>`;

	$(".layered").append(html);

	var $id = $("#"+id);
	var opts = {};
	opts.autoDestroy = true;
	
	if (typeof settings.onOk === "function") {
		opts.onOk = settings.onOk;
	}
	if (typeof settings.onCancel === "function") {
		opts.onCancel = settings.onCancel;
	}
	
	$id.modalPopup(opts);
	$id.modalPopup("open");
}

window.modalPopup = modalPopup;

})(jQuery, window, document);
