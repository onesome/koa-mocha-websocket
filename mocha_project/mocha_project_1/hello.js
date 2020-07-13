// 待测试文件
/**
 * 安装mocha测试框架，因为只需要在开发环境下需要，故使用的命令为：npm install mocha --save-dev 表示依赖在开发环境下。
 *
 * 工程结构：
 *  - package.json //项目描述文件
 *  - node_modules //安装的依赖包
 *  - hello.js //待测试的文件
 *  - test //存放要测试的文件目录,不要随便改这个目录的名字，mocha默认执行test目录下的所有测试。
 *      - hello-test.js //测试的文件
 * 
 */

 //需要进行测试的函数定义,简单累计求和的函数
var sum = (reset) => {
    var total = 0;
    for (let n = 0; n <= reset;n++) {
        total += n;
    }
    return total;
}

module.exports = sum;