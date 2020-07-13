// 导入定义的规则
const db = require("../db");

var PetModel = db.defineModel("user", {
    name: db.STRING(50), //姓名
    password: db.STRING(100), //密码
    gender:db.BOOLEAN //性别
});

module.exports = PetModel;