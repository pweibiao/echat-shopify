import React, { useEffect } from 'react'
// import  './echatPremissionStyle.css'
import { useLocation, useSearchParams } from 'react-router-dom';

export default function EchatPremission(props) {
  
  useEffect(()=>{
    // console.log('props.companyInfo',props.companyInfo);
  },[props.companyInfo])
  const premissionHandle = ()=>{
    // 打开新页面
    
    const url = `https://es.echatsoft.com/login-page/binding/login.html?appId=VQJOST4GQSMHVUDXKR5FYSFGBYEMMH9S&redirectUrl=${props.companyInfo.redirectUrl}`
    // const url = `https://chat.rainbowred.com/login-page/binding/login.html?appId=GX2ZFR4EYAAUXMLDFD5PBSPYDRYXHLRT&redirectUrl=${props.companyInfo.redirectUrl}`
    window.open(url)
  }
  
  return (
      <div className="empty_box">
        <div className="empty_img"></div>
        <div className="empty_tip">请先授权绑定 Echat 账号后，再进行操作</div>
        <div className="empty_btn" onClick={()=>premissionHandle()}>授权绑定</div>
      </div>
  )
}
