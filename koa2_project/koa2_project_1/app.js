// 处理url,集中处理url的组件

//导入koa2，且导入的为一个class(类)，故用大写Koa表示：
const Koa = require('koa');

//导入koa-router,且require("koa-router")返回的是函数：
const router = require("koa-router")();

//导入post数据解析
const bodyparser = require("koa-bodyparser");


//创建一个Koa对象表示web app本身

const app = new Koa();

/*
处理url
针对不同url，调用不同的函数，需要一个集中处理的middleware,可以通过不同url调用不同函数，这样我们可以为不同url进行不同函数编写。故引入koa-router这个middleware来负责处理url映射。

每个http请求调用
*/
app.use(async (ctx, next) => { //koa middleware
    console.log(`请求方法为${ctx.method},请求地址为${ctx.url}`);
    await next();
})

/*
请求地址处理

get请求：router.get("/path",async fn),通过ctx.params.变量名来访问url变量。

post请求：router.post("/path",async fn),但是由于post请求通常会发送表单或者JSON，作为request的body发送，无论是Node.js提供的原始request对象还是koa提供的request对象，都不能解析request的body功能。因此需要另一个middleware来解析原始request请求，然后将解析后的参数绑定在ctx.request.body中，即koa-bodyparser。

*/
router.get("/", async (ctx, next) => {
    ctx.body="<h1>登录</h1><form action='/get_singin' method='get'><span>账号</span><input type='text' name='user' /><span>密码</span><input type='password' name='password' /><input type='submit' /></form>"
})
router.get("/login", async (ctx, next) => {
    ctx.body = "<h1>登录</h1><form action='/singin' method='post'><span>账号</span><input type='text' name='user' /><span>密码</span><input type='password' name='password' /><input type='submit' /></form>";
    
})
router.get("/app/:param/:name", async (ctx, next) => {
    var param = ctx.params.param; //访问url变量
    var name = ctx.params.name;
    ctx.body=`<h1>app next is ${param} and ${name}</h1>`
})

router.post("/singin", async (ctx, next) => {
    var user = ctx.request.body.user,
        password = ctx.request.body.password;
        
    ctx.body=`<h1>post登录成功，欢迎 ${user} 密码： ${password}</h1>`
})
router.get("/get_singin", async (ctx, next) => {
    var user = ctx.request.query.user,
        password = ctx.request.query.password;
        
    ctx.body=`<h1>get登录成功，欢迎 ${user} 密码： ${password}</h1>`
})

//添加post解析,由于moddleware的顺序是自上而下的，故需放在router之前
app.use(bodyparser());

//添加router moddleware
app.use(router.routes())
//在端口3000监听：
app.listen(3007);
console.log('app started at port 3000...');

/**
 * 下一个问题，koa包怎么安装，该文件（app.js）怎么正常导入？
 * 方法一：
 * 使用npm命令直接安装koa，在该目录下执行命令 npm install koa
 * npm 会将koa2以及koa2依赖的所有包全部安装到当前目录的node_modules目录下。
 * 
 * 方法二：
 * 在该目录下创建一个package.json，这个文件描述了我们的项目会用到哪些包。完整内容如下：
 * {
 *  "name":"koa2-project",
 *  "version":"1.0.0",
 *  "description":"hello koa2",
 *  "main":"app.js",
 *  "scripts":{
 *      "start":"node app.js"
 *  },
 *  "keywords":["koa","async"],
 *  "author":"wh",
 *  "license":"Apache-2.0",
 *  "repository":{
 *      "type":"git",
 *      "url":"https://github.com/onesome/koa2_project.git"
 *  },
 *  "dependencies":{
 *      "koa":"2.0.0"
 *  }
 * }
 * 
 * 其中，dependencies描述了我们工程需要依赖的包以及版本号，其他字段为描述项目信息，可任意填写。
 * 
 * 然后，在该目录下执行npm install 就可以把所需包以及以来包一次性全部装好。
 * 
 * 注：任何时候都可以直接删除整个node_modules目录。因为npm install命令可以完整的重新下载所有以来，并且，这个目录不应该被放入版本控制中。
 * 
 * 工程结构如下：
 * koa2_project
 *  - .vscode/
 *      -launch.json //vscode 配置文件
 *  - app.js //使用koa的js
 *  - package.json //项目描述文件
 *  - node_modules/  //npm 安装的所有
 * 
 * 
 *  */ 
