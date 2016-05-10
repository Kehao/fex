define([], function(require, exports, module) {

function Slide(e, config) {
    this.$root = $(e);
    config && (this.config = config);
    
    
    this.init();

    this.initEffect();
    this.initOrder();
    this.initStep();
    this.initLoop();
    //this.initTouch();

    this.initFinish();
}

Slide.prototype = {
    constructor : Slide
,   config      : {}
,   $root       : null
,   $container  : null
,   $current    : null
,   index         : 0

,   init        : function() {
        this.$container = this.$root.find('.x-slide-ctn');
        this.$current = this.$container.children(':first');

        var that = this;
        this.$container.hover(function () {
            that.$root.trigger('slide.pause');
        }, function () {
            that.$root.trigger('slide.goon');
        });
    }
,   initFinish  : function() {
        this.$root.trigger('slide.start');
        this.$root.trigger('slide.end');
    }


//====== core ======
,   prev        : function() {
        var index = this.index;
        if(this.$current.prev().length === 0)
            index = this.$root.children().length;

        this.go(index - 1);
    }
,   next        : function() {
        var index = this.index;
        if(this.$current.next().length === 0)
            index = -1;

        this.go(index + 1);
    }
,   go          : function(index) {
        this.index = index;
        this.$current = this.$container.children().eq(index);
        this.$root.trigger('slide.start');
    }


//====== main ======
,   initEffect  : function(index) {
        //var prop = config.prop;
        //TODO replacable effect
        var $container = this.$container;
        var $root = this.$root;
        var that = this;
        
        var size, prop;
        if(this.config.type === 'vertical') {
            prop = 'marginTop';
            size = $root.height();
        } else {
            prop = 'marginLeft';
            size = $root.width();
        }
        
        this.$root.on('slide.start', function() {
            var style = {};
            style[prop] = -that.index * size;
            $container.stop().animate(style, function() {
                //slide.end
                that.$root.trigger('slide.end');
            });
        });
        
    }

//====== extra =======
,   initOrder   : function() {
        var $orders = this.$root.find('.x-slide-to');
        if($orders.length === 0) return;
        
        var that = this;
        
        var $active;
        this.$root.on('slide.start', function() {
            $active && $active.removeClass('active');
            $active = $orders.eq(that.index).addClass('active');
        });
        
        $orders.click(function() {
            that.go(this.getAttribute('data-slide-to') - 1);
        });
        
        
        //hover trigger
        if(!this.config.hover) return;
        var t, e, trigger = function() {$(e).click();};
        $orders.hover(function() {
            e = this;
            t = setTimeout(trigger, 300);
        }, function() {
            clearTimeout(t);
        });
    }
    
,   initStep    : function() {
        var $prev = this.$root.find('.x-slide-prev'),
            $next = this.$root.find('.x-slide-next');
        
        var that = this;
        $prev.click(function() {
            $prev.hasClass('active') && that.prev();
        });
        
        $next.click(function() {
            $next.hasClass('active') && that.next();
        });
        
        this.$root.on('slide.start', function() {
            if(that.$current.next().length === 0) {
                $next.removeClass('active');
            } else {
                $next.addClass('active');
            }

            if(that.$current.prev().length === 0) {
                $prev.removeClass('active');
            } else {
                $prev.addClass('active');
            }
        });
    }

,   initLoop    : function() {
        var time = this.config.loop * 1000;
        if(!time) return;
        
        var that = this;
        
        var t;
        function loop() {
            that.next();
        }
        
        this.$root.on('slide.start slide.pause', function() {
            clearTimeout(t);
        });
        this.$root.on('slide.end slide.goon', function() {
            t = setTimeout(loop, time);
        });
    }
};


/*

//slider
(function() {
	var slider = document.querySelector('#banner .slider-content'),
		style  = slider.style,
		orders = document.querySelectorAll('#banner .order li'),
		count  = orders.length,
		width = slider.clientWidth,
		pos = 0,
		current = orders[pos],
        re = /-?\d+/;

	function go(n) {
		pos = (n+count)%count;

		style.webkitTransform = 'translate3d(' +(-pos)*width + 'px, 0, 0)';

		current.classList.remove('current');
		current = orders[pos];
		current.classList.add('current');
	}

	function loop() {
		loop.t = setTimeout(function() {
			clearTimeout(loop.t);
			go(pos+1);
			loop();
		}, 6000);
	};

    
    ;(function() {
        style.webkitTransform = 'translate3d(0, 0, 0)';
        
        slider.addEventListener('touchstart', start);
        slider.addEventListener('touchmove', move);
        document.addEventListener('touchend', end);
        
        var left=0, sx, sy, x, y, state; //state 0=init, 1=moving, 2=canceled
        function start(evt) {
            sx = evt.touches[0].pageX;
            sy = evt.touches[0].pageY;
            
            state = 0;
        }
        
        function move(evt) {
            x = evt.touches[0].pageX;
            y = evt.touches[0].pageY;
            
            
            if(state === 1) {
                var offset = x - sx;
                
                //if((offset < 0 && !hasNext) || (offset > 0 && !hasPrev)) {
                //    offset = offset/3;
                //}
                
                offset = offset + left;
                
                style.webkitTransform = 'translate3d(' +offset +'px, 0, 0)';
            } else if(state === 0) {
                if(Math.abs(sx -x) > 20) { //×óÓÒ»¬¶¯ start moving
                    evt.preventDefault();
                    clearTimeout(loop.t);
                    style.webkitTransitionDuration = 0;
                    left = -pos*width;
                    
                    state = 1;
                } else if(Math.abs(sy -y) > 20) { //´¹Ö±»¬¶¯ canceled
                    state = 2;
                }
            } 
        }
        
        function end(evt) {
            if(state === 1) {
                style.webkitTransitionDuration = '';
                if(x - sx < -50) {
                    pos++;
                } else if(x- sx > 50) {
                    pos--;
                }
                
                go(pos);
                
                state = 2;
                loop(); //go on loop
            }
        }
    })();

	loop(); //start loop
})();
*/

module.exports = Slide;
});
