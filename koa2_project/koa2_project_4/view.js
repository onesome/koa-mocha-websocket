//处理模版的middleware， 引用nunjucks模版引擎

//导入模版引擎nunjucks
const nunjucks = require("nunjucks");

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

/*导出函数
path = "views";
opts={
    watch: true, //模块数据变化更新
    throwOnUndefined: true,//输出为undefined或null时抛出错误，这里设置为true是为了开发使用，正式环境为默认值
    filters: {
        hex: function (n) { //转化为十六进制
            return "0x" + n.toString(16)
        }
    }
}
*/
function viewFile(path,opts) {
    //创建使用nunjucks模版引擎环境,表示nunjucks模版引擎对象
    var env = createEnv(path,opts);
    return async (ctx, next) => {
        //给ctx绑定render函数
        ctx.render = function (view, model) {
            //将render的值赋给body,Object.assign为了对象合并，ctx.state配置全局变量（如添加全局变量path name：ctx.state.pathname="mingzi"）
            //（Object.assign({}, ctx.state || {},model || {})表示传递的数据为全局变量以及需要传递的参数对象的集合。
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {},model || {}));
            //设置Content-Tyle
            ctx.response.type = "text/html";
        }
        //继续处理请求
        await next();
    }
}

module.exports = viewFile;