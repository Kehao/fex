/**
 * Get query parameter value from url
 * @param  {string} name key
 * @return {string}      value
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var searchStr = window.location.search.split('?')[1]
    var result = searchStr && searchStr.match( reg );
    return result && result[2] && decodeURIComponent( result[2] ) || '';
}

function getAppVersion() {
    return getQueryString("_version");
}

function getSource() {
    return getQueryString("_source");
}

function isFromApp() {
    var
        _tokenStr = getQueryString('_token'),

        source = getSource(),
        version = getAppVersion(),

        sourceValid = source && /^(ios|android)$/i.test(source),
        versionValid = version && /^[\d\.]+$/.test(version);

    return (_tokenStr && _tokenStr.length) || (sourceValid && versionValid) || __getCookie('tg_auth') || __getCookie('_source') || __getCookie('_version');
}

function isWeChatApp(){
    return /MicroMessenger/.test(navigator.userAgent);
}

// 参数: 特定版本specifyVersion (缩写 sV) 例如: 1.9.2
function isGreaterThanCurVersion( sV ) {
    var curV, sV, curArr, sArr, loopLength;
    curV = getQueryString("_version");
    if ( !sV || !curV ) {
        return;
    }
    curArr = curV.split('.');
    sArr = sV.split('.');
    loopLength = Math.min( curArr.length, sArr.length );

    for ( var i = 0; i < loopLength; i++ ) {
        if ( sArr[i] !== curArr[i] ) {
            return Number(sArr[i]) > Number(curArr[i]);
        }
    }
    return curArr.length > sArr.length ? false : true;
}

// 获取cookie值
function __getCookie( cookieName ){
    var reg = new RegExp("(^|;\\s)" + cookieName + "=([^;\\s]+)(;\\s|$)");
    var result = document.cookie.match(reg);
    return result && result[2] && decodeURIComponent( result[2] );
}

// 初始化静态页面cookie,服务于来源为本页面的、url未带_source,_version参数的子页面使用
function initStaticPageCookie(){
    if ( isFromApp && isFromApp() ) {
        var 
            token = getQueryString("_token"),
            sourceVal = getQueryString('_source'),
            versionVal = getQueryString('_version');

        !__getCookie('tg_auth') && token && (document.cookie = "tg_auth=" + token + ";path=/;");
        !__getCookie('_source') && sourceVal && (document.cookie = "_source=" + sourceVal + ";path=/;");
        !__getCookie('_version') && versionVal && (document.cookie = "_version=" + versionVal + ";path=/;");
    }
}
initStaticPageCookie();