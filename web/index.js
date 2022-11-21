// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import { setupGDPRWebHooks } from "./gdpr.js";
import productCreator from "./helpers/product-creator.js";
import redirectToAuth from "./helpers/redirect-to-auth.js";
import { BillingInterval } from "./helpers/ensure-billing.js";
import { AppInstallations } from "./app_installations.js";

import getAssets from './helpers/assets-list.js'
// import { setConfig } from './helpers/companyConfig.js'
import crypto from 'crypto'
// const baseReqUrl = 'https://apps.echatsoft.com:9443/testnode'
const baseReqUrl = 'https://middle-node.echatsoft.com'
// const crypto = require('crypto');
// import * as bodyParser from 'body-parser'
import db from './db/connection.js'
import request from "request";
// const request = require('request');

const USE_ONLINE_TOKENS = false;

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

const DB_PATH = `${process.cwd()}/database.sqlite`;
// 测试环境appId
// const appId = 'GX2ZFR4EYAAUXMLDFD5PBSPYDRYXHLRT'
const appId = 'VQJOST4GQSMHVUDXKR5FYSFGBYEMMH9S'
const appSecret = 'XUsPxNGJ'
// 测试环境密钥
// const appSecret = '32FLbszW'
function getSignatureCode (token, timestamp, nonce) {
  return crypto.createHash('sha1')
    .update([token, timestamp, nonce].sort().join(''))
    .digest('hex');
}
// const mysql = require('mysql');
// import * as mysql from 'mysql2'
/**
     * 随机生成字符串
     * @param len 指定生成字符串长度
     */
async function getRandomString (len, type) {
  let flag = false
  let _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789',
    min = 0,
    max = _charStr.length - 1,
    _str = '';                    //定义随机字符串 变量
  //判断是否指定长度，否则默认长度为15
  len = len || 15;
  //循环生成字符串
  for (var i = 0, index; i < len; i++) {
    index = (function (randomIndexFunc, i) {
      return randomIndexFunc(min, max, i, randomIndexFunc);
    })(function (min, max, i, _self) {
      let indexTemp = Math.floor(Math.random() * (max - min + 1) + min),
        numStart = _charStr.length - 10;
      if (i == 0 && indexTemp >= numStart) {
        indexTemp = _self(min, max, i, _self);
      }
      return indexTemp;
    }, i);
    _str += _charStr[index];
  }
  let sql
  if (type == 1) {
    sql = 'select *  from `company_config` where app_id = ?;'
  } else if (type == 2) {
    sql = 'select *  from `company_config` where app_sceret = ?;'
  }
  let rows = await db(sql, [_str])
  if (rows && rows.length > 0) { // 存在重新生成
    getRandomString(32, 1)
  } else {
    return _str
  }
}
// 'read_all_orders'
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: [...process.env.SCOPES.split(","), 'read_customers', 'read_locations', 'read_fulfillments', 'read_inventory', 'read_orders', 'read_products', 'read_product_listings'],
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME: process.env.HOST.split("://")[0],
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
});

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/api/webhooks",
  webhookHandler: async (_topic, shop, _body) => {
    await AppInstallations.delete(shop);
  },
});

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
  required: false,
  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  // chargeName: "My Shopify One-Time Charge",
  // amount: 5.0,
  // currencyCode: "USD",
  // interval: BillingInterval.OneTime,
};

// This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint
// in the “GDPR mandatory webhooks” section in the “App setup” tab, and customize
// the code when you store customer data.
//
// More details can be found on shopify.dev:
// https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
setupGDPRWebHooks("/api/webhooks");

