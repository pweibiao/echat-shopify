import React, { useEffect } from 'react'
import { Button } from '@shopify/polaris'
import './index.css'
import { useState } from 'react'
import ShopConfig from './ShopConfig'
import EmptyEchatPremission from './EmptyEchatPremission'
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { Toast } from "@shopify/app-bridge-react";
import { useLocation, useSearchParams } from 'react-router-dom';




const defalutForm = {
  shopName:'',
  companyId:'',
  appId:'',
  appSceret:'',
  echatTag:'',
  routeEntranceId:'',
  echatLan:'',
}

export default function EchatPremission() {
  const params = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetch = useAuthenticatedFetch();
  const [type,setType] = useState(0)
  const [companyInfo,setCompanyInfo] = useState({})
  const changeType = (type)=>{
    setType(type)
  }
  // 获取公司配置信息
  const getCompanyInfo = async()=>{
    const initParams = {
      method:'GET',
      headers: { "Content-Type": "application/json" },
    }
    const response = await fetch("/api/getConfig",initParams);
      if (response.ok) {
        let result = await response.json()
        // console.log('getCompanyInfo:2',result.data);
        setCompanyInfo({...result.data}) 
        // if(result.data.appId){ // 已授权
        if(result.data.appId&&result.data.companyId){ // 已授权
          setType(2)
        }else{ // 未授权
          setType(1)
        }
      } 
  }
  // 获取echat绑定公司信息
  const getEchatCompanyInfo = async(authCode)=>{
    const initParams = {
      method:'GET',
      headers: { "Content-Type": "application/json" },
    }
    const url = `/api/getEchatCompanyInfo?authCode=${authCode}`
    const response = await fetch(url,initParams);
      if (response.ok) {
        let result = await response.json()
        // console.log('getEchatCompanyInfo:3',result.result);
        getCompanyInfo()
        // if(result.successful==true){
        //   setType(2)
        // }else{

        // }
        // setCompanyInfo({...result.data}) 
        // if(result.data.appId){ // 已授权
        // if(result.data.appId&&result.data.companyId&&result.data.echat_aeskey){ // 已授权
        //   setType(2)
        // }else{ // 未授权
        //   setType(1)
        // }
      } 
  }
  useEffect(() => {
    // 获取authCode
    let authCode = searchParams.get('authCode');
    // console.log('1:authCode',authCode);
    // 根据获取到的authCode请求echat数据
    if(authCode){
      // 获取数据之后 1.存储数据库 2.切换成配置模式
      getEchatCompanyInfo(authCode)
    }else{

      // 第一步：获取商店信息查询是否授权以及生成过appId等记录
      getCompanyInfo()
      // 第二步：设置未授权|已授权页面
      // console.log('enter');
    }
    // api
    //   .getData({
    //     companyId: companyId,
    //     orderId: getProductId,
    //   })
    //   .then((res: any) => {
    //     if (res.code === 200) {
    //       setOrderInfo({ ...orderInfo, ...res.data });
    //     }
    //     setLoading(false);
    //   });
    // 将请求数据存储在node数据库中
  }, [params]);
  return (
    <div className="premission">
      <div className="premission_box">
        { 
          type == 1 ? 
          <EmptyEchatPremission companyInfo={companyInfo}/>:''
        }
        { 
          type == 2 ? 
          <ShopConfig companyInfo={companyInfo}/>:''
        }
      </div>
      {/* <div className="btn-warp">
        { 
          type == 1 ? 
          <Button size="large" onClick={()=>changeType(2)} style={'margin-left:20px'}>商店配置</Button> :''
        }
        { 
          type == 2 ? 
          <Button size="large" onClick={()=>changeType(1)}>授权Echat</Button>  :''
        }
      </div>
        */}
    </div>
  )
}
