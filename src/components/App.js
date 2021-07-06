// 引入React框架
import React from 'react';
// 引入React Hooks
import {useState} from "react";
// 引入客户端样式文件
import './App.css';
// 引入主页组件
import Home from "./Home";


const App = () => {
  // 用户暂时输入的地址的状态变量
  const [input, setInput] = useState('')
  // 地址的状态变量
  const [address, setAddress] = useState('')
  // 是否需要留在登录页的状态变量
  const [login, setLogin] = useState(true)

  // 校验用户输入地址, 如果输入不合法显示警告的svg, 合法则把输入存入address, address传入到主页组件, 进入主页
  let warning = <div></div>
  if (input.slice(0,2) === '0x') {
    setAddress(input)
    setInput('地址校验成功, 正在登录...')
    setLogin(false)
  } else if (input === '地址校验成功, 正在登录...' || input === '') {
    warning = <div></div>
  } else {
    warning =
      <div>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C23.2843 0 30 6.71571 30 15C30 23.2843 23.2843 30 15 30C6.71571 30 0 23.2843 0 15C0 6.71571 6.71571 0 15 0ZM15 2.14286C7.89921 2.14286 2.14286 7.89921 2.14286 15C2.14286 22.1008 7.89921 27.8571 15 27.8571C22.1008 27.8571 27.8571 22.1008 27.8571 15C27.8571 7.89921 22.1008 2.14286 15 2.14286Z" fill="#D70E0E"/>
          <path d="M8.875 19.375L19.375 8.875C19.8582 8.39175 20.6418 8.39175 21.125 8.875C21.6082 9.35825 21.6082 10.1418 21.125 10.625L10.625 21.125C10.1418 21.6082 9.35825 21.6082 8.875 21.125C8.39175 20.6418 8.39175 19.8582 8.875 19.375Z" fill="#D70E0E"/>
          <path d="M21.125 19.375L10.625 8.875C10.1418 8.39175 9.35825 8.39175 8.875 8.875C8.39175 9.35825 8.39175 10.1418 8.875 10.625L19.375 21.125C19.8582 21.6082 20.6418 21.6082 21.125 21.125C21.6082 20.6418 21.6082 19.8582 21.125 19.375Z" fill="#D70E0E"/>
        </svg>
      </div>
  }

  return (
      <div>
        <nav>
          <div className='home-logo'>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M29.308 12.2029L16.0097 0.571606C15.5774 0.193479 15.0081 -0.0111574 14.4208 0.000469665C13.8334 0.0120967 13.2736 0.239087 12.8582 0.633995L0.627656 12.2617L0 12.8584V30H11.7857V19.3046H18.2143V30H30V12.8083L29.308 12.2029ZM14.4668 2.03726C14.4857 2.03726 14.4741 2.04114 14.466 2.04872C14.4576 2.04114 14.4479 2.03726 14.4668 2.03726ZM27.8571 27.9628H20.3571V19.3046C20.3571 18.7643 20.1314 18.2461 19.7295 17.864C19.3277 17.482 18.7826 17.2674 18.2143 17.2674H11.7857C11.2174 17.2674 10.6723 17.482 10.2705 17.864C9.86862 18.2461 9.64286 18.7643 9.64286 19.3046V27.9628H2.14286V13.7022L14.4668 2.0745C14.4677 2.07374 14.4678 2.07304 14.4684 2.07228L27.8571 13.7022V27.9628Z"
                  fill="white"/>
            </svg>
            <p>
              ERC-721 Color
            </p>
          </div>
          <div>
            未登录
          </div>
        </nav>
        { login ?
        <div className='content'>
          <div className='login'>
            <div className='enter-address'>
              <div className='input-text'>你的钱包地址:</div>
              <div className='input-address'>
                {/*用户输入变化时则改变状态变量*/}
                <input type="text"
                       value={input}
                       onChange={(event) => setInput(event.target.value)}
                />
                {warning}
              </div>
            </div>
            <div>或者</div>
            {/*直接通过MetaMask登录*/}
            <div className='button' onClick={() => {setLogin(false)}}>
              <img src="https://img.icons8.com/ios-glyphs/30/000000/login-rounded-right--v1.png"/>
              使用MetaMask登录
            </div>
          </div>
        </div>
            :
        <Home address={address}/>
        }
      </div>
  );
}

export default App;
