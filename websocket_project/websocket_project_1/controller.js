//处理url文件的middleware

/* 导入fs模块，然后用readdirSync列出文件(同步)
* 这里可以用sync是因为启动时只运行一次，不存在性能问题:
*/
const fs = require('fs');
//导入koa-router,且require("koa-router")返回的是函数：
const router = require("koa-router")();

//获取文件夹controllers下所有文件
const files = fs.readdirSync(__dirname + '/controllers');//__dirname 绝对路径, file表示文件夹controllers下所以文件的数组

//筛选以.js结尾的文件
var js_file = files.filter((f) => {
    return f.endsWith('.js');//返回以.js结尾的文件。（true的数组）
});

//处理url：对应地址执行对应方法
for (f of js_file){ //es6语法，用来替代for in 和forEach(),for of可以遍历数组，字符串，Map,Set等可迭代数据结构。
    //导入文件f,文件对象
    var now_file = require(__dirname + '/controllers/' + f);
    console.log('文件对象：' + now_file);
    for (url in now_file) {
        if (url.startsWith("GET")) {//url是否以GET开头
            //如果 url类似 "GET xxx"
            var path = url.substring(4);
            // console.log(path);
            router.get(path, now_file[url]);
        } else if (url.startsWith("POST")) {
            //如果 url类似 "POST xxx"
            var path = url.substring(5);
            // console.log(url, now_file[url]);
            router.post(path, now_file[url]);
        } else {
            console.log("无效地址");
        }
    }
}

//导出该方法
module.exports=function(){
    return router.routes();
}





