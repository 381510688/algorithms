# 代理

该模块使用Node编写，主要通过代理实现跨域请求（HTTP、HTTPS）

- HTTPServer.js HTTP服务端
- HTTPClient.js HTTP客户端
- HTTPProxy.js  HTTP代理
- HTTPSServer.js HTTPS服务器
- HTTPSClient.js HTTPS客户端


## HTTP代理

- POST请求必须指定headers信息，否则会报错socket hang up
- 获取到options后需要重新指定其method `options.method = req.method`;


