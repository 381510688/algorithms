/**
 * Created by ligang on 17/5/27.
 */
import http from 'http';
import https from 'https';
import fs from 'fs';




async function clientHttps(options, data) {
    // 如果是https,则开启https
    if(options.protocol.indexOf("https") > -1){
        options.headers = options.headers || {};
        options.key = fs.readFileSync(deploy.basePath + '/bin' + '/www.ptengine.cn.key');   // 私钥
        options.cert = fs.readFileSync(deploy.basePath + '/bin' + '/www.ptengine.cn.crt');  // 公钥
        options.port = 443;
        options.rejectUnauthorized = false;
        options.agent = new https.Agent(options);
    }
    let output = new Promise((resolve, reject) => {
        let req = http.request(options, (res) => {
            let result = '';
            res.setEncoding('utf8');
            res.on('data', chunk => {
                result += chunk;
            });
            res.on('end', () => {
                resolve(result);
            });
        });
        req.setTimeout(60000, () => {
            console.error(`连接后台超时 ${options.href}`);
            resolve();
        });
        req.on('error', err => {
            if (err.code === 'ECONNRESET') {
                console.error(`连接后台超时 ${options.href}`);
            } else {
                console.error(`连接后台报错 ${err}`);
            }
            resolve();
            req.abort();
        });
        if (data) {
            req.write(JSON.stringify(data)); // send param
        }
        req.end(); // fire
    });
    return await output;
}