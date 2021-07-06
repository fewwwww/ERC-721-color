// 引入React框架
import React from 'react';
// 引入React Hooks
import {useEffect, useState} from "react";
// 引入Web3
import Web3 from "web3";
// 引入Color的abi
import Color from '../abis/Color.json'
//
import './Home.css'

const Home = ({address}) => {
    // 将状态中的account默认设置为空字符串
    // setAccount是改变状态的唯一方法
    const [account, setAccount] = useState(address)
    // 存储合约
    const [contract, setContract] = useState(null)
    // 存储NFT总量
    const [totalSupply, setTotalSupply] = useState(0)
    // 存储所有NFT颜色
    const [colors, setColors] = useState([])
    // 存储用户输入的颜色
    const [tempColor, setTempColor] = useState('')

    // 异步加载Web3的函数
    const loadWeb3 = async () => {
        // 如果客户端窗口对象内有以太坊
        if (window.ethereum) {
            // 生成Web3对象
            window.web3 = new Web3(window.ethereum)
            // 异步激活窗口内的以太坊
            await window.ethereum.enable()
        }
        // 此外如果窗口对象内有web3
        else if (window.web3) {
            // 生成Web3对象
            window.web3 = new Web3(window.web3.currentProvider)
        }
        // 此外, 两个对象都没有, 弹出警告
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    // 异步加载区块链数据
    const loadBlockchainData = async () => {
        // 将窗口对象内的web3赋值在web3变量上
        const web3 = window.web3
        // 异步加载web3中的所有账户
        const accounts = await web3.eth.getAccounts()
        // 将账户状态修改为accounts中的第一个
        setAccount(accounts[0])
        // 拿到网络ID
        const networkId = await web3.eth.net.getId()
        // 通过网络ID拿到网络中的数据
        const networkData = Color.networks[networkId]
        // 如果Color的网络是ID
        if(networkData) {
            // 拿到Color合约中的abi数据
            const abi = Color.abi
            // 拿到合约地址
            const address = networkData.address
            // 拿到合约内容并存入contract变量
            const contract = new web3.eth.Contract(abi, address)
            // 将合约状态设置为新合约
            setContract(contract)
            // 拿到合约中的NFT总量
            const totalSupply = await contract.methods.totalSupply().call()
            // 将总量状态设置为新总量
            setTotalSupply(totalSupply)
            // 暂时存储我们的新colors
            let tempColors = []
            // 遍历总量-1次, 每次在colors状态中添加新的color
            for (let i = 1; i <= totalSupply; i++) {
                const color = await contract.methods.colors(i - 1).call()
                // 在新colors中加入拿到的color
                tempColors = [...tempColors, color]
            }
            // 最终将colors状态更新
            setColors(tempColors)
            // 如果合约没被部署到这个网络
        } else {
            // 弹出警告
            window.alert('Smart contract not deployed to detected network.')
        }
    }

    useEffect(() => {
        // 如果地址不为空, 则通过Web3加载进入
        if (address === '') {
            loadWeb3()
        }
    }, [])

    // 在组件colors变化时加载最新的BlockchainData
    useEffect(() => {
        loadBlockchainData()
    },[colors])

    // 输入color
    const mint = (color) => {
        // 通过调用contract铸币, from为当前账户
        contract.methods.mint(color).send({ from: account })
            .once('receipt', (receipt) => {
                // 将新Colors暂存
                const newColors = [...colors, color]
                // 更新Colors状态
                setColors(newColors)
            })
        // 清空tempColor为空
        setTempColor('')
    }

    return (
        <div>
            <nav>
                <div className='home-logo'>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.308 12.2029L16.0097 0.571606C15.5774 0.193479 15.0081 -0.0111574 14.4208 0.000469665C13.8334 0.0120967 13.2736 0.239087 12.8582 0.633995L0.627656 12.2617L0 12.8584V30H11.7857V19.3046H18.2143V30H30V12.8083L29.308 12.2029ZM14.4668 2.03726C14.4857 2.03726 14.4741 2.04114 14.466 2.04872C14.4576 2.04114 14.4479 2.03726 14.4668 2.03726ZM27.8571 27.9628H20.3571V19.3046C20.3571 18.7643 20.1314 18.2461 19.7295 17.864C19.3277 17.482 18.7826 17.2674 18.2143 17.2674H11.7857C11.2174 17.2674 10.6723 17.482 10.2705 17.864C9.86862 18.2461 9.64286 18.7643 9.64286 19.3046V27.9628H2.14286V13.7022L14.4668 2.0745C14.4677 2.07374 14.4678 2.07304 14.4684 2.07228L27.8571 13.7022V27.9628Z" fill="white"/>
                    </svg>
                    <p>
                        ERC-721 Color
                    </p>
                </div>
                <div>
                    {/* {account}的写法意义是在HTML的纯文本中显示JavaScript变量 */}
                    你的账号: {account}
                </div>
            </nav>

            <div className='content'>
                <div className="input-p">提交HEX颜色(如#123456), 铸造并存储代币</div>
                <div className="input-container">
                    <div className="input-box">
                        <div className="input-field">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.8" d="M19.9399 18.5624L13.4474 12.0699C14.4549 10.7675 14.9999 9.17496 14.9999 7.49997C14.9999 5.49498 14.2174 3.61498 12.8024 2.19749C11.3874 0.779996 9.50246 0 7.49997 0C5.49748 0 3.61248 0.782496 2.19749 2.19749C0.779996 3.61248 0 5.49498 0 7.49997C0 9.50246 0.782496 11.3874 2.19749 12.8024C3.61248 14.2199 5.49498 14.9999 7.49997 14.9999C9.17496 14.9999 10.765 14.4549 12.0674 13.4499L18.5599 19.9399C18.579 19.959 18.6016 19.9741 18.6264 19.9844C18.6513 19.9947 18.678 20 18.7049 20C18.7318 20 18.7585 19.9947 18.7834 19.9844C18.8083 19.9741 18.8309 19.959 18.8499 19.9399L19.9399 18.8524C19.959 18.8334 19.9741 18.8108 19.9844 18.7859C19.9947 18.761 20 18.7343 20 18.7074C20 18.6805 19.9947 18.6538 19.9844 18.6289C19.9741 18.6041 19.959 18.5815 19.9399 18.5624ZM11.46 11.46C10.4 12.5174 8.99496 13.0999 7.49997 13.0999C6.00497 13.0999 4.59998 12.5174 3.53998 11.46C2.48249 10.4 1.89999 8.99496 1.89999 7.49997C1.89999 6.00497 2.48249 4.59748 3.53998 3.53998C4.59998 2.48249 6.00497 1.89999 7.49997 1.89999C8.99496 1.89999 10.4025 2.47999 11.46 3.53998C12.5174 4.59998 13.0999 6.00497 13.0999 7.49997C13.0999 8.99496 12.5174 10.4025 11.46 11.46Z" fill="#808080"/>
                            </svg>
                            <input type="text"
                                   value={tempColor}
                                   onChange={(event) =>
                                       setTempColor(event.target.value)}/>
                        </div>
                        <div className="input-submit"
                             onClick={() =>
                             {
                                 mint(tempColor)
                             }}>
                            提交
                        </div>
                    </div>
                </div>
                {/* 通过列表形式渲染所有的color, 每个颜色是color中声明的颜色 */}
                <div className="row text-center colors">
                    {
                        colors.map((color, key) => {
                            return(
                                <div key={key} className="col-md-3 mb-5">
                                    <div className="token" style={{ backgroundColor: color }}></div>
                                    <div className="token-p" style={{fontSize: '30px'}}>{color}</div>
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    );
}

export default Home;
