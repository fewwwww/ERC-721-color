// 将文件的solidity版本锁定在0.5.16
// 指定0.5.16版本的solidity
pragma solidity 0.5.16;

// 引入OpenZeppelin所实现的ERC-721标准
import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

// 'is' 表示Color合约继承我们引入的ERC721
contract Color is ERC721Full {
    // 存储颜色变量, 当颜色创建, 将新color加入colors
    string[] public colors;
    // 类似Python内的dictionary
    mapping(string => bool) _colorExists;

    // 初始化合约, 传入ERC-721初始化时的参数name与symbol
    //    ERC-721的构造函数如下:
    //    constructor(string memory name_, string memory symbol_) {
    //       _name = name_;
    //       _symbol = symbol_; }
    //
    // 在老版本中, 构造函数只可以为public(可供外部、子合约、合约内部访问)或internal(可供外部和子合约调用)
    // https://docs.soliditylang.org/en/develop/contracts.html?highlight=private#visibility-and-getters
    constructor() ERC721Full('Color', 'COLOR') public{
        
    }

    // string: 字符串类型; memory: local variable; _color: 参数名
    function mint(string memory _color) public {
        // 检测color是否已经存在过, 不存在则继续
        require(!_colorExists[_color]);

        // 将新铸造的color加入colors列表, 返回数组的新长度作为id
        uint _id = colors.push(_color);

        // 调用ERC-721中的_mint方法, 铸币
        // _mint(address to, uint256 tokenId)
        _mint(msg.sender, _id);

        //将color作为key, true作为value, 传入_colorExists
        _colorExists[_color] = true;

    }
}
