define(function() { return function($) {
  "use strict"

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
 

}});
