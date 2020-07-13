/**编写聊天室
 * koa通过3000端口响应http，我们新加的WebSocketServer也是可以使用3000端口，虽然WebSocketServer可以使用其它端口，但是，统一端口有个最大的好处：
 * 实际应用中，http和websocket都使用标准的80和443端口，不需要暴露新的端口，也不需要修改防火墙规则。
 * 
 * 在3000端口被koa占用后，WebSocketServer如何使用端口：
 * 实际上，3000端口并非由koa监听，而是koa调用node标准的http模块创建的http.Server监听的。koa只是将响应的函数注册到该http.Server中，同样，WebSocketServer也可以把自己的响应函数注册到http.Server中，这样，同一个端口，根据协议可以分别由koa和ws处理。即http.Server判断是否为ws请求。
 * 
 * 
 * 
 * 格式应为：
* koa2_project_3
 *  - .vscode/
 *      -launch.json //vscode 配置文件
 *  - init.txt //初始化sql命令
 *  - config-defalut.js //mysql默认配置文件
 *  - config-override.js //mysql特定配置文件，用于实际环境的配置
 *  - config-test.js //mysql测试配置文件，用于测试环境的配置
 *  - config.js //mysql配置根据不同环境进行选择不同的配置文件文件
 *  - app.js //使用koa的js
 *  - controllers //处理url文件
 *      -login.js //处理登录相关的url
 *      -user.js //处理用户管理相关url
 *  - views //包含模版的文件（即模版文件都存放在该文件夹）
 *      -hello.html //登录成功模版，html模版文件
 *      -index.html //首页，默认模版
 *      -login.html //登录模版
 *      -public.html //公共模版，可以继承的模版结构
 *  - statics //包含静态的文件,该文件夹的目的是能够同意处理静态文件（包含css,js等）
 *      -bootstrap.min.css //需要引用的文件
 *  - models //不同model的数据处理
 *      -user.js //人员信息的数据处理
 *  - db.js //统一model的规则定义
 *  - model.js //对models文件夹内文件的处理
 *  - init-db.js //初始化数据库
 *  - package.json //项目描述文件
 *  - node_modules/  //npm 安装的所有依赖包
 * 
 * 
 * 
 * 注：
 * 浏览器创建WebSocket时发送的仍然是标准的HTTP请求。无论是websocket请求，还是普通的http请求，都会被http.Server处理。具体的处理方式则是由koa和WebSocketServer注入的回调函数实现的。WebSocketServer会首先判断请求是不是WS请求，如果是，它将处理该请求，如果不是，该请求仍由koa处理。
 * 
 * 所以，ws请求会直接由WebSocketServer处理，它不会经过koa，koa的任何middleware都没有机会处理该请求。
 * 
 * 在koa应用中，可以很容易的认证用户，例如：通过session或者cookie，但是，在响应websocket请求时，如何识别用户身份：
 * 一个简单可行的方案就是把用户登录后的身份写入cookie，在koa中，可以使用middleware解析cookie，把用户绑定到ctx.state.user上。
 * ws请求也是标准的http请求，所以，服务器也会把cookie发送过来，这样我们用WebSocketServer处理请求时，可以根据Cookie识别用户身份。
 * //一个用于识别用户身份的函数：
function parseUser(obj){
    if(!obj){
        return; 
    }
    console.log('try parse:'+obj);
    let s = '';
    if (typeof obj === "string") {
        let cookies = new Cookies(obj, null);
        s = cookies.get('name');
    }
    if (s) {
        try {
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            // console.log()
            console.log(`User:${user.name},ID:${user.id}`);
            return user;
        } catch (err) {
            //ignore(忽略)
        }
    }
}
 * 注：上述cookie并并有作Hash处理，实际上就是一个json字符串。
 * 
 * 在koa的middleware中，容易识别用户：
 * app.use(async (ctx,next)=>{
 *  ctx.state.user=parseUser(ctx.cookies.get('name')||'');
 *  await next();
 * } )
 * 
 * 在WebSocketServer中，就需要响应connection事件，然后识别用户：
 * wss.on('connetion',function(ws,req){
 *      //req为一个对象
 *      let user=parseuser(req);
 *      if(!user){
 *          //cookies不存在或者无效时，直接关闭websocket
 *          ws.close(4001,'Invaild user');
 *      }
 *      //识别成功，把user绑定到该WebSocket对象：
 *      ws.user=user;
 *      //绑定到WebSocketServer对象：
 *      ws.wss=wss;
 * })
 * 
 * 接下来，我们要对每个创建成功的WebSocket绑定message，close，error等事件处理函数。对于聊天应用来说，每收到一条消息，就需要把该消息广播到所有WebSocket连接上。
 * 
 * 为wss对象添加一个broadcase()方法：
 * wss.broadcase=function(data){
 *      wss.clients.forEach(function(client){
 *          client.send(data);
 *      })
 * }
 * 
 * 在某个WebSocket收到消息后，就可以调用wss.broadcase()进行广播：
 * ws.on("message",function(message){
 *      console.log(message);
 *      if(message && message.trim()){ //createMessage 为自己封装创建的函数，用于处理不同消息类型，封装为JSON字符串。 trim() 去除字符串首位空格
 *          let msg=createMessage("chat",this.user,message.trim());
 *          this.wss.broadcase(msg);
 *      }
 * })
 * 
 * 消息有很多类型，不一定是聊天的消息，还可以有获取用户列表，用户加入，用户退出等多种消息。所以我们需要用createMassage()创建一个JSON格式的字符串，发送给浏览器，浏览器端的Javascript就可以直接使用：
 *  //消息ID：
 *  let messageIndex=0;
 *  function createMessage(type,user,data){//type为消息类型，user为消息用户，data为消息的信息
 *      messageIndex++;
 *      return JSON.stringtify({
 *          id:messageIndex,
 *          type:type,
 *          user:user,
 *          data:data 
 *      })
 * }
 * 
 * 编写页面
 * 
 * 
 */



