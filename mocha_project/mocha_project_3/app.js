/**
 * 创建app实例，不监听端口
 */
//导入koa2，且导入的为一个class(类)，故用大写Koa表示：
const Koa = require('koa');

// model使用
const model = require('./model');

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

// // 获取对应表
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
    noCache: !isProduction,
    throwOnUndefined: !isProduction
};
app.use(viewFile("views",viewOpts));
//使用middleware controller的post方法
app.use(controller());

/**
 * 注：app.use(执行的函数);
 */


module.exports = app;

