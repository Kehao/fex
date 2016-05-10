// JavaScript Document
/*
 * options :
 * 			{
 *	 			text : "" // 文本，或者html代码,
 *				effect : "" // 动画效果 默认opacityTop
 *				callback : null  // 回调函数 this 指向触发节点
 *			}
 * trigger method : $(element).trigger('tipShow', options);
 * css :
 * .ui-show-tip{} 自定义,如果需要依赖关系处理，在define中加依赖关系的CSS
 */
define(function() { return function($) {
	
	$.fn.flowTips = function(name){		
		$(this).on(name, function(e, json){
			json = $.extend({
				text : "+2",
				effect : "opacityTop"
			}, json || {});
			
			var tpl = '<div class="ui-show-tip">' + json.text + '</div>';
			var el = $(tpl).appendTo("body");
			el.css("position", "absolute");
			
			var offset = $(this).offset();
			var els = getSize.call(el);
			var thisInfo = getSize.call(this);
			var _this = this;
			
			if ( $.flowTips[json.effect] !== undefined ){
				$.flowTips[json.effect].call(el, offset, els, thisInfo, _this, json.callback);
			}
			
			// el 弹出框对象
			// offset 触发对象的offset
			// els 弹出框对象的宽高值
			// thisInfo 触发对象的宽高值
			// _this 触发对象
			// json.callback 回调函数
		});
		
		return this;
	}
	
	$.flowTips = {
		opacityTop : function(offset, els, thisInfo, _this, callback){
			
			var top = offset.top - els.height,
				left = offset.left + ((thisInfo.width - els.width) / 2);
				
			$(this)
			.css({
				top : (top - els.height) + "px",
				left : left + "px",
				opacity : 0
			})
			.animate(
				{
					top : top + "px",
					opacity : 1
				}, 
				"fast", 
				function(){
					$(this)
					.delay(1000)
					.animate(
						{
							opacity : 0
						}, 
						"fast", 
						function(){
							$(this).remove();
							$.isFunction(callback) && callback(_this);
						}
					);
				}
			);
		}
	}
	
	function getSize(){
		return {
			width : $(this).outerWidth(),
			height : $(this).outerHeight()
		}
	}
	
}});
