$(function(){
    // 提示信息
    function hintMessage( msg ){
        var $hintBox = $('.hint-box');
        !$hintBox.length && ($hintBox = $('<div class="hint-box" style="position: fixed; left: 33%; top: 30%;' + 
        'padding: 8px; color: #FFF; border-radius: 5px; background-color: rgba(0,0,0,.7); font: 14px/20px sans-serif; z-index: 1000;"></div>')).appendTo('body');

        var timeoutId = null;
        var fn = function( msg ){
            clearTimeout(timeoutId);
            $hintBox.text( msg ).show();
            timeoutId = setTimeout(function(){
                $hintBox.hide();
            }, 2000);
        };
        fn( msg );

        // 惰性载入函数
        hintMessage = fn;
    }

    // 发布评论
    function publishComments( $btn, $wrap ) {
        // $btn 发布评论按钮
        // $wrap 发布评论初始化包装容器
        
        var $textarea = $wrap.find('textarea');
        var dataUrl = $btn.data('url');
        dataUrl = $btn.data('url');
        if ( !dataUrl ) { return; }
        
        $btn.on('tap',  postRequest);
        
        function postRequest(){
            var val = $.trim( $textarea.val() );
            if ( val ==='' ) {
                hintMessage('评论内容不能为空！');
                return;
            }
            $.ajax({
                url: dataUrl,
                dataType: 'json',
                data: {
                    val: val
                },
                success: function(res){
                    var data;
                    if ( res.succ ) {
                        data = res.data;
                        if ( data.html ) {
                            $('.discuss-list').prepend( data.html );
                            hintMessage('发布成功！');
                            $textarea.val('');
                        }
                    }
                    else {
                        hintMessage('发布失败或评论包含违禁词！');
                    }
                },
                error: function(){
                    hintMessage('发布失败！');
                }
            });
        }
    }

    // 加载更多评论
    function loadingMoreComments(){

        // 包装评论容器, 请求接口地址
        var $wrap, dataUrl;

        // 请求接口后返回 cursor 字段值，初始值0，每次请求需要带上 参数cursor
        var resCursor = 0;

        var 
            $showAllBtn = $('.show-all-comments-btn'),
            $win = $(window),
            winHeight = $win.height(),
            stopRequest = false,
            wrapOffsetTop,
            showOnce = true,
            timeoutId = null,
            $loading = $('<p style="width: 100%; text-align: center; margin-top: 10px;"><img style="width: 15px;" src="http://res.jiuyan.info/201411211434/tugoweb/3.0/images/loading.gif"></p>');

        $wrap = $('.discuss-list');
        if ( !$wrap.length ) { return; }
        wrapOffsetTop = $wrap.offset().top;

        dataUrl = $wrap.data('url');
        if ( !dataUrl ) { return; }

        // 滚动监听
        function scrollListener(){
            clearTimeout(timeoutId);
            timeoutId = setTimeout(initPostRequest, 10);
        }

        function firstPostRequest( successCall ){
            if ( stopRequest ) { return; }
            stopRequest = true;
            $.ajax({
                url: dataUrl,
                dataType: 'json',
                data:{
                    cursor: resCursor
                },
                beforeSend: function(){
                    $wrap.append($loading);
                },
                success: function( res ){
                    var data;
                    stopRequest = true;
                    if ( !res.succ ) {
                        console.log('请求接口返回false');
                        return;
                    }
                    data = res.data;
                    $loading.remove();
                    if ( data.html ) {
                        $html = $( data.html ).filter('.discuss-list-l');
                        $wrap.append( data.html );
                        resCursor = data.cursor;

                        // 小于十条评论，则意为最后一页
                        if ( $html.length < 10 ) {
                            $wrap.children().last().after('<p class="comlete-loading-hint">已全部加载完了哦~</p>');
                            $win.off('scroll', scrollListener);
                        }
                        // 首条评论大于等于10条显示展开全部按钮，只显示一次
                        else if ( showOnce ) {
                            $showAllBtn.css({ display: 'inline-block' });
                            showOnce = false;
                            $win.off('scroll', scrollListener);
                        }                        
                    }
                    else {
                        var len = $('.discuss-list-l').length;
                        if ( len && len%10 === 0 ) {
                            $wrap.children().last().after('<p class="comlete-loading-hint">已全部加载完了哦~</p>');
                        }
                        $(window).off('scroll', scrollListener);
                    }
                    successCall && successCall();
                    stopRequest = false;
                }
            });
        }

        // 初始化发送请求
        function initPostRequest( successCall ){
            if ( winHeight + $win.scrollTop() + 200 >= $wrap.offset().top + $wrap.height() ) {                
                firstPostRequest( successCall );
            }
        }

        // 首次加载10条评论
        firstPostRequest();
        $win.on('scroll', scrollListener);

        // 点击展开全部按钮
        $showAllBtn.one('tap', function(){
            initPostRequest(function(){
                $showAllBtn.hide();
            });
            $win.on('scroll', scrollListener);
        });
    }

    loadingMoreComments();  // 加载评论
    publishComments( $('.comment-send-btn'), $('.discuss-wrap') );  // 发布评论
});