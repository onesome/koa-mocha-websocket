/** 使用Model：处理models文件夹内的文件
使用model就需要引入对应的model文件，如models文件夹下的user.js,但一旦model文件多起来，如何引用就比较麻烦，因此，自动化比手工做效率高，而且可靠。该文件则用来自动扫描并导入models文件夹下的所有model文件。
 */

// 导入fs模块
const fs = require("fs");
// 导入db.js
const db = require("./db");

let files = fs.readdirSync(__dirname + "/models");

//获取该models文件夹下所有js文件
let js_files = files.filter((f) => {
    return f.endsWith('.js');
});

let modelsObj = {
    sync: () => {//环境判断是否为生产环境，不是生产环境进行删除表并重建表
        db.sync();
    }
};

for (let f of js_files) {
    let name = f.substring(0, f.length - 3);
    modelsObj[name] = require(__dirname + '/models/' + f);
}

module.exports = modelsObj;





