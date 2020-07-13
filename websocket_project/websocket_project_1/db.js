// 统一Model的定义

// 导入Sequelize实例
const Sequelize = require("sequelize");
//导入数据库配置
const config = require("./config");
const uuid = require("uuid");

// 生成id,v1使用时间戳生成,v4随机生成有一定的重复率
function generateId() {
    return uuid.v1();
}
var sequelize = new Sequelize(
    config.database, //数据库名称
    config.username, //连接数据库账号
    config.password, //连接数据库密码
    {
        host: config.host,
        dialect: 'mysql', //选择数据库的语言，即连接数据库的方式
        pool: { //连接池设置
            max: 5, //最大连接数
            min: 0, //最小连接数
            idle: 30000 //断开连接后，连接实例在连接池保持的时间
        }
    });

const ID_TYPE = Sequelize.STRING(50);

/*定义的Model强制实现的规则
sequelize在创建，修改Entity时会调用指定的函数，这些函数通过hook在定义Model时设定。我们在beforeValidate事件中根据是否是isNewRecord设置主键（如果主键为null或undefined），设置时间戳和版本号。

这样可以大大简化Model定义。
*/
function defineModel(name, attributes) { //name 表名，attributes 列名和数据类型的对象
    var attrs = {}; // 统一规则整理后的列名及数据类型
    for (let key in attributes) {
        let value = attributes[key]; //对应列名的数据类型
        if (typeof value === 'object' && value['type']) { //是否有自定义的属性
            value.allowNull = value.allowNull || false; //是否为null
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull:false
            }
        }
        // 统一添加的字段
        attrs.id = {
            type: ID_TYPE,
            primaryKey: true
        };
        attrs.createdAt = { //添加时间(时间戳)
            type: Sequelize.BIGINT,
            allowNull: false
        };
        attrs.updatedAt = { //修改时间(时间戳)
            type: Sequelize.BIGINT,
            allowNull: false
        };
        attrs.version = {//修改次数(默认为0)
            type: Sequelize.BIGINT,
            allowNull: false
        };
    }
    // 返回统一规则后的Model
    return sequelize.define(
        name, //
        attrs,
        {
        tableName: name,//表名
        timestamps: false,
        hooks: {//定义钩子 在模型生命周期的特殊时刻被调用。
            beforeValidate: function (obj) { //模型在数据验证前调用的钩子函数
                let now = Date.now();
                console.log("主键："+obj.isNewRecord)
                if (obj.isNewRecord) { //是否设置主键，为真为新添加数据
                    if (!obj.id) { //是否传递的id
                        // 未传递id执行
                        obj.id = generateId();
                        console.log(obj.id);
                    }
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    obj.version = 0;
                } else {
                    obj.updatedAt =Date.now();
                    obj.version++;
                }
            }
        }
    })
}

//字段类型
var types = ["STRING", "BOOLEAN", "BIGINT", "INTEGER", "TEXT", "DOUBLE", "DATEONLY"];
var dbObj = {};
dbObj = {
    ID: ID_TYPE,
    generateId:generateId,
    defineModel: defineModel,
    sync: () => {
        if (process.env.NODE_ENV != "production") {//如果不是生产环境，删除表并重建表
            sequelize.sync({ force: true });
        } else { //抛出错误
            throw new Error("环境为生产环境，不可以删除表并新建表");
        }
    }
};
//将Sequelize的属性赋值为dbObj对象
for (let t of types) {
    dbObj[t] = Sequelize[t];
}
//导出对象dbObj
module.exports = dbObj;