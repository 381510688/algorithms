/**
 * HTTP客户端
 * Created by ligang on 17/5/30.
 */
import http from 'http';

const options = {
        hostname: 'localhost',
        port: 10000,
        path: '/',
        method: 'post'
    },
    req = http.request(options);

req.write(JSON.stringify({uid: 1}));
req.end();

req.on('response', (res) => {
    console.log(`状态码：${res.statusCode}`);
    let result = '';
    res.on('data', (data) => {
        result += data;
    });
    res.on('end', () => {
        console.log(`客户端接受到响应：${result}`);
    })
});
req.setTimeout(60* 1000, () => {
    console.log('超时了');
    req.abort();
});
req.on('error', (error) => {
    if(error.code === 'ECONNERSET') {
        console.log('socket端口超时');
    }else {
        console.log(`发送错误：${error.code}`);
    }
});