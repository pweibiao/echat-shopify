import React ,{useState,useEffect} from 'react'
import {Form, FormLayout, TextField, Button} from '@shopify/polaris';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { Toast } from "@shopify/app-bridge-react";
import  ConfirmModal from './confirmModal'

const defalutForm = {
  companyId:'',
  shopName:'',
  echatTag:'',
  routeEntranceId:'',
  echatLan:'',
}
export default function ShopConfig(props) {
  const fetch = useAuthenticatedFetch();
  const emptyToastProps = { content: '' };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [fromData,setFormData] = useState(defalutForm)
  const [showConfirm,setShowConfirm] = useState(false)
  const handleSubmit = async()=>{
    setIsLoading(true);
    // const response = await fetch("/api/upDateAssets");
    const initParams = {
      method:'POST',
      body:JSON.stringify(fromData),
      headers: { "Content-Type": "application/json" },
    }
    const response = await fetch("/api/updateConfig",initParams);
    // {
    //   method:'GET',
    //   headers: { "Content-Type": "application/json" },
    // }
    // console.log(response);
    
    if (response.ok) {
      let result = await response.json()
      // console.log( result.data);
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }
  const reBindPremission = ()=>{
    // console.log('reBindPremission');
    setShowConfirm(true)
   
  }
  const handleChange = (key,value) => {
    fromData[key] = value
    setFormData({...fromData})
  }
  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );
  const setShow =(val)=>{
    setShowConfirm(val)
  }
  useEffect(async()=>{
    const initParams = {
      method:'GET',
      headers: { "Content-Type": "application/json" },
    }
    const response = await fetch("/api/getConfig",initParams);
      if (response.ok) {
        let result = await response.json()
        // console.log(result.data);
        setFormData({...result.data})
      } 
  },[])
  return (
    <>
      <ConfirmModal show={showConfirm} setShow={setShow} companyInfo={props.companyInfo}></ConfirmModal>
      {isLoading?toastMarkup:''}
      <div className="content_box">
        <div className="content_title">
          Echat 配置
        </div>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <TextField
              value={fromData.companyId}
              onChange={(val)=>handleChange('companyId',val)}
              label="公司ID"
              disabled
              autoComplete="off"
            />
            <TextField
              value={fromData.shopName}
              onChange={(val)=>handleChange('shopName',val)}
              label="商城名称"
              disabled
              autoComplete="off"
            />
            <TextField
              value={fromData.routeEntranceId}
              onChange={(val)=>handleChange('routeEntranceId',val)}
              label="routeEntranceId(咨询入口Id)"
              autoComplete="off"
            />
            <TextField
              value={fromData.echatTag}
              onChange={(val)=>handleChange('echatTag',val)}
              label="echatTag(路由标签)"
              autoComplete="off"
            />
            <TextField
              value={fromData.echatLan}
              onChange={(val)=>handleChange('echatLan',val)}
              label="echatLan(语言类型)"
              autoComplete="off"
            />
          <div className="content_btn_warp">
          <div className="update_btn" onClick={()=>handleSubmit()}>更新</div>
          {/* <Button submit width={'240px'} primary>更新</Button> */}
          <div className="reBind" onClick={()=>reBindPremission()}>重新绑定</div>
          </div>
        </FormLayout>
        {/* <Button primary onClick={()=>updateJs()}>确定</Button> */}
        </Form>
      </div>
    </>
  )
}
