//封装处理url的函数，跳到指定url执行的函数：

var default_fn = async (ctx, next) => {
    // console.log(ctx.render);
    // ctx.body=`<h1>app next is ${"param"} and ${"name"}</h1>`
    ctx.render("login.html",{title:"login"});
    
},
    app_fn= async (ctx, next) => {
    var param = ctx.params.param, //访问url变量
        name = ctx.params.name;
    ctx.body=`<h1>app next is ${param} and ${name}</h1>`
},
    singin_fn = async (ctx, next) => {
        console.log("path:" + ctx.request.path);
    var users =ctx.request.body.user,
        password = ctx.request.body.password;
        console.log(users);
        var user = {
            name: users,
            id: password
        };
        // Buffer对象进行base64的编码
        let userValue=Buffer.from(JSON.stringify(user)).toString('base64')
        ctx.cookies.set('user', userValue);
        // ctx.cookies.set('id', password);
        ctx.render("hello.html", {title:"hello",users:users,password:password})
};

//暴露地址的函数
module.exports = { 
    // "GET /": default_fn,
    "GET /login": default_fn,
    "GET /app/:param/:name":app_fn,
    "POST /singin":singin_fn
}