(function($) {
	var fgm = {
		on: function(element, type, handler) {
			return element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent("on" + type, handler)
		},
		bind: function(object, handler) {
			return function() {
				return handler.apply(object, arguments)	
			}
		},
		pageX: function(element) {
			return element.offsetLeft + (element.offsetParent ? arguments.callee(element.offsetParent) : 0)
		},
		pageY: function(element) {
			return element.offsetTop + (element.offsetParent ? arguments.callee(element.offsetParent) : 0)	
		},
		hasClass: function(element, className) {
			return new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className)
		},
		attr: function(element, attr, value) {
			if(arguments.length == 2) {
				return element.attributes[attr] ? element.attributes[attr].nodeValue : undefined
			}
			else if(arguments.length == 3) {
				element.setAttribute(attr, value)
			}
		}
	};
	//延时加载
	function LazyLoad(obj) {
		this.lazy = typeof obj === "string" ? document.getElementById(obj) : obj;
		this.aImg = this.lazy.getElementsByTagName("img");
		this.fnLoad = fgm.bind(this, this.load);
		this.load();
		fgm.on(this.lazy, "scroll", this.fnLoad);
		fgm.on(this.lazy, "resize", this.fnLoad);
	}
	
	LazyLoad.prototype = {
		load: function() {
			var iScrollTop = this.lazy.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
			var iClientHeight = (this.lazy.clientHeight || document.documentElement.clientHeight) + iScrollTop;
			iScrollTop-=200;
			iClientHeight+=200;
			var i = 0;
			var aParent = [];
			var oParent = null;
			var iTop = 0;
			var iBottom = 0;
			var aNotLoaded = this.loaded(0);
			var srcImg = 0;
			if(this.loaded(1).length != this.aImg.length) {
				for(i = 0; i < aNotLoaded.length; i++) {
					oParent = aNotLoaded[i].parentElement || aNotLoaded[i].parentNode;
					iTop = fgm.pageY(oParent);
					iBottom = iTop + oParent.offsetHeight;
					
					srcImg = fgm.attr(aNotLoaded[i], "data-img");
					// if(srcImg){
					// 	this.preImg(srcImg);
					// }
					
					if((iTop > iScrollTop && iTop < iClientHeight) || (iBottom > iScrollTop && iBottom < iClientHeight)) {
						aNotLoaded[i].src = fgm.attr(aNotLoaded[i], "data-img") || aNotLoaded[i].src;
						aNotLoaded[i].className += " loaded";
								
						$(aNotLoaded[i]).show();
					}
				}
			}
		},
		loaded: function(status) {
			var array = [];
			var i = 0;
			for(i = 0; i < this.aImg.length; i++)
			eval("fgm.hasClass(this.aImg[i], \"loaded\")" + (!!status ? "&&" : "||") + "array.push(this.aImg[i])");
			return array
		},
		preImg:function(src){
			var $img = $('<img/>');

			$img.attr('src',src);
		}
	};

	
	
	 $(document).ready(function($){
		window.lazyLoad = function(wrapId){
			return new LazyLoad(wrapId);
		};
	});
})($);
