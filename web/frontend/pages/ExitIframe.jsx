import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge, Loading } from "@shopify/app-bridge-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ExitIframe() {
  const app = useAppBridge();
  const { search } = useLocation();

  useEffect(() => {
    console.log("==========app:",app);
    console.log("==========search:",search);
    if (!!app && !!search) {
      const params = new URLSearchParams(search);
      const redirectUri = params.get("redirectUri");
      const url = new URL(decodeURIComponent(redirectUri));
      console.log("==========params:",params);
      console.log("==========url:",url);
      console.log("==========location:", location);
      if (url.hostname === location.hostname) {
        const redirect = Redirect.create(app);
        console.log("==========redirect:", redirect);
        redirect.dispatch(
          Redirect.Action.REMOTE,
          decodeURIComponent(redirectUri)
        );
      }
    }
  }, [app, search]);

  return <Loading />;
}
