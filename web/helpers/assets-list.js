// import { LATEST_API_VERSION } from "@shopify/shopify-api";
import { Theme,Asset  } from '@shopify/shopify-api/dist/rest-resources/2022-07/index.js';

// import {} from `@shopify/shopify-api/dist/rest-resources/${LATEST_API_VERSION}/index.js`;

export default async function getAssets (session){
  const themeList = await Theme.all({
    session: session,
  });
 
  // console.log('themeList',themeList);
   
  const assetsList = await Asset.all({
    session: session,
    theme_id: themeList[0].id,
    // asset: {"key": "assets/echat.js"},
  });
  return assetsList

}