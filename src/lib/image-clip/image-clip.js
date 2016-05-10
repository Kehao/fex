/* binaryajax.min.js */
var BinaryFile=function(t,e,n){var r=t,i=e||0,s=0;this.getRawData=function(){return r},"string"==typeof t?(s=n||r.length,this.getByteAt=function(t){return 255&r.charCodeAt(t+i)},this.getBytesAt=function(t,e){for(var n=[],s=0;e>s;s++)n[s]=255&r.charCodeAt(t+s+i);return n}):"unknown"==typeof t&&(s=n||IEBinary_getLength(r),this.getByteAt=function(t){return IEBinary_getByteAt(r,t+i)},this.getBytesAt=function(t,e){return new VBArray(IEBinary_getBytesAt(r,t+i,e)).toArray()}),this.getLength=function(){return s},this.getSByteAt=function(t){var e=this.getByteAt(t);return e>127?e-256:e},this.getShortAt=function(t,e){var n=e?(this.getByteAt(t)<<8)+this.getByteAt(t+1):(this.getByteAt(t+1)<<8)+this.getByteAt(t);return 0>n&&(n+=65536),n},this.getSShortAt=function(t,e){var n=this.getShortAt(t,e);return n>32767?n-65536:n},this.getLongAt=function(t,e){var n=this.getByteAt(t),r=this.getByteAt(t+1),i=this.getByteAt(t+2),s=this.getByteAt(t+3),o=e?(((n<<8)+r<<8)+i<<8)+s:(((s<<8)+i<<8)+r<<8)+n;return 0>o&&(o+=4294967296),o},this.getSLongAt=function(t,e){var n=this.getLongAt(t,e);return n>2147483647?n-4294967296:n},this.getStringAt=function(t,e){for(var n=[],r=this.getBytesAt(t,e),i=0;e>i;i++)n[i]=String.fromCharCode(r[i]);return n.join("")},this.getCharAt=function(t){return String.fromCharCode(this.getByteAt(t))},this.toBase64=function(){return window.btoa(r)},this.fromBase64=function(t){r=window.atob(t)}},BinaryAjax=function(){function t(){var t=null;return window.ActiveXObject?t=new ActiveXObject("Microsoft.XMLHTTP"):window.XMLHttpRequest&&(t=new XMLHttpRequest),t}function e(e,n,r){var i=t();i?(n&&("undefined"!=typeof i.onload?i.onload=function(){"200"==i.status?n(this):r&&r(),i=null}:i.onreadystatechange=function(){4==i.readyState&&("200"==i.status?n(this):r&&r(),i=null)}),i.open("HEAD",e,!0),i.send(null)):r&&r()}function n(e,n,r,i,s,o){var a=t();if(a){var u=0;i&&!s&&(u=i[0]);var g=0;i&&(g=i[1]-i[0]+1),n&&("undefined"!=typeof a.onload?a.onload=function(){"200"==a.status||"206"==a.status||"0"==a.status?(a.binaryResponse=new BinaryFile(a.responseText,u,g),a.fileSize=o||a.getResponseHeader("Content-Length"),n(a)):r&&r(),a=null}:a.onreadystatechange=function(){if(4==a.readyState){if("200"==a.status||"206"==a.status||"0"==a.status){var t={status:a.status,binaryResponse:new BinaryFile("unknown"==typeof a.responseBody?a.responseBody:a.responseText,u,g),fileSize:o||a.getResponseHeader("Content-Length")};n(t)}else r&&r();a=null}}),a.open("GET",e,!0),a.overrideMimeType&&a.overrideMimeType("text/plain; charset=x-user-defined"),i&&s&&a.setRequestHeader("Range","bytes="+i[0]+"-"+i[1]),a.setRequestHeader("If-Modified-Since","Sat, 1 Jan 1970 00:00:00 GMT"),a.send(null)}else r&&r()}return function(t,r,i,s){s?e(t,function(e){var o,a,u=parseInt(e.getResponseHeader("Content-Length"),10),g=e.getResponseHeader("Accept-Ranges");o=s[0],s[0]<0&&(o+=u),a=o+s[1]-1,n(t,r,i,[o,a],"bytes"==g,u)}):n(t,r,i)}}();
/* exif.min.js exif信息读取，依赖binaryajax.min.js */
var EXIF={};!function(){function e(e,t,r){e.addEventListener?e.addEventListener(t,r,!1):e.attachEvent&&e.attachEvent("on"+t,r)}function t(e){return!!e.exifdata}function r(e,t){BinaryAjax(e.src,function(r){var o=n(r.binaryResponse);e.exifdata=o||{},t&&t()})}function n(e){if(255!=e.getByteAt(0)||216!=e.getByteAt(1))return!1;for(var t=2,r=e.getLength();r>t;){if(255!=e.getByteAt(t))return c&&console.log("Not a valid marker at offset "+t+", found: "+e.getByteAt(t)),!1;var n=e.getByteAt(t+1);if(22400==n)return c&&console.log("Found 0xFFE1 marker"),i(e,t+4,e.getShortAt(t+2,!0)-2);if(225==n)return c&&console.log("Found 0xFFE1 marker"),i(e,t+4,e.getShortAt(t+2,!0)-2);t+=2+e.getShortAt(t+2,!0)}}function o(e,t,r,n,o){for(var i=e.getShortAt(r,o),s={},u=0;i>u;u++){var g=r+12*u+2,l=n[e.getShortAt(g,o)];!l&&c&&console.log("Unknown tag: "+e.getShortAt(g,o)),s[l]=a(e,g,t,r,o)}return s}function a(e,t,r,n,o){var a=e.getShortAt(t+2,o),i=e.getLongAt(t+4,o),s=e.getLongAt(t+8,o)+r;switch(a){case 1:case 7:if(1==i)return e.getByteAt(t+8,o);for(var u=i>4?s:t+8,g=[],l=0;i>l;l++)g[l]=e.getByteAt(u+l);return g;case 2:var d=i>4?s:t+8;return e.getStringAt(d,i-1);case 3:if(1==i)return e.getShortAt(t+8,o);for(var u=i>2?s:t+8,g=[],l=0;i>l;l++)g[l]=e.getShortAt(u+2*l,o);return g;case 4:if(1==i)return e.getLongAt(t+8,o);for(var g=[],l=0;i>l;l++)g[l]=e.getLongAt(s+4*l,o);return g;case 5:if(1==i)return e.getLongAt(s,o)/e.getLongAt(s+4,o);for(var g=[],l=0;i>l;l++)g[l]=e.getLongAt(s+8*l,o)/e.getLongAt(s+4+8*l,o);return g;case 9:if(1==i)return e.getSLongAt(t+8,o);for(var g=[],l=0;i>l;l++)g[l]=e.getSLongAt(s+4*l,o);return g;case 10:if(1==i)return e.getSLongAt(s,o)/e.getSLongAt(s+4,o);for(var g=[],l=0;i>l;l++)g[l]=e.getSLongAt(s+8*l,o)/e.getSLongAt(s+4+8*l,o);return g}}function i(e,t){if("Exif"!=e.getStringAt(t,4))return c&&console.log("Not valid EXIF data! "+e.getStringAt(t,4)),!1;var r,n=t+6;if(18761==e.getShortAt(n))r=!1;else{if(19789!=e.getShortAt(n))return c&&console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),!1;r=!0}if(42!=e.getShortAt(n+2,r))return c&&console.log("Not valid TIFF data! (no 0x002A)"),!1;if(8!=e.getLongAt(n+4,r))return c&&console.log("Not valid TIFF data! (First offset not 8)",e.getShortAt(n+4,r)),!1;var a=o(e,n,n+8,EXIF.TiffTags,r);if(a.ExifIFDPointer){var i=o(e,n,n+a.ExifIFDPointer,EXIF.Tags,r);for(var s in i){switch(s){case"LightSource":case"Flash":case"MeteringMode":case"ExposureProgram":case"SensingMethod":case"SceneCaptureType":case"SceneType":case"CustomRendered":case"WhiteBalance":case"GainControl":case"Contrast":case"Saturation":case"Sharpness":case"SubjectDistanceRange":case"FileSource":i[s]=EXIF.StringValues[s][i[s]];break;case"ExifVersion":case"FlashpixVersion":i[s]=String.fromCharCode(i[s][0],i[s][1],i[s][2],i[s][3]);break;case"ComponentsConfiguration":i[s]=EXIF.StringValues.Components[i[s][0]]+EXIF.StringValues.Components[i[s][1]]+EXIF.StringValues.Components[i[s][2]]+EXIF.StringValues.Components[i[s][3]]}a[s]=i[s]}}if(a.GPSInfoIFDPointer){var u=o(e,n,n+a.GPSInfoIFDPointer,EXIF.GPSTags,r);for(var s in u){switch(s){case"GPSVersionID":u[s]=u[s][0]+"."+u[s][1]+"."+u[s][2]+"."+u[s][3]}a[s]=u[s]}}return a}function s(e){return 255==e.getByteAt(0)&&216==e.getByteAt(1)}function u(e){return 137==e.getByteAt(0)&&80==e.getByteAt(1)}function g(e){return 71==e.getByteAt(0)&&73==e.getByteAt(1)}function l(e){return 66==e.getByteAt(0)&&77==e.getByteAt(1)}function d(){for(var t=document.getElementsByTagName("img"),r=0;r<t.length;r++)"true"==t[r].getAttribute("exif")&&(t[r].complete?EXIF.getData(t[r]):e(t[r],"load",function(){EXIF.getData(this)}))}var c=!1;EXIF.Tags={36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubsecTime",37521:"SubsecTimeOriginal",37522:"SubsecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"ISOSpeedRatings",34856:"OECF",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRation",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",40965:"InteroperabilityIFDPointer",42016:"ImageUniqueID"},EXIF.TiffTags={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",272:"Model",305:"Software",315:"Artist",33432:"Copyright"},EXIF.GPSTags={0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential"},EXIF.StringValues={ExposureProgram:{0:"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},SensingMethod:{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{0:"Normal process",1:"Custom process"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},GainControl:{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{0:"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},Components:{0:"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}},EXIF.getData=function(e,n){return e.complete?(t(e)?n&&n():r(e,n),!0):!1},EXIF.getTag=function(e,r){return t(e)?e.exifdata[r]:void 0},EXIF.getAllTags=function(e){if(!t(e))return{};var r=e.exifdata,n={};for(var o in r)r.hasOwnProperty(o)&&(n[o]=r[o]);return n},EXIF.pretty=function(e){if(!t(e))return"";var r=e.exifdata,n="";for(var o in r)r.hasOwnProperty(o)&&(n+="object"==typeof r[o]?o+" : ["+r[o].length+" values]\r\n":o+" : "+r[o]+"\r\n");return n},EXIF.readFromBinaryFile=function(e){return n(e)},EXIF.isImage=function(e){return s(e)||u(e)||g(e)||l(e)},EXIF.getImageType=function(e){var t="";return s(e)?t="jpeg":u(e)?t="png":g(e)?t="gif":l(e)&&(t="bmp"),t},e(window,"load",d)}();
/* image-clip h5 */
/* h5图片裁剪类库，依赖jquery或zepto
    参数：
        $container为放图片的容器
        config配置项：
            btnRotate, 旋转按钮,$对象
            btnUpload, 上传按钮,$对象
            sourceUrl, 初始图片地址，只有是base64数据时才可以获取裁剪后的图片，否则只可以做展示用
            initPosY, 图片初始Y坐标对齐方式，有top，middle，bottom三个值，默认为middle
            maxWidth, 生成图片的最大宽度
            quality, 生成图片的质量
            onImageLoaded, 图片加载完成时的自定义回调函数
    注意：
    1. 图片初始大小相当于容器背景cover样式，最小可缩放至contain样式，最大可缩放至初始大小的2倍
    2. btnUpload上传按钮必须是type为file的input标签
    3. 初始化时需要$container有固定的宽高
    4. android机不支持input file的浏览器无法使用上传本地照片功能
*/
function ImageClip($container, config){
    "use strict";

    function isImage(suffix){
        var val = suffix.toLowerCase();
        var legalType = ["jpg","jpeg","png","gif","bmp"];

        for(var i=0; i<legalType.length; i++){
            if(val === legalType[i]) return true;
        }

        return false;
    }
    function readFile() {
        $(this).off("change", readFile);

        var file = this.files[0],
            fileName, fileType, suffix;
        var parts;

        if(!file) return false;

        // dump_obj(file);
        // function dump_obj(myObject) {  
        //     var s = "";  
        //     for (var property in myObject) {  
        //         s = s + "\n "+property +": " + myObject[property] ;  
        //     }  
        //     alert(s);  
        // }

        // fileType = file.type;
        // fileName = file.name || file.fileName;
        // if (fileType === "") {   
        //     parts = fileName.split(".");
        //     if(parts){
        //         suffix = parts[parts.length-1];
        //         if(isImage(suffix)){
        //             fileType = "image/" + suffix;
        //         }
        //     }
        // }
        
        // if (!/image\/\w+/.test(fileType)) {
        //     alert("文件必须为图片！");
        //     return false;
        // }
        
        // ----方法一-----
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            var base64 = this.result.replace(/^.*?,/, '');
            var binary = atob(base64);
            var binaryData = new BinaryFile(binary);
            exif = EXIF.readFromBinaryFile(binaryData);

            if( !EXIF.isImage(binaryData) ){
                alert("文件必须为图片！");
                return false;
            }else{
                fileType = "image/" + EXIF.getImageType(binaryData);
            }

            imageFile = new Image();
            imageFile.onload = beginEdit;
            var contents = this.result.split(",");
            var head = contents[0];
            if(head.indexOf("image") === -1){
                imageFile.src = "data:" + fileType + ";base64," + base64;
                $sourceImg.attr("src","data:" + fileType + ";base64," + base64);
            }else{
                imageFile.src = this.result;
                $sourceImg.attr("src", this.result);
            } 
        }
    }

    function beginEdit() {
        updateContainerSize();

        if( editable ){
            // 防止重复绑定
            $controller.off("touchstart", onTouchstart);
            $controller.off("touchmove", onTouchmove);
            $controller.off("touchend", onTouchend);
            $controller.on("touchstart", onTouchstart);
            $controller.on("touchmove", onTouchmove);
            $controller.on("touchend", onTouchend);
        }
        

        sourceWidth = imageFile.naturalWidth;
        sourceHeight = imageFile.naturalHeight;

        var displayWid = $sourceImg.width();
        var displayHei = $sourceImg.height();

        var orientation;
        if (exif) {
            orientation = exif.Orientation ? exif.Orientation : 1;
        } else {
            orientation = 1;
        }

        // 判断拍照设备持有方向调整照片角度
        switch (orientation) {
            case 1:
                targetRotation=0;
                imgRotation = 0;
                imageRatio = sourceHeight / sourceWidth;
                break;
            case 3:
                targetRotation = 180;
                imgRotation = Math.PI;
                imageRatio = sourceHeight / sourceWidth;
                break;
            case 6:
                targetRotation = 90;
                imgRotation = Math.PI * 0.5;
                imageRatio = sourceWidth / sourceHeight;
                break;
            case 8:
                targetRotation=270;
                imgRotation = Math.PI * 1.5;
                imageRatio = sourceWidth / sourceHeight;
                break;
        }

        var chaju = displayHei/displayWid - sourceHeight/sourceWidth;
        var ua = navigator.userAgent.toLowerCase(),
            isAndroid = /android|adr/gi.test(ua),
            isIos = /iphone|ipod|ipad/gi.test(ua) && !isAndroid;
        if(targetRotation%180 != 0 && chaju<0.1 && !isIos){
            // 三星90度图
            needImgRotationFixed = false;
        }else{
            // android其他和iphone
            needImgRotationFixed = true;
            targetRotation=0;
        }
        
        fixedDrawSize();

        config.onImageLoaded && config.onImageLoaded();
    }

    function onTouchstart(event) {
        event.preventDefault();
        if (!imageFile) return;

        var touches = event.touches || event.originalEvent.touches;
        if (!touches.length) return;
        if (touches.length === 1) {
            isMoveMode = true;
            var touch = touches[0];
            startX = touch.pageX;
            startY = touch.pageY;
        } else {
            isMoveMode = false;
            var touch0 = touches[0];
            var touch1 = touches[1];
            var disx = (touch1.pageX - touch0.pageX) * (touch1.pageX - touch0.pageX);
            var disy = (touch1.pageY - touch0.pageY) * (touch1.pageY - touch0.pageY);
            satrtDis = Math.sqrt(disx + disy);
            startX = targetX;
            startY = targetY;
            startAngle = Math.atan2(touch1.pageY - touch0.pageY, touch1.pageX - touch0.pageX);
        }
    }

    function onTouchmove(event) {
        event.preventDefault();
        if (!imageFile) return;
        var touches = event.touches || event.originalEvent.touches;
        if (!touches.length) return;    
        if (isMoveMode) {
            var touch = touches[0];
            nowX = Math.floor(touch.pageX);
            nowY = Math.floor(touch.pageY);
            targetX += nowX - startX;
            targetY += nowY - startY;

            $sourceImg.css({
                "width":drawWid,
                "height":drawHei,
                "left":targetX,
                "top":targetY,
                "transform":"rotate("+targetRotation+"deg) scale("+targetScale+")",
                "-webkit-transform":"rotate("+targetRotation+"deg) scale("+targetScale+")"
            });

            startX = nowX;
            startY = nowY;
        } else {
            if(touches.length<2) return;
            var touch0 = touches[0];
            var touch1 = touches[1];
            var disx = (touch1.pageX - touch0.pageX) * (touch1.pageX - touch0.pageX);
            var disy = (touch1.pageY - touch0.pageY) * (touch1.pageY - touch0.pageY);
            nowDis = Math.sqrt(disx + disy);
            targetScale += Math.floor(nowDis - satrtDis) * 0.005;
            targetScale = toFloat_x(targetScale);

            if(freeRotateEnable){
                nowAngle = Math.atan2(touch1.pageY - touch0.pageY, touch1.pageX - touch0.pageX);
                var temp = nowAngle-startAngle;
                if( temp > 6 ){
                    temp -= Math.PI*2;
                }else if(temp < -6){
                    temp += Math.PI*2;
                }
                targetRotation += temp * 100;
                targetRotation = toFloat_x(targetRotation);
            }
            
            $sourceImg.css({
                "width":drawWid,
                "height":drawHei,
                "left":targetX,
                "top":targetY,
                "transform":"rotate("+targetRotation+"deg) scale("+targetScale+")",
                "-webkit-transform":"rotate("+targetRotation+"deg) scale("+targetScale+")"
            });

            satrtDis = nowDis;
            startAngle = nowAngle;
        }
    }

    function toFloat_x(num){
        var str = num.toFixed(2);
        return parseFloat(str);
    }
    function onTouchend(event) {
        if (!imageFile) return;
        
        if(targetScale<=1){
            if(targetScale<minScale) targetScale = minScale;
            if(!freeRotateEnable) fixedCenterPic();
        }else{
            if(targetScale>maxScale) targetScale = maxScale;
            if(!freeRotateEnable) fixedEdgePic();
        }
        if( !freeRotateEnable ){
            targetX = Math.min(Math.max(targetX,minX),maxX);
            targetY = Math.min(Math.max(targetY,minY),maxY);
        }
        

        $sourceImg.css({
            "width":drawWid,
            "height":drawHei,
            "left":targetX,
            "top":targetY,
            "transform":"rotate("+targetRotation+"deg) scale("+targetScale+")",
            "-webkit-transform":"rotate("+targetRotation+"deg) scale("+targetScale+")"
        });
    }

    // 缩放值小于1时的位置矫正
    function fixedCenterPic(){
        if(needImgRotationFixed){
            var offset;
            if (targetRotation % 180 == 0) {
                if (imageRatio > containerRatio) {
                    offset = - drawHei*(1-targetScale)*0.5;
                    minX = maxX = (realWidth - drawWid) * 0.5;
                    minY = realHeight - drawHei*targetScale + offset;
                    maxY = offset;
                } else {
                    offset = - drawWid*(1-targetScale)*0.5;
                    minX = realWidth - drawWid*targetScale + offset;
                    maxX = offset;
                    minY = maxY = (realHeight - drawHei) * 0.5;
                }
            } else {
                if (1 / imageRatio > containerRatio) {
                    minX = maxX = (realWidth - drawWid) * 0.5;
                    minY = realHeight - drawWid*targetScale * 0.5 - drawHei * 0.5;
                    maxY = (drawWid* targetScale-drawHei) * 0.5;
                } else {
                    minX = realWidth - drawHei*targetScale * 0.5 - drawWid * 0.5;
                    maxX = (drawHei* targetScale-drawWid) * 0.5;
                    minY = maxY = (realHeight - drawHei) * 0.5;
                }
            }
        }else{
            // fixed bug
            if (targetRotation % 180 == 0) {
                if (imageRatio > containerRatio) {
                    minX = realWidth - drawWid * (1+targetScale) * 0.5;
                    maxX = drawWid * (targetScale-1) * 0.5;
                    minY = maxY = (realHeight - drawHei) * 0.5;
                } else {
                    minX = maxX = (realWidth - drawWid) * 0.5;
                    minY = realHeight - drawHei * (1+targetScale) * 0.5;
                    maxY = drawHei * (targetScale-1) * 0.5;
                }
            } else {
                if (1 / imageRatio > containerRatio) {
                    minX = realWidth - drawHei*targetScale * 0.5 - drawWid * 0.5;
                    maxX = (drawHei* targetScale-drawWid) * 0.5;
                    minY = maxY = (realHeight - drawHei) * 0.5;
                } else {
                    minX = maxX = (realWidth - drawWid) * 0.5;
                    minY = realHeight - drawWid*targetScale * 0.5 - drawHei * 0.5;
                    maxY = (drawWid* targetScale-drawHei) * 0.5;
                }
            }
        }
        
    }
    // 缩放值大于1的位置矫正
    function fixedEdgePic(){
        if (targetRotation % 180 == 0) {
            minX = realWidth - drawWid * (1+targetScale) * 0.5;
            maxX = drawWid * (targetScale-1) * 0.5;
            minY = realHeight - drawHei * (1+targetScale) * 0.5;
            maxY = drawHei * (targetScale-1) * 0.5;
        } else {
            minX = realWidth - drawHei*targetScale * 0.5 - drawWid * 0.5;
            maxX = (drawHei* targetScale-drawWid) * 0.5;
            minY = realHeight - drawWid*targetScale * 0.5 - drawHei * 0.5;
            maxY = (drawWid* targetScale-drawHei) * 0.5;
        }
    }

    // 初始画缩放的位置矫正
    function fixedDrawSize() {
        targetScale = 1;
        if(needImgRotationFixed){
            // 由于img标签始终保持0度的方向（即忽视exif的旋转信息），所以满足 drawHei/drawWid = imageRatio, imageRatio 为 实际意义上高比宽
            if (targetRotation % 180 == 0) {
                // first execute
                if (imageRatio > containerRatio) {
                    // 上下移动
                    drawWid = realWidth;
                    drawHei = drawWid * imageRatio;
                    targetX = 0;
                    switch(config.initPosY){
                        case "top":
                            targetY = 0;
                        break;
                        case "bottom":
                            targetY = realHeight - drawHei;
                        break;
                        default:
                            targetY = (realHeight - drawHei) * 0.5;
                        break;
                    }
                    minScale = realHeight/drawHei;
                } else {
                    // 左右移动
                    drawHei = realHeight;
                    drawWid = drawHei / imageRatio;
                    targetX = (realWidth - drawWid) * 0.5;
                    targetY = 0;
                    minScale = realWidth/drawWid;
                }
            } else {
                if (1 / imageRatio > containerRatio) {
                    // 上下移动
                    drawHei = realWidth;
                    drawWid = drawHei / imageRatio;
                    targetX = (realWidth - drawWid) * 0.5;  
                    switch(config.initPosY){
                        case "top":
                            targetY = (realHeight - drawHei) * 0.5 - (realHeight - drawWid) * 0.5;
                        break;
                        case "bottom":
                            targetY = (realHeight - drawHei) * 0.5 + (realHeight - drawWid) * 0.5;
                        break;
                        default:
                            targetY = (realHeight - drawHei) * 0.5;
                        break;
                    }
                    minScale = realHeight/drawWid;
                } else {
                    // 左右移动
                    drawWid = realHeight;
                    drawHei = drawWid * imageRatio;
                    targetX = (realWidth - drawWid) * 0.5;
                    targetY = (realHeight - drawHei) * 0.5;
                    minScale = realWidth/drawHei;
                }
            }
        }else{
            // 由于img标签表现的方向与exif的旋转信息一致，所以满足 drawWid/drawHei = imageRatio, imageRatio 为 sourceWidth / sourceHeight;
            if (targetRotation % 180 == 0) {
                if (imageRatio > containerRatio) {
                    // 左右移动
                    drawHei = realHeight;
                    drawWid = drawHei * imageRatio;
                    targetX = (realWidth - drawWid) * 0.5;
                    targetY = 0;
                    minScale = realWidth/drawWid;
                } else {
                    // 上下移动
                    drawWid = realWidth;
                    drawHei = drawWid / imageRatio;
                    targetX = 0;  
                    switch(config.initPosY){
                        case "top":
                            targetY = 0;
                        break;
                        case "bottom":
                            targetY = realHeight - drawHei;
                        break;
                        default:
                            targetY = (realHeight - drawHei) * 0.5;
                        break;
                    }
                    minScale = realHeight/drawHei;
                }
            } else {
                // first execute
                if (1 / imageRatio > containerRatio) {
                    // 左右移动
                    drawWid = realHeight;
                    drawHei = drawWid / imageRatio;
                    targetX = (realWidth - drawWid) * 0.5;
                    targetY = (realHeight - drawHei) * 0.5;
                    minScale = realWidth/drawHei;
                } else {
                    // 上下移动
                    drawHei = realWidth;
                    drawWid = drawHei * imageRatio;
                    targetX = (realWidth - drawWid) * 0.5;
                    switch(config.initPosY){
                        case "top":
                            targetY = (realHeight - drawHei) * 0.5 - (realHeight - drawWid) * 0.5;
                        break;
                        case "bottom":
                            targetY = (realHeight - drawHei) * 0.5 + (realHeight - drawWid) * 0.5;
                        break;
                        default:
                            targetY = (realHeight - drawHei) * 0.5;
                        break;
                    }
                    minScale = realHeight/drawWid;
                }
            }
        }
        
        $sourceImg.css({
            "width":drawWid,
            "height":drawHei,
            "left":targetX,
            "top":targetY,
            "transform":"rotate("+targetRotation+"deg) scale("+targetScale+")",
            "-webkit-transform":"rotate("+targetRotation+"deg) scale("+targetScale+")"
        });              
    }

    // 生成图片
    function generateImage(){
        var resultCanvas = document.createElement("canvas");
        var resultContext = resultCanvas.getContext("2d");
        var resultWidth,resultHeight;
        resultWidth = Math.min(config.maxWidth,Math.min(sourceWidth,sourceHeight));
        resultHeight = resultWidth * containerRatio;
        resultCanvas.width = resultWidth;
        resultCanvas.height = resultHeight;
        resultContext.fillStyle = "#fff";
        resultContext.fillRect(0,0,resultWidth,resultHeight);
        var result_ratio = resultWidth/realWidth;
        
        var resultRotation;
        if(needImgRotationFixed){
            resultRotation = imgRotation + Math.PI / 2 * targetRotation/90;
            if (imgRotation % Math.PI <= 0.2) {
                drawImageIOSFix(resultContext, imageFile, 0, 0, sourceWidth, sourceHeight, targetX*result_ratio, targetY*result_ratio, drawWid*result_ratio, drawHei*result_ratio, targetScale, resultRotation);
            }else{
                var tarX = targetX + (drawWid-drawHei) * 0.5;
                var tarY = targetY + (drawHei-drawWid) * 0.5;
                drawImageIOSFix(resultContext, imageFile, 0, 0, sourceWidth, sourceHeight, tarX*result_ratio, tarY*result_ratio, drawHei*result_ratio, drawWid*result_ratio, targetScale, resultRotation); 
            }
        }else{
            resultRotation = targetRotation * Math.PI/180;
            drawImageIOSFix(resultContext, imageFile, 0, 0, sourceWidth, sourceHeight, targetX*result_ratio, targetY*result_ratio, drawWid*result_ratio, drawHei*result_ratio, targetScale, resultRotation);
        }
        return resultCanvas.toDataURL("image/jpeg", config.quality);
    }
    // 生成原比例图片
    function generateSourceImage(){
        var resultCanvas = document.createElement("canvas");
        var resultContext = resultCanvas.getContext("2d");
        var resultWidth,resultHeight;
        if( sourceWidth > sourceHeight ){
            resultWidth = Math.min( config.maxWidth, sourceWidth );
            resultHeight = resultWidth * sourceHeight/sourceWidth;
        }else{
            resultHeight = Math.min( config.maxWidth, sourceHeight );
            resultWidth = resultHeight * sourceWidth/sourceHeight;
        }
        resultContext.fillStyle = "#fff";
        
        if (imgRotation % Math.PI <= 0.2) {
            resultCanvas.width = resultWidth;
            resultCanvas.height = resultHeight;
            resultContext.fillRect(0,0,resultWidth,resultHeight);
            drawImageIOSFix(resultContext, imageFile, 0, 0, sourceWidth, sourceHeight, 0, 0, resultWidth, resultHeight, 1, imgRotation);
        }else{
            resultCanvas.width = resultHeight;
            resultCanvas.height = resultWidth;
            resultContext.fillRect(0,0,resultHeight,resultWidth);
            var tarX = (resultHeight-resultWidth) * 0.5;
            var tarY = (resultWidth-resultHeight) * 0.5;
            drawImageIOSFix(resultContext, imageFile, 0, 0, sourceWidth, sourceHeight, tarX, tarY, resultWidth, resultHeight, 1, imgRotation); 
        }

        return resultCanvas.toDataURL("image/jpeg", config.quality);
    }

    /**
     * Detecting vertical squash in loaded image.
     * Fixes a bug which squash image vertically while drawing into canvas for some images.
     * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
     *
     */
    function detectVerticalSquash(img) {
        var iw = img.naturalWidth,
            ih = img.naturalHeight;
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
            var alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio === 0) ? 1 : ratio;
    }
    /**
     * A replacement for context.drawImage
     * (args are for source and destination).
     */
    function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh, scale, angle) {
        var vertSquashRatio = detectVerticalSquash(img);
        ctx.save();
        ctx.translate(dx + dw / 2, dy + dh / 2);
        ctx.scale(scale, scale);
        ctx.rotate(angle);
        ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio, sw * vertSquashRatio, sh * vertSquashRatio, -1 * dw / 2, -1 * dh / 2, dw, dh);
        ctx.restore();
    }

    // 图片image对象，和显示的img标签
    var imageFile, $sourceImg;
    // 容器宽高，图片宽高，容器宽高比，图片宽高比
    var containerWidth, containerHeight, 
        sourceWidth, sourceHeight,
        containerRatio, imageRatio;
    //画到canvas上的宽高
    var drawWid, drawHei;
    // 旋转按钮，上传按钮，img标签
    var $btnRotate, $btnUpload;
    // 图片exif信息，exif中的旋转信息（单位已转为弧度）
    var exif, imgRotation;
    //当前图片位置，缩放，旋转角度
    var targetX, targetY,
        targetScale = 1,
        targetRotation = 0;

    var realWidth, realHeight;
    var startX,startY,nowX,nowY;
    var satrtDis,nowDis;
    var startAngle,nowAngle;
    var isMoveMode = true;
    var maxScale = 2,
        minScale,
        maxX,minX,
        maxY,minY;
    var needImgRotationFixed;
    var editable = true;
    var freeRotateEnable = false;

    var $controller;
    
    config = config || {};
    $btnRotate = config.btnRotate;
    $btnUpload = config.btnUpload;
    config.initPosY = config.initPosY || "middle";
    $controller = config.controller || $container;

    if(config.maxWidth){
        if(isNaN(config.maxWidth)){
            config.maxWidth = 1280;
        }else{
            config.maxWidth = Math.max(0, Math.min(1280, parseInt(config.maxWidth)));
        }
    }else{
        config.maxWidth = 1280;
    }

    if(config.quality){
        if(isNaN(config.quality)){
            config.quality = 0.8;
        }else{
            config.quality = Math.max(0, Math.min(1, parseFloat(config.quality)));
        }
    }else{
        config.quality = 0.8;
    }

    if(config.freeRotateEnable){
        freeRotateEnable = true;
    }else{
        freeRotateEnable = false;
    }

    containerWidth = $container.width();
    containerHeight = $container.height();
    containerRatio = containerHeight / containerWidth;

    realWidth = containerWidth;
    realHeight = containerHeight;
    
    if($container.css("position") === "static"){
        $container.css("position","relative");
    }

    $sourceImg = $("<img>").css({"position":"absolute"});
    $container.append($sourceImg);

    // 是否存在初始化图片
    if(config.sourceUrl){
        var sourceSrc = config.sourceUrl;
        var base64, binary, binaryData;

        // base64编码信息中读取图片exif信息
        try{
            base64 = sourceSrc.replace(/^.*?,/, '');
            binary = atob(base64);
            binaryData = new BinaryFile(binary);
            exif = EXIF.readFromBinaryFile(binaryData);
        }catch(error){
            // console.log(error);
        }

        imageFile = new Image();
        imageFile.onload = beginEdit;
        imageFile.src = sourceSrc;
        $sourceImg.attr("src",sourceSrc);
        
    }

    if($btnUpload){
        $btnUpload.on("click", function() {
            var $this = $(this);
            if (typeof FileReader === 'undefined') {
                alert("抱歉，你的浏览器不支持 FileReader");
            } else {
                $this.on("change", readFile);
            }
        });
    }

    if($btnRotate && !freeRotateEnable){
        $btnRotate.on("touchstart", function(e) {return false;});
        $btnRotate.on("touchmove", function(e) {return false;});
        $btnRotate.on("touchend", function(e) {
            if (imageFile) {
                targetRotation += 90;
                if (targetRotation >= 360) targetRotation = 0;

                fixedDrawSize();
            }
            return false;
        });
    }

    function updateContainerSize(){
        containerWidth = $container.width();
        containerHeight = $container.height();
        containerRatio = containerHeight / containerWidth;

        realWidth = containerWidth;
        realHeight = containerHeight;
    }

    function setImage(url){
        updateContainerSize();
    
        var sourceSrc = url;
        var base64, binary, binaryData;

        // base64编码信息中读取图片exif信息
        try{
            base64 = sourceSrc.replace(/^.*?,/, '');
            binary = atob(base64);
            binaryData = new BinaryFile(binary);
            exif = EXIF.readFromBinaryFile(binaryData);
        }catch(error){
            // console.log(error);
        }

        imageFile = new Image();
        imageFile.onload = beginEdit;
        imageFile.src = sourceSrc;
        $sourceImg.attr("src",sourceSrc);
    }

    function disableEditor(){
        editable = false;
        $controller.off("touchstart", onTouchstart);
        $controller.off("touchmove", onTouchmove);
        $controller.off("touchend", onTouchend);    
    }
    function enableEditor(){
        editable = true;
        $controller.on("touchstart", onTouchstart);
        $controller.on("touchmove", onTouchmove);
        $controller.on("touchend", onTouchend);
    }
    return {
        sourceImg: $sourceImg,
        getImageBase64: generateImage,
        getSourceImageBase64:generateSourceImage,
        setImage: setImage,
        disableEditor: disableEditor,
        enableEditor: enableEditor
    };
}

/* @auth 晓风 2015-06-11 */ 