/**
 * 访问mysql数据库只有一种方法：通过网络发送sql命令，然后mysql服务器执行后返回结果。
 * 对于node.js程序访问mysql也是一样的方法。（mysql官方提供了不同语言的驱动程序，而node驱动需要5.7版本以上。）
 * 
 * ORM(Object-Relational-Mapping)
 * 把关系数据库的表结构映射到对象上。（即：每行数据可以用对象表示）
 * 
 * ORM框架-sequelize
 * 使用sequelize来操作数据库，这样，我们读写的都是Javascript对象，sequelize帮我们把对象变为数据库中的行。
 * 
 * 查询pets表：
 * Pet.fineAll().then(function(pets){
 *  for(let pet in pets){
 *      
 *  }
 * }).catch(function(err){
 * });
 * 
 * 因为sequelize返回的对象是Promise，所以可以使用then()和catch()分别异步响应成功和失败。
 * 但是用then()和catch()仍然比较麻烦，可以使用es7的await来调用任何一个Promise对象。
 * 即：
 * 
 * var pats=await Pet.findAll();
 * 
 * await只用一个限制，就是必须在async函数(异步函数)中调用。上面的代码直接运行还差点，改为以下：
 * (async ()=>{
 *      var pats=await Pet.findAll();
 * })();
 * 
 * 考虑到koa的处理函数都是async函数，所以我们实际上将来在async中直接写await访问数据库就可以。
 * 这也是选择swquelize的原因：只要api返回Promise，就可以使用await调用，代码非常简单。
 * 
 * 格式应为：
* koa2_project_3
 *  - .vscode/
 *      -launch.json //vscode 配置文件
 *  - init.txt //初始化sql命令
 *  - config.js //mysql配置文件
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
 * 
 * 依赖包：
 * sequelize ORM框架
 * mysql 为驱动，我们不可以直接使用，提供给sequelize使用。
 * 
 */
//导入koa2，且导入的为一个class(类)，故用大写Koa表示：
const Koa = require('koa');

// 导入sequelize实例
const Sequelize = require('sequelize');
//导入数据库配置
const config = require("./config");
// 创建sequelize对象实例：
var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: 'mysql', //选择数据库的语言，即连接数据库的方式
        pool: { //连接池设置
            max: 5, //最大连接数
            min: 0, //最小连接数
            idle:30000 //断开连接后，连接实例在连接池保持的时间
        }
    }
);
// 定义模型Pet,告诉sequelize如何映射数据库表，代表数据库的一个表
var Pet = sequelize.define(
    'pets', //模型名称 表示数据库的表pets
    { //指定列名和数据类型
        id: {
            type: Sequelize.STRING(50),
            primaryKey: true
        },
        name: Sequelize.STRING(100),
        gender: Sequelize.BOOLEAN,
        birth: Sequelize.STRING(10),
        createdAt: Sequelize.BIGINT,
        updatedAt: Sequelize.BIGINT,
        version: Sequelize.BIGINT
    },
    {//关闭sequelize自动添加timestamps的功能
        timestamps: false,
        freezeTableName: true //默认为false 表名取复数，true 表名为定义
    }
);

// // 添加数据
// var now = Date.now();
// Pet.create({
//     id: "g_" + now,
//     name: "zhangsan",
//     gender: false,
//     birth: "1993-01-01",
//     createdAt: now,
//     updatedAt: now,
//     version:0
// }).then(function (res) {
//     console.log("create:" + JSON.stringify(res)); 
// }).catch(function (err) {
//     console.log("failed:" + err);
// });

// //添加数据的另一种方式
// (async ()=>{
//         var newData= await Pet.create({
//             id: "d_" + now,
//             name: "lisi",
//             gender: false,
//             birth: "1993-01-01",
//             createdAt: now,
//             updatedAt: now,
//             version:0 
//         });
//         console.log("create1:" + JSON.stringify(newData));
//     }
// )();

// // 查询数据
// (async () => { 
//     var selectData =await Pet.findAll({
//         where: {
//             name: "Odie"
//         }
//     });
//     console.log(`查询数据:find ${selectData.length} pets:`);
//     for (one in selectData) {
//         console.log(JSON.stringify(one));
//     }

// })();

// 查询数据
(async () => { 
    var selectData =await Pet.findAll({
        where: {
            name: "lisi"
        }
    });
    console.log(`查询数据:find ${selectData.length} pets:`);
    for (one of selectData) {
        console.log(JSON.stringify(one));
    }

})();
//更新数据方法1：
// 获取指定数据的函数
// var queryFromSomewhere = async(param) => { //param 查询的条件对象，如{id:1,name:"qq"}
//     var updateSelect =await Pet.findAll({
//         where: param
//     })
//     return updateSelect;
// }
// (async () => {
//     //更新的数据
//     // var updateSelect = await findByName("lisi");
//     var newData = {
//         birth: "1990-09-09"
//     };

//     var updateData = await queryFromSomewhere({ name: "lisi" });
//     for (one of updateData) {
//         one.birth = "1990-09-09"
//         await one.save();
//     }
    
//     console.log("update:" + JSON.stringify(updateData))
// })();

// 更新数据方法2:
(async () => {
    //更新的数据
    var newData = {
        birth: "1999-09-09"
    };
    var updateData = await Pet.update(
        newData,
        {
            where: { name: "lisi" }
        });
    console.log("update:" + JSON.stringify(updateData))
})();

//删除数据
(async () => {
    var delData = await Pet.destroy({ where: { name: "zhangsan" } });
    console.log("del:" + JSON.stringify(delData));

})();

/*
通过sequelize.define()返回的Pet成为Model，表示一个数据类型。

通过Pet.findAll()返回的一个或一组对象称为Model实例，每个实例可以直接通过JSON.stringify序列化为JSON字符串。但是比普通JSON对象多了一些由Sequelize添加的方法，如：create(),update()等方法。调用这些方法我们可以执行更新或删除操作。

使用Sequelize操作数据库的一般步骤为：
1.通过Model对象的findAll()方法获取实例；
2.更新实例，先对实例属性赋新值，在调用save()方法；
3.删除实例，直接调用destroy()方法；

注：
findAll()方法可以接受where，order这写参数，这和将要生成的aql语句对应。

*/



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

//在端口3000监听：
app.listen(3015);

