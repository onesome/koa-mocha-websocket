/**
 * 该文件为处理实时数据的相关操作
 */

 //导入url模块
const url = require('url');
// 导入cookie模块
const Cookies = require('cookies');

// 导入websocket实例
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

// 创建WebSocketServer并对相应事件以及数据处理：
function createWebSocketServer(server,onConnection,onMessage,onClose,onError) {
    // 创建WebSocketServer对象:
    let wss = new WebSocketServer({
        server: server //使WebSocket的端口与koa一致
    });
    //为wss对象添加实时广播信息到所有websocket连接上的函数：
    wss.boradcase = function (data) {
        wss.clients.forEach(function (client) {
            client.send(data);
        })
    };
    // 
    onConnection = onConnection || function () {
        console.log.log('[WebSocket] connected');
    };
    onMessage = onMessage || function (meg) {
        console.log(`[WebSocket] message received:' + ${ meg }.`);
    };
    onClose = onClose || function (code, message) {
        console.log(`[WebSocket] closed:${code}-${message}.`);
    };
    onError = onError || function (err) {
        console.log(`[WebSocket] error:${err}.`);
    };
    // WebSocketServer连接进行的相关操作
    wss.on('connection', function connection(ws,req) {
        let location = url.parse(req.url, true);
        // console.log(`[WebSocketServer] connection:${location.href}`);
        // console.log(location.pathname);
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);
        
        // 判断是否为指定地址
        if (location.pathname!="/ws/chat") {
            //关闭模块ws
            ws.close(4000, 'Invalid URL');
        }
        //当前的用户
        let user = parseUser(req);
        // console.log("[WebSocketServer] user:",user);
        //判断用户是否为指定用户
        if (!user) { //不存在用户，关闭ws模块
            ws.close(4001, 'Invalid User');
        }
        ws.user = user;
        ws.wss = wss;
        onConnection.apply(ws);//this为ws
    });
    console.log('websocketserver was attached.');
    //返回WebSocketServer对象
    return wss;
}

 //一个用于识别用户身份的函数：
 function parseUser(obj){ //obj为cookies信息
    if(!obj){
        return; 
    }
    // console.log('try parse:'+obj);
    let s = ''; //用于保存cookie用户信息的变量
    if (typeof obj === "string") {
        s = obj;

    } else if (obj.headers) { //获取cookie保存的用户信息
        let cookies = new Cookies(obj, null);
        s = cookies.get('user');
    }
     if (s) { //对获取到的cookie保存的用户信息进行处理
         try {
            //  console.log(Buffer.from(s, 'base64').toString(), "000000000");
            //  Buffer对象进行base64的解码
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            // console.log(`User:${user.name},ID:${user.id}`);
            return user;
         } catch (err) {
             console.log("err:",err);
            //ignore(忽略)
        }
    }
}


//websocket将消息封装为JSON字符串方w读取使用的函数：
let messageIndex = 0;
function createrMessage(type, user, data) { //type 消息类型，user 该消息的用户 data 消息的内容
    messageIndex++;
    // console.log(JSON.stringify({
    //     id: messageIndex,
    //     type: type,
    //     user: user,
    //     data: data
    // }));
    //返回json字符串
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}

/*创建WebSocketServer的函数：*/
//1.WebSocket连接时执行的函数
function onConnect() {
    let user = this.user; //在哪里使用，this就是谁, 该例中this指ws
    console.log("WebSocket连接时执行的函数的用户：",user);
    let msg = createrMessage('join', user, `${user.name} joined.`);
    //实时告诉websocket的信息（该用户谁）
    this.wss.boradcase(msg); 
    //获取到客户端的所有用户信息
    let users = [];
    this.wss.clients.forEach(function (client) {
        // console.log('WebSocket连接时执行的函数client:',client)
        users.push(client.user);
    }); 
    //告诉websocket所有用户信息（用户列表）
    this.send(createrMessage('list', user, users));
    // //实时告诉websocket的信息（该用户谁）
    // this.wss.boradcase(createrMessage('list', user, users)); 
}
//2.WebSocket发送信息时执行的函数
function onMessage(message) {
    console.log(message);
    let msg = createrMessage("chat", this.user, message.trim());//trim() 去除字符串首尾空格
    this.wss.boradcase(msg);
}
//3.WebSocket关闭时执行的函数
function onClose() {
    let user = this.user;
    let msg = createrMessage('closed', user, `${user.name} closed.`);
    this.wss.boradcase(msg);
}

function createWebSocketServerInit(server) {
    createWebSocketServer(server,onConnect, onMessage, onClose);
} 

module.exports = createWebSocketServerInit;