//封装处理url的函数，跳到指定url执行的函数：

var default_fn = async (ctx, next) => {
    // console.log(ctx.render);
    // ctx.body=`<h1>app next is ${"param"} and ${"name"}</h1>`
    ctx.render("login.html", { title: "login" });
    
},
    app_fn = async (ctx, next) => {
        var param = ctx.params.param, //访问url变量
            name = ctx.params.name;
        console.log("app_fn:",param,name)
        ctx.render("hello.html", {title: "app",users:param,password:name})
},
    singin_fn = async (ctx, next) => {
        console.log("path:" + ctx.request.path);
    var users =ctx.request.body.user,
        password = ctx.request.body.password;
        ctx.render("hello.html", {title: "singin",users:users,password:password})
};

//暴露地址的函数
module.exports = { 
    // "GET /": default_fn,
    "GET /login": default_fn,
    "GET /app/:param/:name":app_fn,
    "POST /singin":singin_fn
}