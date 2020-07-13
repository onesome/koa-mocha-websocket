/**
 * 用mocha测试一个async函数是非常方便。
 * 当有一个koa的web应用程序时，用mocha来自动化测试web应用程序：
 * 一个简单的想法就是在测试前启动koa的app，然后运行async测试，在测试代码中发送http请求，收到响应后检查结果，这样，一个基于http接口的测试就可以自动运行。
 * 
 * 工程结构为：
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
 *  - start.js //app启动入口
 *  - test/  //存放所有test
 *      -app-test.js //异步测试
 *  
 * 其中，该koa应用和前面的koa应用不同的是，该文件的app.js只负责创建实例，并不监听端口，而start.js负责真正启动应用。  
 */

/**
 * 启动应用：
 *  */
//导入app
const app = require("./app");

//监听端口3000
app.listen(3006);
console.log('app started at port 3000...');

/**
 * 该文件的目的是便于后面的测试，其中test目录下的app-test.js用来测试这个koa应用。并且除了使用mocha框架之外，还需要一个简单强大的测试模块supertest。
 * 
 * 安装supertest模块命令：npm install supertest --save-dev
 * 
 *之后编写测试app-test.js
 */