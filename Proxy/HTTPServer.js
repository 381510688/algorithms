/**
 * HTTP服务端
 * Created by ligang on 17/5/28.
 */

import http from 'http';
import url from 'url';
import querystring from 'querystring';

// var server = http.createServer((request, response) => {
//     // 接受客户端请求时触发
//     console.log('接受到请求');
// });
//
// server.listen(10000, 'localhost', 511, () => {
//    // 开始监听
//     console.log('开始监听');
// });


var server = http.createServer();
// 接受客户端请求时触发
server.on('request', (request, response) => {
    request.setEncoding('utf-8');
    if(request.url !== '/favicon.ico') {
        response.setTimeout(2 * 60 * 1000, () => {
           console.error('请求超时！');
        });
        response.on('close', () => {
            console.error('请求中断！');
        });
        let result = '';
        request.on('data', (data) => {
            console.log(data);
            result += data;
        });
        request.on('end', () => {
            console.log(`服务器数据接收完毕：${result}`);
            response.statusCode = 200;
            let resultJson = {};
            if(request.method == 'POST') {
                resultJson = JSON.parse(result);
                console.log(typeof resultJson);
                console.log(resultJson.uid);
            }else {
                resultJson = querystring.parse(url.parse(request.url).query);
            }

            if(resultJson.uid == 1) {
                response.write('你好，管理员通知！');
            }else {
                response.write('欢迎你！');
            }
            response.end(); // 结束本次请求
        });
    }
});

server.listen(10000, 'localhost', 511);
// 开始监听
server.on('listening', () => {
    console.log('开始监听');
});

// server.setTimeout(60 * 1000, () => {
//    console.log('超时了');
// });

server.on('error', (e) => {
    if(e.code === 'EADDRINUSE') {
        // 端口被占用
    }
});

// let str = querystring.stringify({name: 'ligang', age: 27});
// console.log(str);
// let obj = querystring.parse(str);
// console.log(obj);
//
// var urlStr = 'http://ligangblog.com/javascript/?name=lg&uid=1#a/b/c';
// console.log(url.parse(urlStr, true));

// console.log(url.resolve('http://ligangblog.com/javascript/', 'a?a=1'));
// console.log(url.resolve('http://ligangblog.com/javascript/', '/a?a=1'));