# 单元测试框架-mocha

## 单元测试简单介绍
单元测试以测试为驱动的开发模式(TDD)。

单元测试是用来对一个模块，一个函数或者一个类进行正确性检验的测试工作。

### 单元测试通过后的意义：
如果对测试的模块或者函数或者类进行修改后，只需要在跑一次单元测试，若通过说明修改不会对原有的行为造成影响，如果测试不通过说明我们的修改与原有的行为不一致，要么修改代码，要么修改测试。

这种以测试驱动的开发模式最大的好处就是确保一个程序模块的行为符合我们设计的测试用例。在将来修改的时候，可以极大程度的保证该模块行为仍正确的。

## mocha简单介绍
mocha是JavaScript一种单元测试框架，既可以运行在浏览器环境下又可以运行在node.js环境下。

### 使用mocha的好处：
使用mocha框架我们只需要专注于编写单元测试本身，然后，让mocha自动运行所有的测试并给出测试结果。

### mocha的特点：
1.既可以测试简单的JavaScript函数又可以测试异步代码，因为异步是JavaScript的一大特性。

2.可以自动运行所有测试，也可以只运行特定的测试。

3.可以支持before,after,beforeEach(跳转之前)和afterEach(跳转之后)来编写初始化代码。


## mocha使用
### mocha_project_0 mocha框架的简单使用


