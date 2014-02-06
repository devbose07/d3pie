define([
	"constants",
	"mediator",
	"hbs!eventsTabTemplate"
], function(C, mediator, eventsTabTemplate) {
	"use strict";

	var _MODULE_ID = "eventsTab";

	// this module's a mess
	var _callbackInfo = {
		onload: {
			enabled: false,
			displayStr: "function() { console.log(\"loaded.\"); }",
			func: function() { console.log("loaded."); }
		},
		onMouseoverSegment: {
			enabled: false,
			displayStr: "function(info) { console.log(\"mouseover:\", info); }",
			func: function(seg) { console.log("mouseover:", seg); }
		},
		onMouseoutSegment: {
			enabled: false,
			displayStr: "function(info) { console.log(\"mouseout:\", info); }",
			func: function(seg) { console.log("mouseout:", seg); }
		},
		onClickSegment: {
			enabled: false,
			displayStr: "function(info) { console.log(\"click:\", info); }",
			func: function(seg) { console.log("click:", seg); }
		}
	};



	var _render = function(config) {

		// tack on the callbacks. These can't be edited - they're just included so the user (developer, really)
		// can see them get fired & so that they're included in the
		config.callbacks = {
			onload: _callbackInfo.onload.displayStr,
			onMouseoverSegment: _callbackInfo.onMouseoverSegment.displayStr,
			onMouseoutSegment: _callbackInfo.onMouseoutSegment.displayStr,
			onClickSegment: _callbackInfo.onClickSegment.displayStr
		};

		$("#eventsTab").html(eventsTabTemplate({
			config: config
		}));


		$(".callbackCheckbox").on("change", _onChangeCheckbox);
	};

	var _onChangeCheckbox = function(e) {
		var isChecked = e.target.checked;
		var prop = $(e.target).data("prop");
		var $callbackCode = $(e.target).closest(".row").find(".callbackCode");

		// bah! Verbose. Rethink this.

		var func = null;
		if (isChecked) {
			$callbackCode.removeClass("disabledText");

			switch (prop) {
				case "callbacks.onload":
					_callbackInfo.onload.enabled = true;
					func = _callbackInfo.onload.func;
					break;
				case "callbacks.onMouseoverSegment":
					_callbackInfo.onMouseoverSegment.enabled = true;
					func = _callbackInfo.onMouseoverSegment.func;
					break;
				case "callbacks.onMouseoutSegment":
					_callbackInfo.onMouseoutSegment.enabled = true;
					func = _callbackInfo.onMouseoutSegment.func;
					break;
				case "callbacks.onClickSegment":
					_callbackInfo.onClickSegment.enabled = true;
					func = _callbackInfo.onClickSegment.func;
					break;
			}
		} else {
			$callbackCode.addClass("disabledText");

			switch (prop) {
				case "callbacks.onload":
					_callbackInfo.onload.enabled = false;
					break;
				case "callbacks.onMouseoverSegment":
					_callbackInfo.onMouseoverSegment.enabled = false;
					break;
				case "callbacks.onMouseoutSegment":
					_callbackInfo.onMouseoutSegment.enabled = false;
					break;
				case "callbacks.onClickSegment":
					_callbackInfo.onClickSegment.enabled = false;
					break;
			}
		}

		console.log("setting " + prop + ", ", func);

		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP, {
			prop: prop,
			value: func
		});
	}

	var _getTabData = function() {
		return {
			onload: (_callbackInfo.onload.enabled) ? _callbackInfo.onload.func : null,
			onMouseoverSegment: (_callbackInfo.onMouseoverSegment.enabled) ? _callbackInfo.onMouseoverSegment.func : null,
			onMouseoutSegment: (_callbackInfo.onMouseoutSegment.enabled) ? _callbackInfo.onMouseoutSegment.func : null,
			onClickSegment: (_callbackInfo.onClickSegment.enabled) ? _callbackInfo.onClickSegment.func : null
		};
	};

	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});