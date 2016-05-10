/* seajs jquery 常用插件合并
 * alert, modal, lazyload
 */

define(function() { return function($) {

 (function($) {
 /* ALERT CLASS DEFINITION
  * ====================== */
  
    var UIAlert = function ( content, options ) {
        this.options = options
        this.$element = $(content)
            .delegate('[data-dismiss="alert"]', 'click.dismiss.alert', $.proxy(this.hide, this))
        
        var tpl = '<div class="ui-alert ui-alert-error">';
        if (options.closeBtn) tpl += '<a class="close" data-dismiss="alert">×</a>';
        if (options.icon) {
            tpl += '<i class="icon icon-'+ options.icon +'"></i>';
        }
        tpl += '<span class="msg fn-brk">'+options.msg+'</span></div>';
    
        this.$alertView = $(tpl);
        var offset = this.$element.offset();
        offset.left += options.offsetx, offset.top += options.offsety + this.$element.height();
        this.$alertView.css(offset).appendTo('body')
            .delegate('[data-dismiss="alert"]', 'click.dismiss.alert', $.proxy(this.hide, this));
    }

    UIAlert.prototype = {
        constructor: UIAlert
        
        , toggle: function () {
            return this[!this.isShown ? 'show' : 'hide']()
        }
        
        , show: function () {
            if (this.isShown) return
            
            this.isShown = true
            this.$alertView.fadeIn($.proxy(function() {
                var autoClose = this.options.autoClose;
                if(autoClose) setTimeout($.proxy(function(){
                    this.hide();
                },this),autoClose);
            }, this));
        }

        , hide: function ( e ) {
            e && e.preventDefault()
        
            if (!this.isShown) return
        
            this.isShown = false
            
            this.$alertView.fadeOut($.proxy(function() {
                this.$alertView.remove();
                this.$element.removeData('alert');
            }, this));
        }
    }

 /* ALERT PRIVATE METHODS
  * ===================== */


 /* ALERT PLUGIN DEFINITION
  * ======================= */
    
    $.fn.alert = function ( option ) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('alert')
              , options = $.extend({}, $.fn.alert.defaults, $this.data(), typeof option == 'object' && option)
            
            if (!data) $this.data('alert', (data = new UIAlert(this, options)))
            if (typeof option == 'string') data[option]()
            else if (options.show) data.show()
        })
    }
    
    $.fn.alert.defaults = {
          offsetx: 0
        , offsety: 0
        , msg: ''
        , icon: ''
        , closeBtn: true
        , autoClose: 0
        , show: true
    }
    
    $.fn.alert.Constructor = UIAlert

 /* TIPS CLASS DEFINITION
  * ====================== */
  
    var UITips = function ( content, options ) {
        this.options = options
        this.$element = $(content)
            .delegate('[data-dismiss="alert"]', 'click.dismiss.alert', $.proxy(this.hide, this))
        
        var tpl;
        if (options.position) {
            tpl = '<div class="ui-alert ui-alert-tips ui-alert-tips-psfix">';
        } else {
            tpl = '<div class="ui-alert ui-alert-tips">';
        }
        if (options.closeBtn) tpl += '<a class="close" data-dismiss="alert">×</a>';
        if (options.icon) {
            tpl += '<i class="icon icon-'+ options.icon +'"></i>';
        }
        if (options.direction) {
            tpl += '<i class="arrow-border arrow-border-' + options.direction + '"></i><i class="arrow arrow-' + options.direction + '"></i>';
        }
        tpl += '<span class="msg fn-brk">'+options.msg+'</span></div>';
    
        this.$alertView = $(tpl);
        var offset = this.$element.offset();
		var _top = offset.top;
		if ( options.position && !$.browser.webkit ){
			var _scroll = $(window).scrollTop()
			if ( _scroll > 0 ){
				_top = _top - _scroll;
			}
		}
		offset.top = _top;
        offset.left += options.offsetx, offset.top += options.offsety + 8 + this.$element.height();
        this.$alertView.css(offset).appendTo('body')
            .delegate('[data-dismiss="alert"]', 'click.dismiss.alert', $.proxy(this.hide, this));
    }

    UITips.prototype = {
        constructor: UITips
        
        , toggle: function () {
            return this[!this.isShown ? 'show' : 'hide']()
        }
        
        , show: function () {
            if (this.isShown) return
            
            this.isShown = true
            this.$alertView.fadeIn($.proxy(function() {
                var autoClose = this.options.autoClose;
                if(autoClose) setTimeout($.proxy(function(){
                    this.hide();
                },this),autoClose);
            }, this));
        }

        , hide: function ( e ) {
            e && e.preventDefault()
        
            if (!this.isShown) return
        
            this.isShown = false
            
            this.$alertView.fadeOut($.proxy(function() {
                this.$alertView.remove();
                this.$element.removeData('alert');
            }, this));
        }
    }

 /* TIPS PRIVATE METHODS
  * ===================== */


 /* TIPS PLUGIN DEFINITION
  * ======================= */
    
    $.fn.tinitips = function ( option ) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('alert')
              , options = $.extend({}, $.fn.tinitips.defaults, $this.data(), typeof option == 'object' && option)
            
            if (!data) $this.data('alert', (data = new UITips(this, options)))
            if (typeof option == 'string') data[option]()
            else if (options.show) data.show()
        })
    }
    
    $.fn.tinitips.defaults = {
          offsetx: 0
        , offsety: 0
        , msg: ''
        , icon: ''
        , closeBtn: true
        , autoClose: 0
        , show: true
        , direction: 'top'
    }
    
    $.fn.tinitips.Constructor = UITips

    
 /* TinyModal CLASS DEFINITION
   * ====================== */
    var tinyModalTpl = '' +
    '<div id="tinymodal-common" class="ui-tinymodal"><div class="ui-tinymodal-inner">' +
    '<div class="ui-tinymodal-body"></div>' +
    '    <div class="ops">' +
    '        <a href="javascript:;" class="ui-button mr15 h-tinymodal-confirm"><span class="ui-button-text">确定</span></a>' +
    '        <a href="javascript:;" class="ui-button ui-button-grey h-tinymodal-cancel"><span class="ui-button-text">取消</span></a>' +
    '    </div>' +
    '</div></div>';
    
     var UITinyModal = function ( content, options ) {
         this.$alertView = $(tinyModalTpl).appendTo('body');
         this.$body = this.$alertView.find('.ui-tinymodal-body');
         this.reset(content, options);
         
         this.$alertView.find('.h-tinymodal-confirm').click($.proxy(function() {
             this.hide();
             this.$element.trigger('tinymodal',true);
             
         },this));
         this.$alertView.find('.h-tinymodal-cancel').click($.proxy(function() {
             this.hide();
             this.$element.trigger('tinymodal',false);
         },this));
     }
 
     UITinyModal.prototype = {
         constructor: UITinyModal
         
         , reset: function(content, options) {
             this.hide(false);
             
             this.options = options;
             this.$element = $(content);
             
             var body = '';
             if (options.icon) {
                 body += '<i class="icon icon-'+ options.icon +'"></i>';
             }
             body += '<span class="msg">'+options.msg+'</span>';
             this.$body.html(body);
         }
         , toggle: function () {
             return this[!this.isShown ? 'show' : 'hide']()
         }
         
         , show: function () {
             if (this.isShown) return
             
             this.isShown = true
             
             var offset = this.$element.offset();
             offset.left += this.options.offsetx;
             offset.top += this.options.offsety;
             this.$alertView.css(offset);
             
             var height = this.$alertView.height();
             this.$alertView.css({'display':'block','height':0});
             this.$alertView.animate({height:height,top:offset.top-height},300,'easeInOutQuint');
         }
 
         , hide: function (animate) {         
             if (!this.isShown) return
         
             this.isShown = false
             
             if(animate||arguments.length==0) {
                 var offset = this.$alertView.offset();
                 var height = this.$alertView.height();
                 this.$alertView.animate({height:0,top:offset.top+height},300,'easeInOutQuint',$.proxy(function(){
                     this.$alertView.hide();
                     this.$alertView.height(height);
                 },this));
             } else {
                 var height = this.$alertView.height();
                 this.$alertView.hide();
                 this.$alertView.height(height);
                 this.$element.trigger('tinymodal',false);
             }
             
         }
         
     }
 
  /* TinyModal PRIVATE METHODS
   * ===================== */
 
 
  /* TinyModal PLUGIN DEFINITION
   * ======================= */
     
     $.fn.tinyModal = function ( option ) {
         return this.each(function () {
             var $this = $(this)
               , $global = $('body')
               , data = $global.data('tinyModal')
               , options = $.extend({}, $.fn.tinyModal.defaults, typeof option == 'object' && option);
             
             if (!data) {
                 $global.data('tinyModal', (data = new UITinyModal(this, options)));
             } else {
                 data.reset(this, options);
             }
             
             if (typeof option == 'string') data[option]()
             else if (options.show) data.show()
         })
     }
     
     $.fn.tinyModal.defaults = {
           offsetx: 0
         , offsety: 0
         , msg: ''
         , icon: ''
         , show: true
     }
     
     $.fn.tinyModal.Constructor = UITinyModal
 

 })($);

