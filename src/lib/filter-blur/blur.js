// ios 使用 css 的 filter 滤镜
// android及其他 使用 canvas 生成 滤镜效果，并不是严格意义上的高斯模糊

// 暂时不提供设置模糊半径接口

window.Blur || (function() {
	function apply(ele, src){
		var $ele = $(ele);
		var imageUrl, image;
		var canvas, ctx, buffer, base64;
		if($.os.ios){
			$ele.css({
				"-webkit-filter": "blur(20px)", 
		        "-moz-filter": "blur(20px)",
		        "-ms-filter": "blur(20px)",   
		        "filter": "blur(20px)"
			});
		}else{
			if( src ){
				imageUrl = src;
			}else{
				if ($ele.is("img")) {
	                imageUrl = $ele.attr("src");
	            } else {
	            	var string = $ele.css("background-image");
	            	var st = string.indexOf("(");
	            	var ed = string.indexOf(")");
	                imageUrl = string.substring(st+1, ed);
	            }
			}


			canvas = document.createElement("canvas");
			ctx = canvas.getContext("2d");

			image = new Image();
			if( imageUrl.indexOf("data:image") !== 0){
				// imageUrl不是base64时设置此值
				// 1. 若是base64，设置此值后微信不触发onload事件 
				// 2. 在安卓默认浏览器不支持
				// 	  安卓微信支持，安卓in有的支持有的不支持
				image.crossOrigin = '';
			}
			image.onload = function(){
				canvas.width = 50;
				canvas.height = canvas.width * this.naturalHeight/this.naturalWidth;

				var time = Date.now();
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				buffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
				buffer = convolve(ctx, buffer, getGaussianMode(6,3));
				ctx.putImageData( buffer, 0, 0);
				base64 = canvas.toDataURL();

				// alert( "生成模糊图片耗时：" + (Date.now() - time) );

				if ($ele.is("img")) {
	                $ele.attr("src", base64);
	            } else {
	                $ele.css("background-image", "url('" + base64 + "')");
	            }
			}
			image.src = imageUrl;
		}
	}

	function clamp(val, min, max){
        min = min || 0;
        max = max || 255;
        return Math.min(max, Math.max(min, val));
    }

	function convolve(ctx, buffer, kernel){    
        if (!ctx.createImageData) {
            throw "createImageData is not supported."
        }
        var w = buffer.width;
        var h = buffer.height;
        var temp  = ctx.createImageData(w, h),
            tempd = temp.data,
            bufferData = buffer.data,
            kh = parseInt(kernel.length / 2),
            kw = parseInt(kernel[0].length / 2),
            i = 0, j = 0, n = 0, m = 0;
        
        for (i = 0; i < h; i++) {
            for (j = 0; j < w; j++) {
                var outIndex = (i*w*4) + (j*4);
                var r = 0, g = 0, b = 0;
                for (n = -kh; n <= kh; n++) {
                    for (m = -kw; m <= kw; m++) {
                        // if (i + n >= 0 && i + n < h) {
                        //     if (j + m >= 0 && j + m < w) {
                                var f = kernel[n + kh][m + kw];
                                if (f === 0) {continue;}
                                var posX = j+m;
                                var posY = i+n;
                                // 去掉模糊黑边
                                if(i + n < 0){
                                	posY = 0;
                                }else if(i + n >= h){
                                	posY = h - 1;
                                }
                                if(j + m < 0){
                                	posX = 0;
                                }else if(j + m >= w){
                                	posX = w - 1;
                                }
                                // ---end---
                                var inIndex = (posY*w*4) + (posX*4);
                                r += bufferData[inIndex] * f;
                                g += bufferData[inIndex + 1] * f;
                                b += bufferData[inIndex + 2] * f;
                        //     }
                        // }
                    }
                }
                tempd[outIndex]     = clamp(r);
                tempd[outIndex + 1] = clamp(g);
                tempd[outIndex + 2] = clamp(b);
                tempd[outIndex + 3] = 255;
            }
        }

        return temp;
    };

	function getGaussianMode(N, r){   
        var arr = [],
            i = 0, 
            j = 0,
            sum = 0;
        for(i=0;i<2*N+1;i++){
            arr[i] = [];
        }

        var A = 1/(2 * Math.PI * r * r);
        for(i=-1*N;i<=N;i++)
        {
            for(j=-1*N;j<=N;j++)
            {
                arr[i+N][j+N]=A*Math.exp((-1) * (i*i+j*j) / (2*r*r));
                sum += arr[i+N][j+N];
            }
        }

        var ratio = 1 / sum;
        for(i=-1*N;i<=N;i++)
        {
            for(j=-1*N;j<=N;j++)
            {
                arr[i+N][j+N] *= ratio;
            }
        }

        // console.log(arr);
        return arr;
    }

    window.Blur = {
    	apply: apply
    }
})();