import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import EchatPremission from "./echatPremission";

export default function HomePage() {
  return (
    <EchatPremission />
  );
}
