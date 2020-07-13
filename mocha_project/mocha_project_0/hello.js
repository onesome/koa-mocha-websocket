//需要进行测试的函数定义,简单累计求和的函数
var sum = (reset) => {
    var total = 0;
    for (let n = 0; n <= reset;n++) {
        total += n;
    }
    return total;
}

module.exports = sum;