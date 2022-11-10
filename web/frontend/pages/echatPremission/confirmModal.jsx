import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import './confirmModal.css'

export default function confirmModal(props) {
  const [show,setShow] = useState(false)
  const confirm = ()=>{
    // 确定执行 回调
    setShow(false)
    props.setShow(false)
    const url = `https://es.echatsoft.com/login-page/binding/login.html?appId=VQJOST4GQSMHVUDXKR5FYSFGBYEMMH9S&redirectUrl=${props.companyInfo.redirectUrl}`


    // const url = `https://chat.rainbowred.com/login-page/binding/login.html?appId=GX2ZFR4EYAAUXMLDFD5PBSPYDRYXHLRT&redirectUrl=${props.companyInfo.redirectUrl}`
    window.open(url)
  }
  const cancel = ()=>{
    setShow(false)
    props.setShow(false)
  }
  useEffect(()=>{
    setShow(props.show)
  },[props.show])
  return (
    <>
    {
      show&&(<div className='premission_confirm_box'>
      <div className='premission_confirm_box_modal'>
        <div className='premission_confirm_box_modal_header'>
          温馨提示
        </div>
        <div className='premission_confirm_box_modal_content'>
          <div className='premission_confirm_box_modal_content_value'>
            确定更改当前账号吗？
          </div>
          <div className='premission_confirm_box_modal_content_btn'>
            <div className='premission_confirm_box_modal_content_btn_ok' onClick={()=>confirm()}>
              确定
            </div>
            <div className='premission_confirm_box_modal_content_btn_cancel' onClick={()=>cancel()}>
              取消
            </div>
          </div>
        </div>
      </div>
    </div>)
    }
    </>
    
  )
}
