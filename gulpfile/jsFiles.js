'use strict';
var fs = require('fs');
module.exports = function (taskDir) {
    var requires = [];
    var jsonPath = taskDir + '/js/config.json';
    console.log(jsonPath);
    if ( !fs.existsSync(jsonPath) ) {
        console.log( jsonPath + '不存在！' );
        return [];
    }
    var a;
    var data = fs.readFileSync(jsonPath, 'utf-8'); 
    if ( !data ){
        console.log('读取config.json文件失败！');
        return [];
    }
    data = JSON.parse(data);
    if ( data.outdate ) {
        return [];
    }

    if ( data.require ) {
        requires = data.require;

        // 处理文件后缀，提示目标文件是否存在
        for ( var i = 0, len = requires.length; i < len; i++ ) {
            if ( !/.+\.js$/.test(requires[i]) ) {
                requires[i] = requires[i] + '.js';
            }
            else {
                requires[i] = requires[i];
            }

            if ( !fs.existsSync(requires[i]) ) {
                console.log( requires[i] + '文件不存在！' );
            }
        }
    }
    return requires;
};
