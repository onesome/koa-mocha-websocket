const assert = require('assert');

const hello = require('../hello');

/* 测试同步函数：it("test sync function",function(){}); //function 函数无参数
 测试异步函数：it("test sync function",function(done){}); //function 函数需要带一个参数，且通常命名为done。
 测试异步函数需要在函数内部手动调用done()表示测试成功，done(err)表示测试失败。
对于es7的async编写的函数，我们可以写为：
it("async with done",(done)=>{
    (async function(){
        try{
            let r= await hello();
            assert.strictEqual(r,11);
            done();
        }catch(err){
            done(err);
        }
    })();
});

但是上面try...catch太麻烦，以下可以直接把async函数当作同步函数测试。
it("async function",async ()=>{
    let r= await hello();
    assert.strictEqual(r,11);
});
 */

describe("#async hello.js", () => {
    describe("#async hello()", () => {
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
        it('#asyncSum() should return 11', async () => {
            var r = await hello();
            assert.strictEqual(r, 11);
        });
    //     it('asyncSum(3) should return 6', () => {
    //         assert.strictEqual(hello(3), 6);
    //     });
    //     it('asyncSum(4) should return 10', () => {
    //         assert.strictEqual(hello(4), 10);
    //     });
    })
})

/**
 * 运行测试
 * 有三种方法：
 * 1.使用命令 node_modules/mocha/bin/mocha,mocha会自动执行所有测试。若有错误则要么修改hello.js，要么修改测试代码，直到测试全部通过。
 * 
 * 2.在package.json中添加npm命令：
 * "scripts":{
 *  "test":"mocha" 
 * }
 * 使用命令 npm test
 * 
 * 3.在vs Code中创建配置文件 .vscode/launch.json,然后进行编写配置。
 * 
 * before和after
 * 在测试前初始化资源，测试后释放资源是非常常见的。mocha提供了before，after，beforeEach和afterEach来实现这些功能。
 *
 * 输出结果为：
 * before:
    beforeEach:
        calculate:1+2*5=11
        ✓ #asyncSum() should return 11
    afterEach.
 * after.
 */