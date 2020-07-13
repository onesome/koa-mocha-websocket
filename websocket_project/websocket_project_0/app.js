/**使用ws模块
 * 
 * 要使用websocket，关键在于服务器端支持，这样，我们才有可能在支持websocket的浏览器中使用websocket。
 * 
 * 在node.js中，使用最广泛的websocket模块是ws。
 * 
 * 安装ws模块的命令：npm install ws
 * 
 * 工程目录结构：
 * - app.js //启动js文件
 * - package.json //项目描述文件
 * - node_modules //npm安装依赖包
 */

//  创建一个websocket实例

//导入websocket模块

const WebSocket = require('ws');

// 引用Sever类
const WebSocketSever = WebSocket.Server;

//实例化-在3000端口上打开一个websocket sever,该实例由变量wss引用。
const wss = new WebSocketSever({
    port: 3000
});

// 接下来，如果有websocket请求接入，ws对象可以响应connection事件来处理这个websocket:
wss.on('connection', function (ws) { //connection事件
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {//message事件
        console.log(`[SERVER] Received:${message}`);
        ws.send(`ECHO:${message}`, (err) => {
            if (err) {
                console.log(`[SERVER] error:${error}`)
            }
        })
    })
})

console.log("ws sever started at 3000... ")
// 在connection事件中，回调函数会传入一个websocket的实例，表示这个websocket连接，对于每个websocket连接，我们都要对它绑定某些事件方法来处理不同的事件，该例中我们通过响应message事件，在收到消息后再返回一个echo：xxx的信息给客户端。

/**
 * 创建websocket连接
 * 上面一个简单的服务端websocket程序就编写好了。
 * 真正创建websocket并且给服务器发消息：方法是在浏览器中写JavaScript代码。
 * 
 * 使用
 */

//以下为使用客户端代码，即打开localhost:3000在控制台中输入以下代码进行测试使用
// 创建一个WebSocket:
// let ws = new WebSocket('ws://localhost:3000/ws/chat'); //端口号要一致
////打开websocket连接后立刻发送一条消息
// ws.onopen=function () {
//     console.log(`[CLIENT] open()`);
//     // 给服务器发送的消息
//     ws.send('Hello!');
// };
//// 响应onmessage事件
// ws.onmessage=function (message) {
//  // 给服务器发送的消息
//  ws.send('message end Goodbye!');
//  // 关闭websocket
//  ws.close();
// };

/**
 * 同源策略
 * websocket协议本身不要求同源策略，也就是某个地址为http://a.com的网页可以通过websocket连接到ws://b.com。但是，浏览器会发送origin的http头给服务器，服务器根据origin拒绝这个websocket请求。所以，是否要求同源要看服务器端如歌检查。
 * 
 * 路由
 * 服务器在响应connection事件时并未检查请求的路径，因此，在客户端打开ws//localhist:300/ws/chat可以写成任意的路径。
 * 实际应用中还需要根据不同的路径实现不同的功能。
 */