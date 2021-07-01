---
sidebar_label: 'ERC标准以及NFT应用开发'
sidebar_position: 1
---
# ERC标准以及基于ERC-721的NFT应用开发

## 一. ERC标准

### 1. 什么是ERC?

---

ERC是指以太坊已正式化的提案, ERC-721其实就代表721号提案. 通过各种流程的审议与测试后, 一个非正式的EIP就可以转变成ERC, 成为标准化的协议.

从开发者的角度来说, ERC就是需要实现的一些接口. 这些接口的底层实现可以参考[OpenZeppelin](https://openzeppelin.com)

在 [EIP-1](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1.md) 中具体阐明了EIP的作用与生命周期. 具体审议流程如下:
![EIP的流程](https://github.com/ethereum/EIPs/blob/master/assets/eip-1/EIP-process.png?raw=true)

标准化提案的作用就是给开发者一些模版帮助开发, 同时也给开发者一些标准的限制.

- 开发者不用从底层开始完整进行设计与实现, 而只需根据一些标准快速开发DApp. 如今借助这些标准, 甚至[有些网站](http://thetokenfactory.com)做到只需要填4个数值就可以实现发币的功能.

- 开发者可以遵循这些标准, 这样能做到整个生态的互通以及其他软件适配上的便利. 比如: MyEtherWallet不用频繁更新就可以支持多个币种.

### 2. 有哪些ERC?

---

以下是部分会被频繁使用到的ERC标准.

名称   | 内容
------  | ------------------------------------------------
ERC-20  | 可替换资产的原始代币合约, 例如: [EOS](https://etherscan.io/address/0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0), [OMG](https://etherscan.io/address/0xd26114cd6EE289AccF82350c8d8487fedB8A0C07).
ERC-223 | 兼容ERC-20,保护投资者以防意外的合约转账
ERC-721*| 非同质代币（NFTs）标准，可作为产权进行交易
ERC-777 | 基于操作者的代币标准，具有高度可定制性
ERC-918 | 可开采性代币，允许加入挖矿算法
ERC-998 | 可拆解非同质化代币，可包含多个ERC-721和ERC-20形式
ERC-1155| 多代币标准，可追踪多个代币余额和所有权的合约，及定义多个物品
ERC-1400| 证券通证标准，部分可互换代币，该EIP标准具有能力进行强制转移

> Fun fact: 在查询 [以太坊EIP官方文档](https://github.com/ethereum/EIPs/tree/master/EIPS) 时, 可以发现GitHub仓库内的文件是按照 [字符串顺序排序](https://stackoverflow.com/questions/17665267/how-do-you-control-the-order-in-which-files-appear-in-a-github-gist) 的, 因此EIP-2排在EIP-1996之后, 检索时需要注意.

#### [ERC-20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md):

同质化代币的基础标准, 在2015年被[Vitalik提出](https://github.com/ethereum/wiki/wiki/Standardized_Contract_APIs/499c882f3ec123537fc2fccd57eaa29e6032fe4a), 旨在标准化一些常见去中心化应用. 其中他探讨了函数的变量命名规则, 以及同质化代币的一些必要方法和事件.

以下是ERC-20的具体内容:
```
contract ERC20Interface {
    function name() public view returns (string)
    function symbol() public view returns (string)
    function decimals() public view returns (uint8)
 	
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
    
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}
```

- _name_, _symbol_, _decimals_ 这三个方法非必需, 作用是提高可用性, 与实际功能无关.
    1. _name()_: 返回代币的名称, 比如: Ethereum.
    2. _symbol()_: 返回代币的代号, 比如: BTC.
    3. _decimals()_: 返回整数, 表示1个代币能被几位小数表示.

- ERC-20中的必要方法.
    1. _totalSupply()_ : 返回代币的总量.
    2. _balanceOf()_: 输入账户地址, 返回地址内的代币余额.
    3. _transfer()_, _transferFrom()_: 必须触发`Transfer`事件(包括数额为0). 从总量中转账给账户地址/从一个账户转账给另一个账户.
    4. _allowance()_: 在进行转账时, 查询剩余可转账额度.
    5. _approve()_: 设置消费者代币转移额度限制, 成功后触发`Approve`事件. 当重写限制时, 必须先重写为0, 再设置真实参数, 以避免类似[攻击](https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729).

通过[OpenZeppelin的IERC-20实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol), 我们可以了解通过应用ERC-20所完成的业务逻辑, 具体内容参考[此文章](https://cloud.tencent.com/developer/article/1805419):
- _transfer()_ 转账逻辑:
    1. 验证付款方与收款方地址是否合法
    2. 查询付款方余额
    3. 验证付款方余额对于转账金额是否充足
    4. 在付款方地址中减去转账金额
    5. 在收款方地址中加上转账金额
    6. 触发Transfer事件
    7. 正式完成交易

- _transferFrom()_ 授权转账逻辑:
    1. 调用 _transfer()_ 进行转账
    2. 查询操作者在此账户内可转账额度
    3. 验证剩余额度是否足够本次交易, 不足则回滚交易
    4. 正式完成交易

- _mint()_, _burn()_ 代币增发销毁逻辑:
    1. 验证地址是否合法
    2. 增加/减少总量和地址内余额(销毁时会验证账户内余额是否大于销毁数额)
    3. 触发Transfer事件


### 3. [ERC-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) 概述

---

非同质代表独一无二，[CryptoKitties](https://www.cryptokitties.co)为例, 每只猫都拥有独一无二的基因. 一只猫就是一个NFT. 猫和猫之间是不能置换的. 这种独特性使得某些稀有猫具有收藏价值, 也因此受到追捧.

以下是ERC-721的具体内容, 我们先简要介绍一下, 之后会在实际开发过程当中深入探讨:

```
pragma solidity ^0.4.20;
        interface ERC721 /* is ERC165 */ {
            event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
            event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
            event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

            function balanceOf(address _owner) external view returns (uint256);
            function ownerOf(uint256 _tokenId) external view returns (address);
            function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
            function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
            function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
            function approve(address _approved, uint256 _tokenId) external payable;
            function setApprovalForAll(address _operator, bool _approved) external;
            function getApproved(uint256 _tokenId) external view returns (address);
            function isApprovedForAll(address _owner, address _operator) external view returns (bool);
        }

        interface ERC165 {
            function supportsInterface(bytes4 interfaceID) external view returns (bool);
        }

        interface ERC721TokenReceiver {
            function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes _data) external returns(bytes4);
         }
```

通过[OpenZeppelin的IERC-721实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol), 我们可以了解ERC-721的接口底层设计, 具体内容可以参考[此文章](https://cloud.tencent.com/developer/article/1805420):

- 与IERC-20类似的设计这里就不再赘述.

- 查询与查找函数：
    1. *ownerOf()*: 输入tokenId, 返回物品现主人的地址
    2. *tokenURI()*: 输入tokenId, 检索对应的token, 返回memory中的定位符
       > Storage可以理解为永久存储, 比如状态变量; Memory类似内存, 会被回收, 越过作用域不可被访问.

- _transferFrom()_ 转账逻辑:
    1. 验证转账是否被允许(参数:from, to, tokenId)
        1. 验证tokenId是否存在
        2. 如果操作者是token现主人 and 此操作者允许管理此代币 and 操作者允许管理此主人所有代币
    2. 调用 *_transfer()* 函数
        1. 验证from是否是token现主人
       > 可能 [有疑问](https://ethereum.stackexchange.com/questions/89761/erc721-token-transfers-and-approvals/102772#102772) 为什么刚刚验证了是否是主人/允许操作者, 却还要验证是否是主人. 是因为操作者和from不一定为同一人, 因此验证是必要的.
       >
       > _isApprovedOrOwner(**_msgSender()**, tokenId)
       >
       > _transfer(**from**, to, tokenId)
        2. 验证接收地址B是否为空
        3. 清空from的授权转账权限
        4. 更新from和to的资产种类
        5. 将token归属权交给to
       > *safeTransferFrom()* 在这步额外检查to账户地址是否符合ERC-721规范, 否则回滚交易.
        6. 触发Transfer事件

- _mint()_, _burn()_ 代币增发销毁逻辑中额外增加了将mapping中的tokenId创建与消除.


伴随NFT市场的火热, 社区在ERC-721的基础上增加了ERC-1155, ERC-8899等协议. 它们同样服务于非同质化代币, ERC-1155引入一个中央智能合约包的概念, 可以做到将不同代币打包交易. ERC-8899可以做到将NFT与FT打包交易. 这样的升级版提案大大便利了实际交易, 丰富了交易场景, 拓宽了NFT生态的能力圈.

### 4. 简要介绍ERC-721的实现

--- 

ERC-721与ERC-20的差别主要还是在于同质化与非同质化. ERC-20的Token可以无限细分, 而ERC-721的Token最小的单位为1, 无法再分割, 而且ERC-721内每一个Token完全不同, 并且每个Token对不同的用户都有不同的价值. 因此在底层实现与设计方面有所区别.



## 二. 实际开发NFT应用

在本节我们将基于ERC-721标准开发一个NFT应用, 应用采用React框架构建客户端页面, 智能合约使用Solidity进行编写, 实现功能为: 通过以太坊钱包发行多个NFT(独特HEX颜色的纯色图片).

### 1. 安装依赖

---

首先确保环境中安装了[Node.js](http://nodejs.org), 我们将通过它来安装其他依赖.

```
在ganache官网(https://www.trufflesuite.com/ganache)安装与系统兼容的ganache.
```

- [ganache](https://www.trufflesuite.com/ganache)的作用是快速在本地网络搭建以太坊区块链, 方便之后的开发与测试.

```
// 在命令行输入以下内容, 通过npm下载安装truffle
$ npm install -g truffle
```

- truffle是以太坊开发的必备工具, 帮助开发者可以快速编译测试智能合约.

- npm是node附带的包管理器, -g代表了在全局环境安装truffle

> 如果npm报错, 请尝试 `sudo npm install -g truffle`, 并且输入密码.

```
// 通过git克隆客户端模版
$ git clone https://github.com/fewwwww/ERC-721-starter.git
```

- 模版中包括: 前端框架React的基本模版以及存储智能合约的文件夹.

```
通过IDE打开文件夹, 打开IDE中的终端, 运行
$ npm install
$ npm i solc --save
来下载依赖.
```

> 注意, 下载生成的 `node_modules` 不需要上传到github或分享给协作者.

下载完成后, 通过package.json文件中的scripts来运行客户端项目.

```
点击 package.json中的"start": "react-scripts start"旁按钮
或
使用终端: 
$ react-scripts start 
```

客户端会在 `http://localhost:3000` 运行. 在终端输入 `control + c` 可以终止运行.

> React是一个开源的UI组件库, 通过它, 我们可以用更简单的JavaScript的语法操作页面中的元素, 并且它附带了一系列的工具能让我们实时预览客户端, 便利开发的流程.


```
打开ganache, 直接点击quickstart按钮来一键搭建本地区块链

将界面中RPC SERVER内 HTTP://127.0.0.1:{端口号} 的端口号复制到truffle-config.js中的
    development: {
      host: "127.0.0.1",
      port: {端口号},
      network_id: "*" // Match any network id
    },
```

### 2. 开发合约

---

> 如果你在本节合约编译期间遇到solidity版本冲突问题, 最好直接依照文中的老板本进行开发.
>
> 完全解决需要苛刻的网络环境, 或者参照[此链接](https://learnblockchain.cn/question/1568).

我们首先会进行合约的开发.

在`src/contracts`中我们可以看到已经有一个`Migrations.sol`的合约文件, 它的作用是把我们的其他合约与truffle进行桥接.

1. 由于我们的NFT是一个一个的颜色图片, 所以我们需要新建颜色图片NFT的智能合约.


```
 在contracts文件夹内新建一个Color.sol文件
 ```

我们将按照ERC-721标准进行开发, 这大大便利了我们的开发流程. 在这个基础上, 我们可以借助 [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) 所实现的ERC-721标准进一步地做到快速开发.

2. ```
   在IDE的终端中输入:
   $ npm install @openzeppelin/contracts@2.3.0 --save
   ```

> 如果安装不成功, 可以尝试`$ sudo npm install @openzeppelin/contracts`

安装成功后可以在`package.json`中看到

```
"dependencies": {
  "@openzeppelin/contracts": "^2.3.0",
  ...
```

3. 我们已经下载完成了OpenZeppelin, 所以在`Color.sol`内我们可以引入OpenZeppelin库中的代码, 同时让我们的合约继承引入的对象:

```
import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

contract Color is ERC721Full {

}
```

4. 在`Color`智能合约中添加构造函数, 并把代币名称和代号传入给父合约:

```
contract Color is ERC721Full {
    constructor() ERC721Full('Color', 'COLOR'  public{}
}
```

5. 尝试编译合约:

```
$ truffle compile
```

编译成功会显示:

```
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang
```

6. 在部署之前, 我们需要在`migrations`文件夹中添加迁移文件. 这步的作用是让`Color.sol`被部署.

```
在/migrations中创建2_deploy_contracts.js, 内容为:

const Color = artifacts.require("Color");

module.exports = function(deployer) {
    deployer.deploy(Color);
};

```

7. 迁移部署合约:

```
$ truffle migrate
```

> 注意部署时要在ganache中保持部署网络运行.

运行成功会显示:

```
Summary
=======
> Total deployments:   1
> Final cost:          0.00450474 ETH
```

8. 在`truffle`控制台中查看部署情况:

```
truffle(development)> Color.deployed()
```

可以看到很多合约的信息. 为了后续开发的便利, 我们可以把这些信息保存到一个变量里.

由于`Color.deployed()`返回的是一个`Promise`对象, 所以我们可以使用以下语法保存:

```
color = await Color.deployed()
或
Color.deployed().then((result) => {color = result})
```

> Truffle是用JavaScript语言编写的. Promise是JavaScript中的异步对象. 它有三种状态: pending, resolved, rejected.
>
> 比如在浏览器中输入baidu.com按下回车后, 进度条加载状态就相当于Promise的pending, 成功显示就相当于resolved状态, 网络不好没打开就相当于rejected状态. 而我们所需要的返回值/结果是baidu.com打开后的网页.
>
> 如果直接使用color = Color.deployed()进行赋值会让color成为一个处在pending状态的Promise对象, 而不是Promise对象所返回出的结果.

9. 在`console`中查询合约信息:

```
truffle(development)> color.name()
'Color'

truffle(development)> color.address
'0x87514286d09b0Fb4A8bb4133c53378F35670DE6e'

truffle(development)> color.symbol()
'COLOR'
```

10. 由于我们的应用功能包括让用户创建16进制颜色图片的NFT, 所以我们需要在`Color.sol`合约中添加一个铸币方法:

> 在开发合约的过程中, 最好同步编写测试. 本文篇幅有限因此跳过测试的内容.

我们首先在合约中创建一个colors变量, 类型为由字符串组成的列表, 存储所有16进制的颜色字符.

```
contract Color is ERC721Full {
    string[] public colors;
...
```

铸币方法的流程为:

1. 颜色字符串传入 *mint*

2. 检测颜色是否唯一

3. 生成颜色的id

4. 调用ERC-721中的 *_mint* 方法铸币

5. 确保此颜色在后续不被创建

为了做到第二步, 我们需要使用`Solidity`中的`mapping`数据结构来记录已铸造的颜色.

`mapping`类似`python`中的`dictionary`

```
contract Color is ERC721Full {
    string[] public colors;
    mapping(string => bool) _colorExists;
...
```

接下来我们按照上面的流程写mint方法:

```
......
    function mint(string memory _color) public {

        // 将新铸造的color加入colors列表, 返回数组的新长度作为id
        uint _id = colors.push(_color);

        // 调用ERC-721中的_mint方法, 铸币
        // _mint(address to, uint256 tokenId)
        _mint(msg.sender, _id);

        //将color作为key, true作为value, 传入_colorExists
        _colorExists[_color] = true;
    }
```
