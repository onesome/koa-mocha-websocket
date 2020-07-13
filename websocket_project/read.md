# websocket
## websocket简单介绍
websocket是html5新增的协议，他的目的是在浏览器和服务器之间建立一个不受限的双向通信的通道。如：服务器可以在任意时刻发送消息给浏览器。

传统的http协议不能做到websocket实现的功能的原因：
因为http协议是一个请求-响应的协议，请求必须先有浏览器发给服务器，服务器才能响应这个请求，再把数据发送给浏览器。即浏览器不主动请求服务器，服务器没办法主动发送数据给浏览器。

在浏览器中搞一个实时聊天，在线炒股，在线多人游戏等无法实现，只能借助flash这些插件。虽然用http协议能使用轮询或者comet实现，但是治标不治本有一定缺陷。

轮询：指浏览器通过JavaScript启动一个定时器，然后以固定的间隔给服务器发送请求，询问服务器有没有新消息。这个机制的缺点一是实时性不够，二是频繁的请求会给服务器带来极大的压力。

Comet：其本质上也是轮询，但是在没有消息的情况下，服务器先拖一段时间，等到有消息了再回复。这个机制解决了实时性的问题，但是带来了新的问题：以多线程模式运行的服务器会让大部分线程大部分时间都处于挂起状态，极大的浪费了服务器资源。另外，一个http连接在长时间没有数据传输的情况下，链路上的任何一个网关都可能关闭这个连接，而网关是我们不可控的，这就要求comet连接必须定期发一些ping数据表示连接“正常工作”。

因此，html5推出了websocket标准，让浏览器和服务器之间可以建立无限制的全双工通信，任何一方都可以主动发消息给对方。

## websocket协议
websocket并不是全新的协议，而是利用了http协议建立连接。
### websocket连接创建
首先，websocket连接必须由浏览器发起，因为请求协议是一个标准的http请求。格式：
    GET ws://localhost:3000/ws/chat   http/1.1
    Host:localhost
    Upgrade:websocket
    Connection:Upgrade
    Origin:http://localhost:3000
    Sec-Websocket-Key:client-random-string
    Sec-Websocket-Version:13

该请求与普通请求的不同是：
1.get请求的地址不是类似/path/，而是ws://开头的地址；
2.请求头Upgrade:websocket和Connection:Upgrade表示这个连接将转换为websocket连接；
3.Sec-Websocket-Key是用来标识这个连接，并非用于加密数据；
4.Sec-Websocket-Version指定了websocket协议版本。

服务器接受该请求，就会返回如下响应：
    HTTP/1.1 Switching Protocols
    Upgrade:websocket
    Connection:Upgrade
    Sec-websocket-Accept:sever-random-string

该响应代码101表示本次连接的http协议即将被更改，更改后的协议就是Upgrade:websocket指定的websocket协议。

版本号和子协议规定了双方能理解的数据格式，以及是否支持压缩等，如果仅使用websocket的API，就不需要关心这些。

现在一个websocket连接就建立成功，浏览器和服务器就可以随时主动发送消息给对方。消息有两种，一种为文本，一种为二进制数据。通常我们可以发送json格式的文本，这样，在浏览器处理起来十分容易。

### http连接不能实现双工通信的原因：
实际http协议是建立在tcp协议上的，tcp协议本身就实现了全双工通信，但是http协议的请求-响应机制限制了全双工通信。websocket连接建立以后，只是简单规定了：接下来的通信不使用http协议了，直接互相发数据。

安全的websocket连接机制和https类似。首先，浏览器用ws://xxx创建websocket连接时，会先通过https创建安全的连接，然后该https连接升级为websocket连接，底层通信走的仍然是安全的SSL/TLS协议。

## 浏览器
能够支持websocket通信，浏览器得支持这个协议，这样才能发出去ws://xxx的请求。支持websocket的主流浏览器版本：
    chrome
    firebox
    IE>=10
    sarafi>=6
    android>=4.4
    ios>=8

## 服务器
由于websocket是一个协议，服务器集体怎么实现，取决于所用编程语言和框架本身。node.js本身支持的协议包括TCP协议和HTTP协议，要支持websocket协议。需要对node.js提供的HTTPServer做额外的开发。已经有若干基于node.js的稳定可靠的websocket实现，我们直接npm安装使用就可以了。



文件夹：
websocket_project_0 websocket简单应用
websocket_project_1 websocket在线聊天室的应用






