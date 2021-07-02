// 引入React框架
import React from 'react';
// 引入React Hooks
import {useEffect, useState} from "react";
// 引入客户端样式文件
import './App.css';
// 引入Web3
import Web3 from "web3";
// 引入Color的abi
import Color from '../abis/Color.json'

const App = () => {
  // 将状态中的account默认设置为空字符串
  // setAccount是改变状态的唯一方法
  const [account, setAccount] = useState('')
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

  // 在组件colors变化时挂载时调用loadWeb3(), 加载最新的BlockchainData
  useEffect(() => {
    loadWeb3()
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
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0"
           href="https://blog.suningyao.com/docs/Blockchain/erc"
           target="_blank"
           rel="noopener noreferrer"
        >
            ERC-721 Color
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            {/* {account}的写法意义是在HTML的纯文本中显示JavaScript变量 */}
            <small className="text-white"><span id="account">你的账号: {account}</span></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>铸造新NFT</h1>
              {/* 按下提交按钮后tempColor为空, 输入框也变空 */}
              {/* 输入框内容改变时, 将tempColor状态替换为新内容 */}
              <input
                  type='text'
                  className='form-control mb-1'
                  placeholder='如#FFFFFF的HEX颜色'
                  value={tempColor}
                  onChange={(event) =>
                      setTempColor(event.target.value)}
              />
              {/* 提交后调用mint(), 传入当前的tempColor状态 */}
              <input
                  type='submit'
                  className='btn btn-block btn-primary'
                  value='提交'
                  onClick={() =>
                  {
                    mint(tempColor)
                  }}
              />
            </div>
          </main>
        </div>
        <hr/>
        {/* 通过列表形式渲染所有的color, 每个颜色是color中声明的颜色 */}
        <div className="row text-center">
          {
            colors.map((color, key) => {
            return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>
                </div>
            )
          })}
        </div>
      </div>
    </div>
    );
}

export default App;
