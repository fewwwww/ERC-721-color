// 将文件的solidity版本锁定在0.5.16
// 指定0.5.16版本的solidity
pragma solidity 0.5.16;

// 引入OpenZeppelin所实现的ERC-721标准
import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

// 'is' 表示Color合约继承我们引入的ERC721
contract Color is ERC721Full {
    // 初始化合约
    // 传入父类初始化时的name与symbol
    // 父类的构造函数如下:
    // constructor(string memory name_, string memory symbol_) {
    //    _name = name_;
    //    _symbol = symbol_;
    // }
    // 
    // 在老版本中, 构造函数只可以为public(可供外部、子合约、合约内部访问)或internal(可供外部和子合约调用)
    constructor() ERC721Full('Color', 'COLOR') public{
        
    }
}
