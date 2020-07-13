// 处理静态文件的middleware

//导入path模块，处理文件路径的小工具
const path = require("path");
//mime包：设置某种扩展名的文件的响应程序类型，即当指定扩展名文件被访问时，浏览器自动使用指定应用程序来打开。通过名为Content-Type的HTTP头来设置或响应对应的文件类型。
const mime = require("mime");
//mz:将node常用模块promise化(可以使用async...await)。
/* promise:进行异步计算，异步操作队列，按照我们预期的顺序执行并返回预期的结果（在对象之间传递并操作promise，帮助处理队列）。即：先处理逻辑不关心如何处理结果。
mz使用 需要promise化的模块引用方式:require("mz/需要promise化的模块名")（如：使fs模块序列化 fs=require("mz/fs")）

promise好处：
1.之前异步依靠回调函数并剥夺了函数return的能力，容易掉入回调函数的坑，难以读懂，嵌套太多，代码难维护。
2.而promise对象与函数的区别就是可以保持状态，函数不能保存，且无需层层嵌套，进行回调。
3.代码风格容易理解，容易维护，将执行逻辑与处理结果分离开
4.多个异步任务串行执行（new Promise().then().then()...then()），也可以并行执行（Promise.all(new Promise(),new Promise()).then()返回所有结果，Promise.race(new Promise(),new Promise()).then()返回第一个获得的结果）

有三个状态：
初始状态，操作成功，操作失败
初始状态->操作成功
初始状态->操作失败
*/
const fs = require("mz/fs"); //使fs模块promise化

/*处理静态文件函数
url: 获取静态文件地址 类似/statics/
dir: 当前文件目录 类似_dirname+/statics/ _dirname当前文件的文件夹目录
*/
function staticFile(url, dir) {
   
    return async (ctx, next) => {
        // console.log(Request)
        var request_path = ctx.request.path; //获取请求的路径
        //.log("获取请求的路径:"+request_path);
        //判断requset_path是否以url开头
        if (request_path.startsWith(url)) {
            //获取完整文件夹目录
            var allPath = path.join(dir, request_path.substring(url.length));
            //console.log("获取完整文件夹目录:" + allPath);
            //判断所请求的文件是否存在
            if (await fs.open(allPath)) {//文件存在
                //查找文件的mime,设置响应的方式
                ctx.response.type = mime.getType(request_path);
                //获取文件内容，并赋值给响应的文件
                ctx.response.body = await fs.readFile(allPath);
            } else {
                ctx.response.status = 404;
            }
           // console.log("fs.promise:" + await fs.open(allPath))
            
            // fs.open(allPath, "r", (err,fd) => {
            //     if (err) {
            //         if (err.code === 'ENOENT') { //文件不存在
            //             ctx.response.status = 404;
            //         }
            //         console.log(err);
            //     } else { //文件存在
            //         //查找文件的mime,设置响应的方式
            //         ctx.response.type = mime.loolup(requset_path);
            //         //获取文件内容，并赋值给响应的文件
            //         ctx.response.body = fs.readFile(allPath);
            //     }
            // })

        } else {
            //不是指定前缀url,继续执行下一个middleware（即：app.use(异步函数)）    
            await next();
        }
    }
    
}

module.exports = staticFile;