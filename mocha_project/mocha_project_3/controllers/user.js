var getUser = async (ctx,next) => {
    ctx.render("index.html", { title: "bootstrap" });
}

module.exports = {
    "GET /":getUser
}