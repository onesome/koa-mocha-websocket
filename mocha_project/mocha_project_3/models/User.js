// 导入定义的规则
const db = require("../db");

var UserModel = db.defineModel("user", {
    email: { //邮箱并作为唯一标识
        type: db.STRING(100),
        unique: true
    },
    name: db.STRING(50), //姓名
    password: db.STRING(100), //密码
    gender:db.BOOLEAN //性别
});

module.exports = UserModel;