// export for test use only
export async function createServer (
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  billingSettings = BILLING_SETTINGS
) {
  const app = express();

  app.set("use-online-tokens", USE_ONLINE_TOKENS);
  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app, {
    billing: billingSettings,
  });
  // app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  // app.use(bodyParser.json())
  // Do not call app.use(express.json()) before processing webhooks with
  // Shopify.Webhooks.Registry.process().
  // See https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers
  // for more details.
  app.post("/api/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (e) {
      console.log(`Failed to process webhook: ${e.message}`);
      if (!res.headersSent) {
        res.status(500).send(e.message);
      }
    }
  });

  // All endpoints after this point will require an active session
  app.use(
    "/api/*",
    verifyRequest(app, {
      billing: billingSettings,
    })
  );
  // app.use(
  //   "/extension/*",
  //   function(req,res,next){
  //     res.header('authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczpcL1wvdGVzdG1lY2hhdC5teXNob3BpZnkuY29tXC9hZG1pbiIsImRlc3QiOiJodHRwczpcL1wvdGVzdG1lY2hhdC5teXNob3BpZnkuY29tIiwiYXVkIjoiOWY3MzU5YWJlZWEzMjEwNjEwMGM1NWQ2Y2RkYjMwZjQiLCJzdWIiOiI3NDMwODYxNjI4MiIsImV4cCI6MTY2MjM0OTI3NiwibmJmIjoxNjYyMzQ5MjE2LCJpYXQiOjE2NjIzNDkyMTYsImp0aSI6IjY1OTI5MmU5LWJjN2ItNDgzZS1iODA4LWM1ODE2YWY2YWE3MSIsInNpZCI6IjU0YTAwMTdkMDA3YzZiNWMxNzRmN2ZmMDhkZmVhZDI1OTE1MGNhZWEzM2QzMGIxZTRmMWM5ZjA4NDEyOGM1YzkifQ.nDx2pzfOstY11wJR4Pl_T1K95Wv_CnGgvesTSHKLFOA')
  //     next()
  //   }
  // );
  app.use(express.json());

  app.get("/api/products/count", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  });

  app.get("/api/products/create", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;

    try {
      await productCreator(session);
    } catch (e) {
      console.log(`Failed to process products/create: ${e.message}`);
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });
  app.get("/api/upDateAssets", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    // console.log('session',session);
    const result = await getAssets(session)
    res.send({ success: 200, data: result })
    // // let status = 200;
    // // let error = null;

    // // try {
    // //   await productCreator(session);
    // // } catch (e) {
    // //   console.log(`Failed to process products/create: ${e.message}`);
    // //   status = 500;
    // //   error = e.message;
    // // }
    // res.send({ success: 200, data:'测试' });
  });
  /*
  根据authCode获取echat公司配置信息，更新数据库
*/
  app.get('/api/getEchatCompanyInfo', async (req, res) => {
    let session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const shop = session.shop.split('.')[0]
    const timestamp = Math.floor(Date.now() / 1000)
    const nonce = Math.random().toString(36).slice(2).slice(0, 8)
    // 生成加密排序 signatrue
    const signatrue = await getSignatureCode(appSecret, timestamp, nonce)

    const params = {
      appId,
      tm: timestamp,
      nonce,
      signatrue,
      authCode: req.query.authCode
    }
    // 获取第三方接口公司信息
    // const requestUrl = `https://tappauth.rainbowred.com/lc/getInfo?authCode=${params.authCode}&appId=${params.appId}&tm=${params.tm}&nonce=${params.nonce}&signature=${params.signatrue}`
    const requestUrl = `https://appauth.echatsoft.com/lc/getInfo?authCode=${params.authCode}&appId=${params.appId}&tm=${params.tm}&nonce=${params.nonce}&signature=${params.signatrue}`
    console.log('requestUrl',requestUrl);
    // 获取第三方接口公司信息
    request(requestUrl, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const result = JSON.parse(body)
        console.log('body',result) // 请求成功的处理逻辑
        // 绑定公司信息参数
        var url = `${baseReqUrl}/shopify/updateCompanyConfig`;
        var requestData = {
          shopName: shop,
          companyId: result.result['companyId'],
          authCode: result.result['authCode'],
          companyName: result.result['companyName'],
          companyLogo: result.result['companyLogo'],
          appId: result.result['appId'],
          aesKey: result.result['aesKey'],
          token: result.result['token'],
          cryptType: result.result['cryptType'],
          staticServer: result.result['staticServer'],
          apiServer: result.result['apiServer'],
        };
        console.log('requestData',requestData)
        // 更新绑定公司信息
        request({
          url: url,
          method: "POST",
          json: true,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(requestData)
        }, function (error2, response2, body2) {
          if (!error2 && response2.statusCode == 200) {
            // console.log(body2) // 请求成功的处理逻辑
            if (body2.code == 200) {
              res.json({ code: 200, data: body2.data })
              // 返回结果 前端修改状态为已授权
              res.json(result)
            }
          }
        });



      } else {
        res.json({ code: 500, message: '请求失败，请联系管理员' })
      }
    })
  })
  app.post("/api/updateConfig", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    // const result = await setConfig(session)
    let shopName = session.shop.split('.')[0]
    var url = `${baseReqUrl}/shopify/updateConfig`;
    var requestData = {
      shopName,
      companyId: req.body.result['companyId'],
      appId: req.body['appId'],
      appSceret: req.body['appSceret'],
      routeEntranceId: req.body['routeEntranceId'],
      echatTag: req.body['echatTag'],
      echatLan: req.body['echatLan'],
      shopApiKey: process.env.SHOPIFY_API_KEY,
      shopApiSecretKey: process.env.SHOPIFY_API_SECRET,
      shopApiAccessToken: session?.accessToken,
    };
    request({
      url: url,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(requestData)
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body) // 请求成功的处理逻辑
        if (body.code == 200) {
          res.json({ code: 200, data: body.data })
        }
      }
    });
    // let sql1 = 'select count(1) count from `company_config` where shop_name = ?;'

    // let rows = await db(sql1, [shopName])
    // if (rows[0].count > 0) {
    //   const sql2 = 'UPDATE `company_config` SET  `company_id`=?,`app_id`=?,`app_sceret`=?,`route_entrance_id`=?,`echat_tag`=?, `echat_lan`=? , `shop_api_key`=?, `shop_api_secret_key`=?, `shop_api_access_token`=? WHERE `shop_name`=?;'
    //   let params2 = [req.body.result['companyId'] || '531521', req.body['appId'], req.body['appSceret'], req.body['routeEntranceId'], req.body['echatTag'], req.body['echatLan'], process.env.SHOPIFY_API_KEY, process.env.SHOPIFY_API_SECRET, session?.accessToken, req.body['shopName'],]
    //   db(sql2, params2).then((rows) => {
    //     res.json({ code: 200, data: rows })
    //   })
    // } else {
    //   const sql3 = 'INSERT INTO `company_config`(`shop_name`,`company_id`,`app_id`,`app_sceret`,`route_entrance_id`,`echat_tag`, `echat_lan`, `shop_api_key`, `shop_api_secret_key`, `shop_api_access_token`) VALUES(?,?,?,?,?,?,?,?,?,?);'
    //   let params = [req.body['shopName'], req.body['companyId'] || '531521', req.body['routeEntranceId'], req.body['echatTag'], req.body['echatLan'], process.env.SHOPIFY_API_KEY, process.env.SHOPIFY_API_SECRET, session?.accessToken]
    //   db(sql3, params).then(rows => {
    //     res.json({ code: 200, data: rows })
    //   })
    // }
  });
  app.get('/api/getConfig', async (req, res) => {
    let session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let shopName = session.shop.split('.')[0]
    // 授权登录重定向地址
    // const redirectUrl = 'https://' + session.shop + '/admin/apps/echat'
    const redirectUrl = 'https://' + session.shop + '/admin/apps/'+Shopify.Context.API_KEY
    // const requestUrl = `http://127.0.0.1:3000/shopify/getConfig?shopName=${shopName}`
    const requestUrl = `${baseReqUrl}/shopify/getConfig?shopName=${shopName}`
    request(requestUrl, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const result = JSON.parse(body).data
        const obj = {
          shopName: result.shop_name,
          companyId: result.company_id,
          appId: result.app_id,
          appSceret: result.app_sceret,
          routeEntranceId: result.route_entrance_id,
          echatTag: result.echat_tag,
          echatLan: result.echat_lan,
          redirectUrl,
          originSession: { ...session, shop_key: process.env.SHOPIFY_API_KEY, shop_secret: process.env.SHOPIFY_API_SECRET }
        }
        res.json({ code: 200, data: obj })
      } else {
        res.json({ code: 500, message: '请求失败，请联系管理员' })
      }
    })
    // db(sql, [shopName]).then(async rows => {
    //   if (rows && rows.length > 0) {
    //     const obj = {
    //       shopName: rows[0].shop_name,
    //       companyId: rows[0].company_id,
    //       appId: rows[0].app_id,
    //       appSceret: rows[0].app_sceret,
    //       routeEntranceId: rows[0].route_entrance_id,
    //       echatTag: rows[0].echat_tag,
    //       echatLan: rows[0].echat_lan,
    //       redirectUrl,
    //       originSession: { ...session, shop_key: process.env.SHOPIFY_API_KEY, shop_secret: process.env.SHOPIFY_API_SECRET }
    //     }
    //     res.json({ code: 200, data: obj })
    //   } else {
    //     res.json({ code: 200, data: {} })
    //   }
    // })
  })

  // All endpoints after this point will have access to a request.body
  // attribute, as a result of the express.json() middleware


  app.use((req, res, next) => {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${encodeURIComponent(
          shop
        )} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  if (isProd) {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
  }

  app.use("/*", async (req, res, next) => {

    if (typeof req.query.shop !== "string") {
      res.status(500);
      return res.send("No shop provided");
    }

    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    const appInstalled = await AppInstallations.includes(shop);

    if (!appInstalled) {
      return redirectToAuth(req, res, app);
    }

    if (Shopify.Context.IS_EMBEDDED_APP && req.query.embedded !== "1") {
      const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req);

      return res.redirect(embeddedUrl + req.path);
    }

    const htmlFile = join(
      isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
      "index.html"
    );

    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(readFileSync(htmlFile));
  });

  return { app };
}
console.log('PORT', PORT);
createServer().then(({ app }) => app.listen(PORT));
