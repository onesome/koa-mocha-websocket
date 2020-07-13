//mysql配置根据当前环境进行选择对应文件

// 设置文件目录
const defaultConfig = './config-default';
const overrideConfig = './config-override';
const testConfig = './config-test';

//导入fs模块
const fs = require('fs');

//判断所在环境
var config = null;
if (process.env.NODE_ENV == "test") { //环境为测试环境
    config = require(testConfig); 
} else {
    config = require(defaultConfig);  //默认为默认环境
    try {
        if (fs.statSync(overrideConfig).isFile()) { //指定的文件是否存在
            console.log("存在override.js文件");
            config = require(overrideConfig);

        }
    } catch (err) {
        console.log("不存在override.js文件");
    }
}
/**
 * 具体规则是：
 * 1.默认读取为默认环境的配置文件config-default.js
 * 2.判断是否为是测试环境，是测试环境读取测试环境的配置文件config-test.js
 * 3.若不是测试环境，读取实际环境的配置文件config-override.js,若文件不存在，则为默认的配置文件
 * 
 * 以上这样做的好处是：
 * 开发环境下，团队使用统一的默认配置，并且无需config-override.js。部署到服务器时，由运维团队配置好config-override.js,以覆盖默认的配置。测试环境下，本地和CI服务器统一使用config-test.js，测试数据库可以反复清空，不会影响开发。
 * 
 * 注：
 * 配置文件表面上写起来容易，但是，既要保证开发效率，又要避免服务器配置文件泄漏，还要能方便的执行测试，就需要一开始搭建出好的结构，才能提升工程能力。
 */
console.log(JSON.stringify(config));
module.exports = config;