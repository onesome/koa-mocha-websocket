// 测试koa应用

// 导入测试模块supertest
const request = require("supertest");

// 导入app模块
const app = require("../app");



describe("test koa app", () => {
    // 测试监听端口9900,获得返回的server实例。
    let server = app.listen(9011);
    describe("test server", () => {
        before(function () {
            console.log("before:")
        });
        after(function () {
            console.log("after.");
        });
        beforeEach(function () {
            console.log("beforeEach:");
        });
        afterEach(function () {
            console.log("afterEach.");
        });
        /**构造一个GET请求，发送给koa的应用，然后获得响应
         * 手动检查响应对象，如res.body，还可以利用supertest提供的expect()更方便断言响应的http代码，返回内容和http头，断言http头时可以使用正则表达式，如下：
         * 
         */
        it("#test GET /", async () => {
            let res = await request(server)
                .get("/")
                .expect('content-type', /text\/html/) //成功的匹配到Content-Type为text/html、text/html;charset=utf-8等值。
                .expect(200);
            // console.log(res);
        });
        it("#test GET /app/:param/:name", async () => {
            let res = await request(server)
                .get("/app/:param/:name")
                .expect('content-type', /text\/html/)
                .expect(200);
        })
        /**
         * 所有测试运行结束后，app实例会自动关闭，无需清理。
         */
    })
})

// 利用mocha的异步测试，配合测试模块supertest，可以用简单的代码编写端到端的http自动测试。

