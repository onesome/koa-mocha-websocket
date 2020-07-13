// 待测试文件
/**
 * 异步测试
 * mocha测试一个函数是非常简单的，但是，在JavaScript的中更多的是编写异步代码。所以需要用mocha测试异步函数。
 * 
 */

//  导入mz：将node常用模块promise化
var fs = require("mz/fs");
 
// 编写一个简单的异步函数:读取data.txt的内容表达式
var asyncSum = async () => {
    let expression = await fs.readFile('./data.txt', 'utf-8');
    let fn = new Function('return ' + expression);
    let r = fn();
    console.log(`calculate:${expression}=${r}`);
    return r;
}
module.exports = asyncSum;