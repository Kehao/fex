// JavaScript Document
define(["jquery", "easing"], function(require, exports, module){
    var $ = require('jquery');
	$.tabs = {
		slideUp : function(_this){
			var height = $(this).outerHeight(),
				_height = height * (_this.i);
			$(this).parent().animate({
				"margin-top" : "-" + _height + "px"
			}, "fast");
		},
		slideDown : function(_this){
			var height = $(this).outerHeight(),
				_height = height * (_this.i);
			$(this).parent().parent().animate({
				"margin-top" : "-" + _height + "px"
			}, "fast");
		}
	}
	
	$.fn.tabs = function(elements, options){
		options = $.extend({
			auto : false,
			effect : "normal",
			event : "click",
			callback : null,
			curCls : "current",
			delay : 2000
		}, options || {});
		
		var _tabs = new tabs(this, elements, options);
			_tabs.init();
		
		return this;
	}
	
	var tabs = function(_this, elements, options){
		this.config = options;
		this.triggerDoms = _this;
		this.contextDoms = $(elements);
		this.timer = null;
		this.i = -1;
	}
	
	tabs.prototype.init = function(){
		var _this = this;
		this.triggerDoms
		.on(this.config.event, function(e, cb){
			var i = $.inArray(this, _this.triggerDoms.toArray());
			_this.i = i;
			if ( $.tabs[_this.config.effect] == undefined ){
				_this.triggerDoms.removeClass(_this.config.curCls);
				$(this).addClass(_this.config.curCls);
				_this.contextDoms.hide();
				_this.contextDoms.eq(i).show();
				$.isFunction(cb) && cb();
				$.isFunction(_this.config.callback) && _this.config.callback.call(this, _this.triggerDoms.eq(i), _this);
			}else{
				_this.triggerDoms.removeClass(_this.config.curCls);
				$(this).addClass(_this.config.curCls);
				$.isFunction(cb) && cb();
				$.tabs[_this.config.effect].call(_this.contextDoms.eq(i), _this);
			}
		})
		// .on("mouseover", function(){
		// 	try{
		// 		clearInterval(_this.timer);
		// 	}catch(e){}
		// })
		// .on("mouseout", function(){
		// 	if ( _this.config.auto === true ){
		// 		_this.auto();
		// 	}
		// })
		.eq(0)
		.trigger(this.config.event);
		//.trigger("mouseout");

		if ( _this.config.auto === true ){
			_this.auto();
		}
		
		this.contextDoms.on("mouseover", function(){
			try{
				clearInterval(_this.timer);
			}catch(e){}
		})
		.on("mouseout", function(){
			if ( _this.config.auto === true ){
				_this.auto();
			}
		});
	}
	
	tabs.prototype.auto = function(){
		var _this = this;
		this.timer = setTimeout(function(){
			_this.i++;
			if ( _this.i > (_this.triggerDoms.length - 1) ){
				_this.i = 0;
			}
			_this.triggerDoms.eq(_this.i).trigger(_this.config.event, function(){
				_this.auto();
			});
		}, this.config.delay || 1000);
	}
	
	return tabs;
});
