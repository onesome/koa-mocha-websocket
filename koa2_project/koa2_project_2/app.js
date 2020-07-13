

/*
重构url，将处理URL组件单独分离出去，app.js自动导入所有处理URL的函数，好处是代码分离，逻辑清除，具有非常好的模块化。

重构url文件格式应为：
* koa2_project
 *  - .vscode/
 *      -launch.json //vscode 配置文件
 *  - app.js //使用koa的js
 *  - controllers //处理url文件
 *      -login.js //处理登录相关的url
 *      -user.js //处理用户管理相关url
 *  - package.json //项目描述文件
 *  - node_modules/  //npm 安装的所有
*/

//导入koa2，且导入的为一个class(类)，故用大写Koa表示：
const Koa = require('koa');
//导入post数据解析
const bodyparser = require("koa-bodyparser");
//导入middleware
const controller = require("./controller");

//创建一个Koa对象表示web app本身
const app = new Koa();

//添加post解析,在页面内获取到post传递的数据
app.use(bodyparser());
//使用middleware controller的post方法
app.use(controller());
/**
 * 注：app.use(执行的函数);
 */

//在端口3000监听：
app.listen(3011);

