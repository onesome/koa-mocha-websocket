/*
使用nunjucks模版引擎

nunjucks模版引擎的介绍：
模版引擎：基于模版配合数据构造出字符串输出一个组件。
模版引擎最常见的输出就是输出网页，即html文本。也可以输出任意格式的文本，比如：text，xml，markdown等。

使用nunkjucks的原因：
1.虽然javascript的模版字符串可以实现模版功能，但是实现复杂页面是非常困难的，如新浪首页等。
2.nunjucks是Mozilla开发的纯JavaScript引擎，既可以在node环境下运行，也可以在浏览器端运行。但主要运行在node环境下，因为浏览器环境有更好的模版解决方案，如MVVM框架。

例：如下函数就是一个模版引擎：
function examResult(data){
    return `${data.name}同学成绩单总成绩为${data.total},年纪排名${data.sort}名。`
}
var examData={
    name:"张三",
    total:"320",
    sort:5
};

在输出html需要注意几个特别重要的问题：
1.转义
对特殊字符要转义，避免受到xss攻击。如带有<script></script标签的内容，模版引擎输出html内容时会自动执行javascript代码。
2.格式化
对不同变量要格式化，如货币12,500.00的格式，日期需要变为2020-01-01的格式。
3.简单逻辑
模版需要执行的简单逻辑，如：需要if条件输出内容（nunjucks使用的语法）:
{{name}}同学,成绩
{%if score >= 90 %}
优秀
{% elif score >= 60 %}
良好
{% else %}
不及格
{% endif %}

nunjucks模版引擎的使用：
虽然模版引擎内部可能非常复杂，但是使用一个模版引擎是非常简单的，因为其本质是构造了如下的一个函数：
function render(view,model){
    //相关操作
}
其中，view表示模版的名称（视图），因为可能存在多个模版，选择其中一个。model就是数据。在JavaScript中就是简单对象，render函数返回一个字符串（模版输出）。

使用nunjucks文件格式应为：
* koa2_project_3
 *  - .vscode/
 *      -launch.json //vscode 配置文件
 *  - app.js //使用koa的js
 *  - controllers //处理url文件
 *      -login.js //处理登录相关的url
 *      -user.js //处理用户管理相关url
 *  - views //包含模版的文件（即模版文件都存放在该文件夹）
 *      -hello.html //html模版文件
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
//导入middleware
const controller = require("./controller");
//导入模版引擎nunjucks
const nunjucks = require("nunjucks");

//创建一个Koa对象表示web app本身
const app = new Koa();

/*
创建使用nunjucks模版引擎环境的函数:
createEnv函数：封装相关nunjucks配置的函数，即nunjucks.configure([path],[opts])
path:存放模版的目录
opts：需要配置值封装的对象(autoescape,noCache,watch,throwOnUndefined,trimBlocks,lstripBlocks,web,express,tags)

*/
function createEnv(path, opts) {
    var autoescape = opts.autoescape === undefined ? true : opts.autoescape; //输出内容是否需要转义（"<"转为"&lt;"）
    noCache = opts.noCache || false,//是否不使用缓存，false缓存(默认)；
    watch = opts.watch || false,//当模块变化时是否重新加载，false不加载(默认)；
    throwOnUndefined = opts.throwOnUndefined || false;//输出为undefined或null是否抛出异常，false不抛出(默认)；
    
    /*创建环境变量

    new nunjucks.Environment([loaders],[opts])-管理模版：可以用来加载模版，模版之间可以继承和包含; 
    loaders:加载器(地址(一个或多个))，默认从当前目录或地址加载
    opts：需要配置值封装的对象(autoescape，throwOnUndefined，trimBlocks，lstripBlocks)

    new nunjucks.FileSystemLoader([searchPaths],[opts])-node端从文件系统中加载模版：创建一个文件加载器，从指定路径读取模版。
    searchPaths:查找模版的路径，可以一个也可以多个
    opts:需要配置值封装的对象(noCache,watch)

    */
    var loadersConfig = new nunjucks.FileSystemLoader(path, {
        noCache: noCache,
        watch: watch
    }),
        optsConfig = {
            autoescape: autoescape,
            throwOnUndefined:throwOnUndefined
        };
    var env = new nunjucks.Environment(loadersConfig,optsConfig)
    
    /*判断是否有需要添加自定义的过滤器，有则添加自定义的过滤器 */
    if (opts.filters) {//有自定义的过滤器
        for (f in opts.filters) {
            env.addFilter(f, opts.filters[f]); //添加遍历的过滤器
        }
    }

    return env; //返回定义好的环境变量(初始化状态)
}

//创建使用nunjucks模版引擎环境,表示nunjucks模版引擎对象
var env = createEnv("views", {
    watch: true, //模块数据变化更新
    throwOnUndefined: true,//输出为undefined或null时抛出错误，这里设置为true是为了开发使用，正式环境为默认值
    filters: {
        hex: function (n) { //转化为十六进制
            return "0x" + n.toString(16)
        }
    }
});

/*渲染模版
nunjucks强大的功能：
1.特殊字符转义，避免了输出恶意脚本。
2.可以编写条件、循环等功能。
3.最强大的功能是模版继承，大多数网站头部底部是一致的，只有中间内容变动，若头部底部变动需要修改全部模版，使用模版继承避免该问题。

*/
var page = env.render('hello.html', {name:"test",age:"12<script></script>"});
console.log(page);
var fruit = env.render('base.html',{fruit:["apple", 'banana', 'orange']})
console.log(fruit);
var index=env.render('index.html',{body:"我是首页的内容"})
console.log(index);//index.html继承public.html,其中底部未重新定义所以继承public.html的数据。

/**
 * nunjucks模版引擎的性能：
 * 1.渲染本身速度非常快，因为是字符串拼接，纯CPU操作。
 * 2.性能问题主要出现在从文件读取模版内容这一步，这是一个IO(输入/输出)操作。在node环境中，单线程的JavaScript最不能忍受同步IO，但nunjucks使用同步读取模版文件，但nunjucks会缓存已读取的文件内容，即每个文件最多读取一次，就会放入内存中。后面请求就不会再去读取模版文件，前提是有参数noCache:false。（开发环境中可以设置为true，但生产环境一定要为false,否则存在性能问题。）
 * 
 * 注：
 * 虽然nunjucks有提供异步读取方式，为了保持代码的简单且可维护性，故不使用。
 */


//添加post解析,在页面内获取到post传递的数据
// app.use(bodyparser());
//使用middleware controller的post方法
// app.use(controller());
/**
 * 注：app.use(执行的函数);
 */

//在端口3000监听：
app.listen(3004);

