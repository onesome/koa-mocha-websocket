// 进行测试的文件

// 测试hello.js的累计求和函数

/*使用node.js提供的assert模块进行断言

assert模块它断言一个表达式为true。如果断言失败，就抛出Error。即判定程序是否正常运行，若正常运行(true)则正常运行，若不能正常运行(false)则抛出错误并终止运行。

assert模块的方法：
assert.strictEqual(); //相当于“===”，a,b两参数相等.对数字，字符串进行比较。
//弃用assert.equal();
assert.deepStrictEqual(a,b); //相当于“===”，a,b两参数深度相等。对对象，数组，json等深层的数据比较。
// 弃用 assert.deepEqual()
*/

// 导入assert模块
const assert = require('assert');
// 导入需要测试的模块
const hello = require('./hello');

assert.strictEqual(hello(),0);
assert.strictEqual(hello(3), 6);
assert.strictEqual(hello(4), 10);

// 使用命令 node test.js 进行手动执行。

/**
 * 单独写test.js的缺点是没法自动运行测试，而且，如果第一个assert报错，则停止程序运行，后面的测试也无法执行。
 * 
 * 如果有很多测试需要运行，就必须把这些测试全部组织起来，然后统一执行，并且得到执行的结果。因此需要用mocha来编写测试。
 * 
 * 建立mocha框架的工程--mocha_project_1，具体工程结构见mocha_project_1
 * 
 * 
 */
