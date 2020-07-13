/**
 直接使用sequelize虽然可以，但是存在一些问题：
 团队开发，有人喜欢自己加timestamp；
 有人喜欢自增主键，并且自定义表名；
 大型web app通常都有几十个映射表，一个映射表就是一个Model。如果都按照各自喜好，那业务代码就不好写，model不统一，很多代码也无法复用。
 
 所以我们需要一个统一的模型，强迫所有Model都遵守同一个规范，这样不但实现简单，而且容易统一风格。

 Model
 1.Model存放的文件夹必须在models内，并且以Model名字命名，如：Pet.js,User.js等。
 2.每个Model必须遵守一套规范：
 1).统一主键，名称必须是id，类型必须是STRING(50)；
 2).主键可以自己指定，也可以由框架自动生成(如果为null或undefined)；
 3).所有字段默认为NOT NULL，除非显示指定；
 4).统一timestamp机制，每个Model必须有createdAt，updatedAt和version，分别记录创建时间，修改时间和版本号。其中createdAt和updatedAt以BIGINT存储时间戳，最大的好处是无需处理时区，排序方便。version每次修改时自增。

 所以，我们不要直接使用Sequelize的API，而是通过db.js间接的定义Model,如User.js定义如下：
    const db=require('../db);
    module.exports=db.defineModel('users',{
        email:{type:db.STRING(100),unique:true},
        passwd:db.STRING(100),
        name:STRING(100),
        gender:db.BOOLEAN
    });

这样，User就具有email,passwd,name和gender这四个业务字段。id,createdAt,updatedAt和version这几个字段应该自动添加上，而不是每个Model都要重复定义。

因此，db.js的作用就是统一Model的定义。
 
 
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
 * 依赖包：
 * sequelize ORM框架
 * mysql2 为驱动，我们不可以直接使用，提供给sequelize使用。
 * 
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

//获取对应表
let User = model.User,
    Pet = model.Pet;


(async () => {
    //向数据库对应表中插入一条数据
    var user = await User.create({
        email:"123@email.com",
        name: "zhangsan1",
        password:"111111",
        gender: false
    })

})();

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
app.listen(3006);

