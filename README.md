# 基于ERC-721的NFT应用, 实现Web端提交并铸币功能

---

## 项目概括

本项目基于ERC-721标准与IERC-721的标准底层实现, 前端采用React框架, 区块链合约使用Solidity编写. 实现了一个带有铸币功能, 并存储币到区块链上的Web App.
其中的代币为HEX编码颜色的字符串.

## 实现原理

Web端会将用户输入的HEX颜色提交到区块链上, 并且更新前端页面的状态, 拉取最新的所有颜色, 最后渲染所有区块链数据中HEX对应的颜色图片.

## 运行项目

### 安装Web端依赖

```
$ npm install
```

### 开启区块链网络

```
运行ganache, 点击quickstart开启网络
将RPC SERVER中的端口号替换到truffle-config.js内的port
```

### 编译部署合约

```
$ truffle compile
$ truffle migrate
```

> 重新部署: `truffle migrate --reset`

### 运行Web端

```
$ react-scripts start
```

> Web端会默认运行在`http://localhost:3000/`

### 连接Web端的账户

```
点击ganache中任意账户右侧的🔑
复制私钥, 导入到MetaMask中
```

### 铸币

```
在页面的输入框中输入如#123456类似的Hex颜色
点击提交
```