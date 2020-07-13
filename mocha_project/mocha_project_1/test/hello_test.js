const assert = require('assert');

const hello = require('../hello');

describe("#hello.js", () => {
    describe("#hello()", () => {
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
        it('sum() should return 0', () => {
            assert.strictEqual(hello(), 0);
        });
        it('sum(3) should return 6', () => {
            assert.strictEqual(hello(3), 6);
        });
        it('sum(4) should return 10', () => {
            assert.strictEqual(hello(4), 10);
        });
    })
})

/**
 * 编写测试
 * 这里mocha默认的是BDD-style(行为驱动开发)的测试。describe可以任意嵌套，以便把相关测试看成一组测试。
 * 
 * 每个it("name",function(){})表示一个测试。
 * 
 * 编写测试的原则：一次只测一种情况，且测试代码要非常简单。我们编写多个测试来分别测试不同的输入，并使用asset判断输出是否是我们所期望的。
 * 
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
        ✓ sum() should return 0
    afterEach.
    beforeEach:
        ✓ sum(3) should return 6
    afterEach.
    beforeEach:
        ✓ sum(4) should return 10
    afterEach.
 * after.
 */