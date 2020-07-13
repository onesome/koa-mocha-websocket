/*
MVC模式(model-view-controller 模型-视图-控制器)

流程：
用户输入url请求数据->koa调用异步函数处理请求url(在该异步函数中通过nunjucks将数据用指定的模版渲染成html，然后输出给浏览器)->用户看到渲染后的页面

其中，
异步函数为C(controller),负责业务逻辑（如：检查用户用是否存在，获取用户数据）。
包含变量{{name}}的模版为V(view),负责显示逻辑，通过简单的替换变量，最终输出html。
数据对象(javascript对象)为M(model),负责给view传递变量数据，这样，view替换变量可以从model获取到相应数据。

格式应为：
* koa2_project_3
 *  - .vscode/
 *      -launch.json //vscode 配置文件
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
 *  - package.json //项目描述文件
 *  - node_modules/  //npm 安装的所有


注：
模版引擎是独立使用的，没有依赖koa。故命令安装为：npm install nunjucks

需要通过nunjucks文档学习nunjucks的使用。
*/

//导入koa2，且导入的为一个class(类)，故用大写Koa表示：
const Koa = require('koa');

//导入post数据解析
const bodyparser = require("koa-bodyparser");

//导入处理url的middleware

const controller = require("./controller");
//导入处理静态文件的middleware

const staticFile = require("./static");

//导入模版渲染
const viewFile = require("./view");
// //导入模版引擎nunjucks
// const nunjucks = require("nunjucks");

//创建一个Koa对象表示web app本身
const app = new Koa();

/*
创建使用nunjucks模版引擎环境的函数:
createEnv函数：封装相关nunjucks配置的函数，即nunjucks.configure([path],[opts])
path:存放模版的目录
opts：需要配置值封装的对象(autoescape,noCache,watch,throwOnUndefined,trimBlocks,lstripBlocks,web,express,tags)

*/
// function createEnv(path, opts) {
//     var autoescape = opts.autoescape === undefined ? true : opts.autoescape; //输出内容是否需要转义（"<"转为"&lt;"）
//     noCache = opts.noCache || false,//是否不使用缓存，false缓存(默认)；
//     watch = opts.watch || false,//当模块变化时是否重新加载，false不加载(默认)；
//     throwOnUndefined = opts.throwOnUndefined || false;//输出为undefined或null是否抛出异常，false不抛出(默认)；
    
//     /*创建环境变量

//     new nunjucks.Environment([loaders],[opts])-管理模版：可以用来加载模版，模版之间可以继承和包含; 
//     loaders:加载器(地址(一个或多个))，默认从当前目录或地址加载
//     opts：需要配置值封装的对象(autoescape，throwOnUndefined，trimBlocks，lstripBlocks)

//     new nunjucks.FileSystemLoader([searchPaths],[opts])-node端从文件系统中加载模版：创建一个文件加载器，从指定路径读取模版。
//     searchPaths:查找模版的路径，可以一个也可以多个
//     opts:需要配置值封装的对象(noCache,watch)

//     */
//     var loadersConfig = new nunjucks.FileSystemLoader(path, {
//         noCache: noCache,
//         watch: watch
//     }),
//         optsConfig = {
//             autoescape: autoescape,
//             throwOnUndefined:throwOnUndefined
//         };
//     var env = new nunjucks.Environment(loadersConfig,optsConfig)
    
//     /*判断是否有需要添加自定义的过滤器，有则添加自定义的过滤器 */
//     if (opts.filters) {//有自定义的过滤器
//         for (f in opts.filters) {
//             env.addFilter(f, opts.filters[f]); //添加遍历的过滤器
//         }
//     }

//     return env; //返回定义好的环境变量(初始化状态)
// }

// //创建使用nunjucks模版引擎环境,表示nunjucks模版引擎对象
// var env = createEnv("views", {
//     watch: true, //模块数据变化更新
//     throwOnUndefined: true,//输出为undefined或null时抛出错误，这里设置为true是为了开发使用，正式环境为默认值
//     filters: {
//         hex: function (n) { //转化为十六进制
//             return "0x" + n.toString(16)
//         }
//     }
// });


// 当前运行环境
var isProduction = process.env.NODE_ENV === "prodiction";
console.log("所在环境为：" + process.env.NODE_ENV);

//使用处理静态文件的middleware定义的方法 ("/statics"静态文件夹所在目录，__dirname+"/statics" 静态文件夹所在的完整目录
if (!isProduction) {//在生产环境中，静态文件一般是由代理服务器处理（nginx）,node一般不处理静态文件，在开发环境中，为了避免手动配置反向代理服务器，使的开发环境变复杂，因此在开发环境中处理了静态文件。
    app.use(staticFile("/statics", __dirname + "/statics")); 
}

//添加post解析,在页面内获取到post传递的数据
app.use(bodyparser());
// 进行模版渲染
var viewOpts = {
    watch: !isProduction,
    noCache: !isProduction,
    throwOnUndefined: !isProduction
};
app.use(viewFile("views",viewOpts));
//使用middleware controller的post方法
app.use(controller());

/**
 * 注：app.use(执行的函数);
 */

//在端口3000监听：
app.listen(3015);

