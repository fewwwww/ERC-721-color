# ERC标准以及基于ERC-721的NFT应用开发流程

## 一. ERC标准
---
### 1. 什么是ERC?

ERC是指以太坊开发者的提案, ERC-721其实就代表721号提案. 

提案一开始会作为EIP提出, 之后在公开审议之后就会成为ERC, 变成标准化的提案.

标准化提案的作用就是给开发者一些模版帮助开发, 同时也给开发者一些标准的限制.

- 开发者不用从底层开始完整进行设计与实现, 而只需根据一些标准快速开发DApp. 如今借助这些标准, 甚至[有些网站](http://thetokenfactory.com)做到只需要填4个数值就可以实现发币的功能.

- 开发者可以遵循这些标准, 这样能做到整个生态的互通以及其他软件适配上的便利. 比如: MyEtherWallet不用频繁更新就可以支持多个币种.

---
### 2. 有哪些ERC?

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

---
### 3. ERC-721: 服务于非同质化的代币(不可分割, 可追踪性), 代表了资产的所有权. 

非同质代表独一无二，[CryptoKitties](https://www.cryptokitties.co)为例, 每只猫都拥有独一无二的基因. 一只猫就是一个NFT. 猫和猫之间是不能置换的. 这种独特性使得某些稀有猫具有收藏价值, 也因此受到追捧.

以下是ERC-721的标准具体内容, 我们将在实际开发过程当中深入探讨它:
```
pragma solidity ^0.4.20;

        /// @title ERC-721 Non-Fungible Token Standard
        /// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
        ///  Note: the ERC-165 identifier for this interface is 0x80ac58cd
        interface ERC721 /* is ERC165 */ {
            /// @dev This emits when ownership of any NFT changes by any mechanism.
            ///  This event emits when NFTs are created (`from` == 0) and destroyed
            ///  (`to` == 0). Exception: during contract creation, any number of NFTs
            ///  may be created and assigned without emitting Transfer. At the time of
            ///  any transfer, the approved address for that NFT (if any) is reset to none.
            event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

            /// @dev This emits when the approved address for an NFT is changed or
            ///  reaffirmed. The zero address indicates there is no approved address.
            ///  When a Transfer event emits, this also indicates that the approved
            ///  address for that NFT (if any) is reset to none.
            event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

            /// @dev This emits when an operator is enabled or disabled for an owner.
            ///  The operator can manage all NFTs of the owner.
            event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

            /// @notice Count all NFTs assigned to an owner
            /// @dev NFTs assigned to the zero address are considered invalid, and this
            ///  function throws for queries about the zero address.
            /// @param _owner An address for whom to query the balance
            /// @return The number of NFTs owned by `_owner`, possibly zero
            function balanceOf(address _owner) external view returns (uint256);

            /// @notice Find the owner of an NFT
            /// @dev NFTs assigned to zero address are considered invalid, and queries
            ///  about them do throw.
            /// @param _tokenId The identifier for an NFT
            /// @return The address of the owner of the NFT
            function ownerOf(uint256 _tokenId) external view returns (address);

            /// @notice Transfers the ownership of an NFT from one address to another address
            /// @dev Throws unless `msg.sender` is the current owner, an authorized
            ///  operator, or the approved address for this NFT. Throws if `_from` is
            ///  not the current owner. Throws if `_to` is the zero address. Throws if
            ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
            ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
            ///  `onERC721Received` on `_to` and throws if the return value is not
            ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
            /// @param _from The current owner of the NFT
            /// @param _to The new owner
            /// @param _tokenId The NFT to transfer
            /// @param data Additional data with no specified format, sent in call to `_to`
            function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;

            /// @notice Transfers the ownership of an NFT from one address to another address
            /// @dev This works identically to the other function with an extra data parameter,
            ///  except this function just sets data to ""
            /// @param _from The current owner of the NFT
            /// @param _to The new owner
            /// @param _tokenId The NFT to transfer
            function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;

            /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
            ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
            ///  THEY MAY BE PERMANENTLY LOST
            /// @dev Throws unless `msg.sender` is the current owner, an authorized
            ///  operator, or the approved address for this NFT. Throws if `_from` is
            ///  not the current owner. Throws if `_to` is the zero address. Throws if
            ///  `_tokenId` is not a valid NFT.
            /// @param _from The current owner of the NFT
            /// @param _to The new owner
            /// @param _tokenId The NFT to transfer
            function transferFrom(address _from, address _to, uint256 _tokenId) external payable;

            /// @notice Set or reaffirm the approved address for an NFT
            /// @dev The zero address indicates there is no approved address.
            /// @dev Throws unless `msg.sender` is the current NFT owner, or an authorized
            ///  operator of the current owner.
            /// @param _approved The new approved NFT controller
            /// @param _tokenId The NFT to approve
            function approve(address _approved, uint256 _tokenId) external payable;

            /// @notice Enable or disable approval for a third party ("operator") to manage
            ///  all of `msg.sender`'s assets.
            /// @dev Emits the ApprovalForAll event. The contract MUST allow
            ///  multiple operators per owner.
            /// @param _operator Address to add to the set of authorized operators.
            /// @param _approved True if the operator is approved, false to revoke approval
            function setApprovalForAll(address _operator, bool _approved) external;

            /// @notice Get the approved address for a single NFT
            /// @dev Throws if `_tokenId` is not a valid NFT
            /// @param _tokenId The NFT to find the approved address for
            /// @return The approved address for this NFT, or the zero address if there is none
            function getApproved(uint256 _tokenId) external view returns (address);

            /// @notice Query if an address is an authorized operator for another address
            /// @param _owner The address that owns the NFTs
            /// @param _operator The address that acts on behalf of the owner
            /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
            function isApprovedForAll(address _owner, address _operator) external view returns (bool);
        }

        interface ERC165 {
            /// @notice Query if a contract implements an interface
            /// @param interfaceID The interface identifier, as specified in ERC-165
            /// @dev Interface identification is specified in ERC-165. This function
            ///  uses less than 30,000 gas.
            /// @return `true` if the contract implements `interfaceID` and
            ///  `interfaceID` is not 0xffffffff, `false` otherwise
            function supportsInterface(bytes4 interfaceID) external view returns (bool);
        }

        interface ERC721TokenReceiver {
            /// @notice Handle the receipt of an NFT
            /// @dev The ERC721 smart contract calls this function on the
            /// recipient after a `transfer`. This function MAY throw to revert and reject the transfer. Return
            /// of other than the magic value MUST result in the transaction being reverted.
            /// @notice The contract address is always the message sender.
            /// @param _operator The address which called `safeTransferFrom` function
            /// @param _from The address which previously owned the token
            /// @param _tokenId The NFT identifier which is being transferred
            /// @param _data Additional data with no specified format
            /// @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
            /// unless throwing
            function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes _data) external returns(bytes4);
         }
```

因为NFT市场的火热, 社区在ERC-721的基础上增加了ERC-1155, ERC-8899等协议. 它们同样服务于非同质化代币, ERC-1155引入一个中央智能合约包的概念, 可以做到将不同代币打包交易. ERC-8899可以做到将NFT与FT打包交易. 这样的升级版提案大大便利了实际交易, 丰富了交易场景, 拓宽了NFT生态的能力圈.

## 二. 实际开发NFT应用

在本节我们将基于ERC-721标准开发一个NFT应用, 应用采用React框架构建客户端页面, 智能合约使用Solidity进行编写, 实现功能为: 通过以太坊钱包发行多个NFT(独特HEX颜色的纯色图片). 

---
### 1. 安装依赖:
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
git clone https://github.com/fewwwww/ERC-721-starter.git
```

- 模版中包括: 前端框架React的基本模版以及存储智能合约的文件夹.

```
通过IDE打开文件夹, 打开IDE中的终端, 运行
$ npm install
来下载React的依赖.
```

> 注意, 下载生成的 `node_modules` 不需要上传到github或上传给他人

下载完成后, 通过package.json文件中的scripts来运行客户端项目.

```
点击 package.json中的"start": "react-scripts start"旁按钮
或
使用终端: 
$ react-scripts start 
```

客户端会在 `http://localhost:3000` 运行. 在终端输入 `control + c` 可以终止运行.

> React是一个开源的UI组件库, 通过它, 我们可以用类似JavaScript的语法操作页面中的元素, 并且它附带了一系列的工具能让我们实时预览客户端, 便利开发的流程.


```
打开ganache, 直接点击quickstart按钮来一键搭建本地区块链

将界面中RPC SERVER内 HTTP://127.0.0.1:{端口号} 的端口号复制到truffle-config.js中的
    development: {
      host: "127.0.0.1",
      port: {端口号},
      network_id: "*" // Match any network id
    },
```