//导入koa2，且导入的为一个class(类)，故用大写Koa表示：
const Koa = require('koa');

// model使用
const model = require('./model');

//导入处理websocket相关处理的文件
const createWebSocketServer = require('./createWebSocketServer');

//导入post数据解析
const bodyparser = require("koa-bodyparser");

//导入处理url的middleware
const controller = require("./controller");

//导入处理静态文件的middleware
const staticFile = require("./static");

//导入模版渲染
const viewFile = require("./view");

//创建一个Koa对象表示web app本身
const app = new Koa();

// //获取对应表
// let User = model.User,
//     Pet = model.Pet;


// (async () => {
//     //向数据库对应表中插入一条数据
//     var user = await User.create({
//         email:"123@email.com",
//         name: "zhangsan1",
//         password:"111111",
//         gender: false
//     })

// })();

// 当前运行环境(生产环境显示prodiction,开发环境可能显示undefined)
var isProduction = process.env.NODE_ENV === "prodiction";
// console.log("所在环境为：" + process.env.NODE_ENV);

//使用处理静态文件的middleware定义的方法 ("/statics"静态文件夹所在目录，__dirname+"/statics" 静态文件夹所在的完整目录
if (!isProduction) {//在生产环境中，静态文件一般是由代理服务器处理（nginx）,node一般不处理静态文件，在开发环境中，为了避免手动配置反向代理服务器，使的开发环境变复杂，因此在开发环境中处理了静态文件。
    app.use(staticFile("/statics", __dirname + "/statics")); 
}

//添加post解析,在页面内获取到post传递的数据
app.use(bodyparser());
// 进行模版渲染
var viewOpts = {
    watch: !isProduction,
    // noCache: !isProduction,
    throwOnUndefined: !isProduction
};
app.use(viewFile("views",viewOpts));


/**
 * 注：app.use(执行的函数);
 */


 /**
  * 把WebSocketServer绑定到统一端口的关键代码是先获取koa创建的http.Server的引用，在根据http.Serverc创建WebSocketServer。
  * 
  */

//在端口3000监听,koa app的listen()方法返回http.Server
let server=app.listen(3003);

//给app设置属性wss用来存储WebSocketServer对象
app.wss = createWebSocketServer(server);

console.log('app start at port 3000...')


//使用middleware controller的post方法
app.use(controller());