!function ($) {

 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.ui-modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('ui-modal-fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('ui-modal-in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('ui-modal-in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('ui-modal-fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function (that) {
        this.$element
          .hide()
          .trigger('hidden')

        this.backdrop()
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('ui-modal-backdrop-fade') ? 'ui-modal-backdrop-fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="ui-modal-backdrop ui-modal-backdrop-fade' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('ui-modal-backdrop-in')

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('ui-modal-backdrop-in')

          $.support.transition && this.$element.hasClass('ui-modal-backdrop-fade')?
            this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
            this.removeBackdrop()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}($);

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;
      
            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                $self.attr("src", settings.placeholder);
            }
            
            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {
                            var original = $self.data(settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);
                            
                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.data(settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });
              
        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });
        
        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})($, window, document);
(function(d){function m(){var b=d("script:first"),a=b.css("color"),c=false;if(/^rgba/.test(a))c=true;else try{c=a!=b.css("color","rgba(0, 0, 0, 0.5)").css("color");b.css("color",a)}catch(e){}return c}function j(b,a,c){var e="rgb"+(d.support.rgba?"a":"")+"("+parseInt(b[0]+c*(a[0]-b[0]),10)+","+parseInt(b[1]+c*(a[1]-b[1]),10)+","+parseInt(b[2]+c*(a[2]-b[2]),10);if(d.support.rgba)e+=","+(b&&a?parseFloat(b[3]+c*(a[3]-b[3])):1);e+=")";return e}function g(b){var a,c;if(a=/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(b))c=
[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16),1];else if(a=/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(b))c=[parseInt(a[1],16)*17,parseInt(a[2],16)*17,parseInt(a[3],16)*17,1];else if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))c=[parseInt(a[1]),parseInt(a[2]),parseInt(a[3]),1];else if(a=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(b))c=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),parseFloat(a[4])];return c}
d.extend(true,d,{support:{rgba:m()}});var k=["color","backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","outlineColor"];d.each(k,function(b,a){d.Tween.propHooks[a]={get:function(c){return d(c.elem).css(a)},set:function(c){var e=c.elem.style,i=g(d(c.elem).css(a)),h=g(c.end);c.run=function(f){e[a]=j(i,h,f)}}}});d.Tween.propHooks.borderColor={set:function(b){var a=b.elem.style,c=[],e=k.slice(2,6);d.each(e,function(h,f){c[f]=g(d(b.elem).css(f))});var i=g(b.end);
b.run=function(h){d.each(e,function(f,l){a[l]=j(c[l],i,h)})}}}})($);}
});

