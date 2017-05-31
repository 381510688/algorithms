/**
 * HTTP代理
 * Created by ligang on 17/5/30.
 */

import http from 'http';
import url from 'url';

/**
 * 服务端
 */
const server = http.createServer(async (req, res) => {
    // req.setEncoding('utf-8');
    /* 超时 2分钟 */
    res.setTimeout(2 * 60 * 1000, () => {
        // ...
    });
    /* 连接中断 */
    res.on('close', () => {
        // ...
    });

    let options = {},
        result = "";

    options = await new Promise((resolve, reject) => {
        if(req.method === 'GET') {
            options = url.parse('http://localhost:10000' + req.url);
            resolve(options);
        }else if(req.method === 'POST') {
            req.on('data', (data) => {
                result += data;
            });

            req.on('end', () => {
                options = url.parse('http://localhost:10000' + req.url);
                options.headers = {
                    'content-type': 'application/json',
                };
                resolve(options);
            });
        }
    });
    options.method = req.method;

    let content = await clientHttp(options, result ? JSON.parse(result) : result);
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><head><meta charset="UTF-8" /></head>')
    res.write(content);
    res.write('</html>');
    // 结束本次请求
    res.end();
});
server.listen(10010, 'localhost', 511);
/* 开始监听 */
server.on('listening', () => {
    // ...
});
/* 监听错误 */
server.on('error', (e) => {
    console.log(e.code);
    // ...
});

/**
 * 客户端
 * @param options 请求参数
 * @param data 请求数据
 */
async function clientHttp(options, data) {
    let output = new Promise((resolve, reject) => {
        let req = http.request(options, (res) => {
            let result = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                result += chunk;
            });
            res.on('end', function () {
                resolve(result);
            });
        });
        req.setTimeout(60000, () => {
            console.error(`连接后台超时 ${options.href}`);
            reject();
            req.abort();
        });
        req.on('error', err => {
            console.error(`连接后台报错 ${err}`);
            if (err.code === 'ECONNRESET') {
                console.error(`socket超时 ${options.href}`);
            } else {
                console.error(`连接后台报错 ${err}`);
            }
            reject();
            req.abort();
        });
        // 存在请求数据，发送请求数据
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
    return await output;
}