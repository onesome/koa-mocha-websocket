//封装处理url的函数，跳到指定url执行的函数：

var default_fn = async (ctx, next) => {
    ctx.body = "<h1>登录</h1><form action='/singin' method='post'><span>账号</span><input type='text' name='user' /><span>密码</span><input type='password' name='password' /><input type='submit' /></form>"
},
    app_fn= async (ctx, next) => {
    var param = ctx.params.param, //访问url变量
        name = ctx.params.name;
    ctx.body=`<h1>app next is ${param} and ${name}</h1>`
},
    singin_fn = async (ctx, next) => {
    var users =ctx.request.body.user,
        password = ctx.request.body.password;   
    ctx.body = `<h1>post登录成功，欢迎 ${users} 密码： ${password}</h1>`
};

//暴露地址的函数
module.exports = { 
    "GET /": default_fn,
    "GET /login": default_fn,
    "GET /app/:param/:name":app_fn,
    "POST /singin":singin_fn
}