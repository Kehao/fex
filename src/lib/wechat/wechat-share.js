// 微信分享 依赖zepto或jQuery 以及 http://res.wx.qq.com/open/js/jweixin-1.0.0.js
// 仅适用于微信分享
$(document).ready(function() {
    if( window.wxUrl ){
       $.ajax({
            url: window.wxUrl,
            data: {
                abs_url: location.href.split('#')[0]
            },
            success: function(res) {
                res.succ && config(res);
            }
        }); 
    }  

    // var shareTimelineObj = {
    //     title: text, // 分享标题
    //     link: 'http://www.qiuyouyuan.com/static/promo/game_huba.html?_ig=wxtimeline', // 分享链接
    //     imgUrl: 'http://d1.jiuyan.info/2015/07/17/F977A182-0B61-4B2F-FF98-9479A85F0B50.jpg?v=2', // 分享图标
    //     success: function() {
            
    //     },
    //     cancel: function() {

    //     }
    // };

    // var shareAppMessageObj = {
    //     title: '听说只有9%的人能成功保卫胡巴，成为胡巴的“再生父母”，你敢挑战吗？', // 分享标题
    //     desc: text, // 分享描述
    //     link: 'http://www.qiuyouyuan.com/static/promo/game_huba.html?_ig=wxappmsg', // 分享链接
    //     imgUrl: 'http://d1.jiuyan.info/2015/07/17/F977A182-0B61-4B2F-FF98-9479A85F0B50.jpg?v=2', // 分享图标
    //     type: '', // 分享类型,music、video或link，不填默认为link
    //     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    //     success: function() {  
            
    //     },
    //     cancel: function() {
    //         // 用户取消分享后执行的回调函数
    //     }
    // }

    function config(res) {
        res.succ && wx.config({
            debug: window.wxDebug || false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.noncestr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.error(function(res){});

        wx.ready(function() {
            wx.onMenuShareTimeline( window.shareTimelineObj || {} );  
            wx.onMenuShareAppMessage( window.shareAppMessageObj || {} );
        });
    }
});
 