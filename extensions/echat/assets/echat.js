var _echatServer = ['e.echatsoft.com'];
// 测试环境与线上环境区别
// var _echatServer = ['chat.rainbowred.com'];
window._echat = window._echat || function () { (_echat.q = _echat.q || []).push(arguments) }; _echat.l = +new Date;
// const request_ENV = 'http://127.0.0.1:3000/shopify';
// const request_ENV = "https://apps.echatsoft.com:9443/node/shopify";
const request_ENV = 'https://middle-node.echatsoft.com/shopify';
(function () {
  // 货币枚举对象
  const currencyObj = {
    AED: 'د.إ',
    AFN: '؋',
    ALL: 'L',
    AMD: '֏',
    ANG: 'ƒ',
    AOA: 'Kz',
    ARS: '$',
    AUD: '$',
    AWG: 'ƒ',
    AZN: '₼',
    BAM: 'KM',
    BBD: '$',
    BDT: '৳',
    BGN: 'лв',
    BHD: '.د.ب',
    BIF: 'FBu',
    BMD: '$',
    BND: '$',
    BOB: '$b',
    BOV: 'BOV',
    BRL: 'R$',
    BSD: '$',
    BTC: '₿',
    BTN: 'Nu.',
    BWP: 'P',
    BYN: 'Br',
    BYR: 'Br',
    BZD: 'BZ$',
    CAD: '$',
    CDF: 'FC',
    CHE: 'CHE',
    CHF: 'CHF',
    CHW: 'CHW',
    CLF: 'CLF',
    CLP: '$',
    CNH: '¥',
    CNY: '¥',
    COP: '$',
    COU: 'COU',
    CRC: '₡',
    CUC: '$',
    CUP: '₱',
    CVE: '$',
    CZK: 'Kč',
    DJF: 'Fdj',
    DKK: 'kr',
    DOP: 'RD$',
    DZD: 'دج',
    EEK: 'kr',
    EGP: '£',
    ERN: 'Nfk',
    ETB: 'Br',
    ETH: 'Ξ',
    EUR: '€',
    FJD: '$',
    FKP: '£',
    GBP: '£',
    GEL: '₾',
    GGP: '£',
    GHC: '₵',
    GHS: 'GH₵',
    GIP: '£',
    GMD: 'D',
    GNF: 'FG',
    GTQ: 'Q',
    GYD: '$',
    HKD: '$',
    HNL: 'L',
    HRK: 'kn',
    HTG: 'G',
    HUF: 'Ft',
    IDR: 'Rp',
    ILS: '₪',
    IMP: '£',
    INR: '₹',
    IQD: 'ع.د',
    IRR: '﷼',
    ISK: 'kr',
    JEP: '£',
    JMD: 'J$',
    JOD: 'JD',
    JPY: '¥',
    KES: 'KSh',
    KGS: 'лв',
    KHR: '៛',
    KMF: 'CF',
    KPW: '₩',
    KRW: '₩',
    KWD: 'KD',
    KYD: '$',
    KZT: '₸',
    LAK: '₭',
    LBP: '£',
    LKR: '₨',
    LRD: '$',
    LSL: 'M',
    LTC: 'Ł',
    LTL: 'Lt',
    LVL: 'Ls',
    LYD: 'LD',
    MAD: 'MAD',
    MDL: 'lei',
    MGA: 'Ar',
    MKD: 'ден',
    MMK: 'K',
    MNT: '₮',
    MOP: 'MOP$',
    MRO: 'UM',
    MRU: 'UM',
    MUR: '₨',
    MVR: 'Rf',
    MWK: 'MK',
    MXN: '$',
    MXV: 'MXV',
    MYR: 'RM',
    MZN: 'MT',
    NAD: '$',
    NGN: '₦',
    NIO: 'C$',
    NOK: 'kr',
    NPR: '₨',
    NZD: '$',
    OMR: '﷼',
    PAB: 'B/.',
    PEN: 'S/.',
    PGK: 'K',
    PHP: '₱',
    PKR: '₨',
    PLN: 'zł',
    PYG: 'Gs',
    QAR: '﷼',
    RMB: '￥',
    RON: 'lei',
    RSD: 'Дин.',
    RUB: '₽',
    RWF: 'R₣',
    SAR: '﷼',
    SBD: '$',
    SCR: '₨',
    SDG: 'ج.س.',
    SEK: 'kr',
    SGD: 'S$',
    SHP: '£',
    SLL: 'Le',
    SOS: 'S',
    SRD: '$',
    SSP: '£',
    STD: 'Db',
    STN: 'Db',
    SVC: '$',
    SYP: '£',
    SZL: 'E',
    THB: '฿',
    TJS: 'SM',
    TMT: 'T',
    TND: 'د.ت',
    TOP: 'T$',
    TRL: '₤',
    TRY: '₺',
    TTD: 'TT$',
    TVD: '$',
    TWD: 'NT$',
    TZS: 'TSh',
    UAH: '₴',
    UGX: 'USh',
    USD: '$',
    UYI: 'UYI',
    UYU: '$U',
    UYW: 'UYW',
    UZS: 'лв',
    VEF: 'Bs',
    VES: 'Bs.S',
    VND: '₫',
    VUV: 'VT',
    WST: 'WS$',
    XAF: 'FCFA',
    XBT: 'Ƀ',
    XCD: '$',
    XOF: 'CFA',
    XPF: '₣',
    XSU: 'Sucre',
    XUA: 'XUA',
    YER: '﷼',
    ZAR: 'R',
    ZMW: 'ZK',
    ZWD: 'Z$',
    ZWL: '$'
  }
  function addEvent (eventName, handle) {
    if (window.addEventListener) {
      window.addEventListener(eventName, handle)
    } else {
      window.attachEvent('on' + eventName, handle)
    }
  }
  // 创建http连接
  function createXMLHttpRequest () {
    var xmlhttp
    if (window.ActiveXObject) {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp
  }
  // 封装ajax请求
  function http (obj) {
    return new Promise((resolve, reject) => {
      obj.method = (obj.method || 'GET').toUpperCase();//忽略请求方式的大小写
      //设置同步异步值，如果没有，则为true
      obj.async = obj.async || true;
      //    1、创建一个XMLHttpRequest对象（考虑了兼容性）
      let xhttp = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
      //    2、设置事件处理程序
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          obj.callback(xhttp.responseText);
          resolve(xhttp.responseText)
        }
      };

      if (obj.method == 'GET' && obj.params) {
        let arr = [];
        for (let key in obj.params) {
          arr.push(key + '=' + obj.params[key])//通过'='链接对象中的键名和键值，并push进数组
        }
        data = arr.join('&');//通过'&'连接成字符串
        obj.url = obj.url + '?' + data
      }
      let newParams = ''
      if (obj.method == 'POST' && obj.params) {
        let keyList = Object.keys(obj.params)
        keyList.forEach((key, kIndex) => {
          newParams += `${key}=${obj.params[key]}${kIndex != keyList.length - 1 ? '&' : ''}`
        })
      }
      //3、设置请求相关的数据
      xhttp.open(obj.method, obj.url, obj.async);
      if (obj.method == 'POST') {
        //设置请求头
        // xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
        //4、发送请求
        // xhttp.send(JSON.stringify(obj.params))//post请求

        if (newParams) {
          // xhttp.send(JSON.stringify(newParams));//post请求
          xhttp.send(newParams);//post请求
        } else {
          xhttp.send();//post请求
        }

      } else {
        //4、发送请求
        xhttp.send()
      }
    })

  }
  /**发送请求 */
  function post (url, params) {
    var xmlhttp = createXMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          var result = xmlhttp.responseText;
          if (result) {
            try {
              var resultaObj = JSON.parse(result);
              if (resultaObj.successful) {
                return loadEchat(resultaObj.result.metaData);
              }
            } catch (e) { }
          }
        }
        // 非200  解析失败 、 resultaObj.successful 不是true 
        loadEchat()
      }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
    xmlhttp.send(params);
    return xmlhttp
  }

  // 获取用户信息
  function getMetaData (res) {
    // 1.根据用户Id获取用户信息metaData
    let httpParams1 = {
      method: 'get',
      url: request_ENV + '/getUserInfo',
      // url: request_ENV + '/getUserInfo',
      async: false,
      params: {
        shopName: window.Shopify.shop.split('.')[0],
        userId: window.echatCustomer.id
      },
      callback: function (result) {
        // 2.加密用户信息metaData

        const userInfo = JSON.parse(result)
        const formatCode = {
          uid: userInfo.id,
          name: userInfo.last_name + userInfo.first_name,
          phone: userInfo.phone,
          email: userInfo.email,
          memo: userInfo.note,
          // nation:userInfo.default_address.country,
          // city:userInfo.default_address.province + userInfo.default_address.city,
          // address:userInfo.default_address.address1 + userInfo.default_address.address2 
        }
        let httpParams = {
          method: 'post',
          url: request_ENV + '/encodeMetaData',
          async: false,
          params: {
            shopName: res.data.shop_name,
            encodeMsg: JSON.stringify(formatCode)
            // shopName:window.Shopify.shop.split('.')[0]
          },
          callback: function (result2) {
            let newResult = JSON.parse(result2)
            // console.log('encodeMsg:',result2);
            //3.生成echat.js
            loadEchat(res, newResult)
          }
        }
        http(httpParams)

      }
    }
    http(httpParams1)
  }

  // 获取订单信息
  async function getOrder (id) {
    let httpParams = {
      method: 'get',
      url: request_ENV + '/getOrderById',
      async: false,
      params: {
        shopName: window.Shopify.shop.split('.')[0],
        id
      },
      callback: function (result) {
      }
    }
    let result = await http(httpParams)
    return { ...JSON.parse(result) }
  }
  // 获取商品信息
  async function getProduct (id) {
    let httpParams = {
      method: 'get',
      url: request_ENV + '/getProductById',
      async: false,
      params: {
        shopName: window.Shopify.shop.split('.')[0],
        id
      },
      callback: function (result) {
      }
    }
    let result = await http(httpParams)
    let httpParams2 = {
      method: 'get',
      url: request_ENV + '/getCompanyInfo',
      async: false,
      params: {
        shopName: window.Shopify.shop.split('.')[0],
        id
      },
      callback: function (result) {
      }
    }
    let result2 = await http(httpParams2)
    return { ...JSON.parse(result), shopObj: { ...JSON.parse(result2) } }
  }




  // 初始化获取商店绑定信息
  function requestData () {
    // console.log('window.Shopify.shop',window.Shopify.shop);
    let httpParams = {
      method: 'get',
      url: request_ENV + '/getConfig',
      // url: 'https://apps.echatsoft.com:9443/testnode/shopify/getConfig',
      async: false,
      params: {
        shopName: window.Shopify.shop.split('.')[0]
      },
      callback: function (result) {
        console.log('result',);

        if (window.echatCustomer) {
          getMetaData(JSON.parse(result))
          // loadEchat(JSON.parse(result))
        } else {
          loadEchat(JSON.parse(result))
        }


      }
    }
    http(httpParams)
  }

  // 时间格式化
  function formatDate (date, fmt) {
    var currentDate = new Date(date);
    var o = {
      "M+": currentDate.getMonth() + 1, //月份
      "d+": currentDate.getDate(), //日
      "h+": currentDate.getHours(), //小时
      "m+": currentDate.getMinutes(), //分
      "s+": currentDate.getSeconds(), //秒
      "q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
      "S": currentDate.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  /** 页面加载好了之后根据参数 决定是否获取metadata 并发送请求 */
  function loadHandle () {
    requestData()
  }

  /**在所有加载echatjs的时机调用此方法  注意不要重复调用*/
  async function loadEchat (result, metaData) {
    if (!result) {
      return
    }
    let options = {}
    if (result.code == 200) {
      options = result.data
    }
    let shopName = window.Shopify.shop.split('.')[0]
    let initParam = {
      companyId: options.company_id || '531521',
      echatTag: options.echat_tag,
      lan: options.echat_lan,
    }
    // , routeEntranceId:options.route_entrance_id   
    if (metaData) {
      /** 有会员信息 */
      initParam.metaData = metaData
    } else {
      /** 没有会员信息 或者请求失败 */
    }
    if (window.shopifyShopInfo) {
      initParam.myData = JSON.stringify(window.shopifyShopInfo)
    }
    if (window.echatProduct) {
      let productInfo = await getProduct(window.echatProduct.id)
      let urlForVisitorHttp = `https://${productInfo.shopObj.domain}/products/${productInfo.handle}`
      let urlForStaffHttp = `https://apps.echatsoft.com:9443/build/#/shopify/product/${productInfo.id}?shopName=${shopName}&companyId=${options.company_id}&productId=${productInfo.id}&isEchat=1`

      //currencyObj[productInfo.currency]  货币符号
      const useImg = productInfo.image
        ? productInfo.image.src
        : 'https://apps.echatsoft.com:9443/image/product.png';
      let vitParams = {
        eventId: `${productInfo.id},${options.company_id}`,
        imageUrl: useImg,
        title: productInfo.title,
        content: `<div style='display: -webkit-box;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;-webkit-box-orient: vertical;'>${productInfo.body_html}<div>
        <div style='color:#666;line-height:20px'>原价：<span style='text-decoration:line-through'>${currencyObj[productInfo.shopObj.currency]}${productInfo.variants[0].compare_at_price}</span></div>
        <div style='color:#666;line-height:20px'>价格：<span style='color:red'>${currencyObj[productInfo.shopObj.currency]}${productInfo.variants[0].price}</span></div><div>${productInfo.tags}<div>`,
        memo: `<div><span style="display:flex;justify-content: end;">${formatDate(productInfo.updated_at, 'yyyy-MM-dd')}</span></div>`,
        urlForVisitor: `http('${urlForVisitorHttp}','blank')`,
        urlForStaff: `http('${urlForStaffHttp}','inner')`,
        // urlForStaff: `apiUrl(17784,'reload')`,
      }
      initParam.visEvt = JSON.stringify(vitParams)
      // initParam.myData = JSON.stringify(productInfo)
    }
    if (window.echatOrder) {
      let orderInfo = await getOrder(window.echatOrder.id)
      const useImg = 'https://apps.echatsoft.com:9443/image/order.png';

      let urlForVisitorHttp = `https://${orderInfo.shopObj.domain}/account/orders/${orderInfo.token}`;
      let urlForStaffHttp = `https://apps.echatsoft.com:9443/build/#/shopify/order/${orderInfo.id}?shopName=${shopName}&companyId=${options.company_id}&orderId=${orderInfo.id}&isEchat=1`
      let vitParams = {
        eventId: `${orderInfo.id},${options.company_id}`,
        imageUrl: useImg,
        title: '订单 ' + orderInfo.name,
        content: `<div style='display: -webkit-box;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;-webkit-box-orient: vertical;'>${orderInfo.note}<div>
        <div style='color:#666;line-height:20px'>价格：<span style='color:red'>${currencyObj[orderInfo.shopObj.currency]}${orderInfo.total_price}</span></div><div>${orderInfo.tags}<div>`,
        memo: `<div><span style="display:flex;justify-content: end;">${formatDate(orderInfo.created_at, 'yyyy-MM-dd')}</span></div>`,
        urlForVisitor: `http(${urlForVisitorHttp},'blank')`,
        urlForStaff: `http('${urlForStaffHttp}','inner')`,
      }
      initParam.visEvt = JSON.stringify(vitParams)
    }
    console.log('initParam', initParam);
    _echat('initParam', initParam);
    (function () {
      var echat = document.createElement('script');
      echat.type = 'text/javascript';
      echat.async = true;
      echat.id = 'echatmodulejs';
      echat.setAttribute('charset', 'UTF-8');
      echat.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.echatsoft.com/visitor/echat.js';
      // 测试环境与线上环境区别
      // echat.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'chats.rainbowred.com/visitor/echat.js';

      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(echat, s);
    })();
  }
  addEvent('load', loadHandle)
})();


