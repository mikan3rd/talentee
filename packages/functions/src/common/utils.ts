import axios, { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { LaunchOptions } from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin = require("puppeteer-extra-plugin-stealth");

import {
  PROXY_HOST,
  PROXY_HOST_2,
  PROXY_PASSWORD,
  PROXY_PASSWORD_2,
  PROXY_PORT,
  PROXY_PORT_2,
  PROXY_USERNAME,
  PROXY_USERNAME_2,
} from "./config";

type ProxyType = "none" | "normal" | "exclusive";

export const toBufferJson = (data) => {
  const dataJson = JSON.stringify(data);
  const dataBuffer = Buffer.from(dataJson);
  return dataBuffer;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chunk = (arr: any[], len: number) => {
  const chunks = [];
  let i = 0;
  const n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
};

export const UserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36";

export const puppeteerSetup = async (proxyType: ProxyType = "none") => {
  const args = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "-–disable-dev-shm-usage",
    "--disable-gpu",
    "--no-first-run",
    "--no-zygote",
    "--single-process",
    "--lang=ja",
  ];

  // -w "%{time_starttransfer}\n"
  if (proxyType === "normal") {
    const proxy = `${PROXY_HOST_2}:${PROXY_PORT_2}`;
    args.push(`--proxy-server=${proxy}`);
  }
  if (proxyType === "exclusive") {
    const proxy = `${PROXY_HOST}:${PROXY_PORT}`;
    args.push(`--proxy-server=${proxy}`);
  }

  const options: LaunchOptions = {
    // ignoreHTTPSErrors: true,
    headless: true,
    devtools: false,
    args,
  };

  const browser = await puppeteerExtra.use(StealthPlugin()).launch(options);
  const page = await browser.newPage();

  if (proxyType === "normal") {
    await page.authenticate({ username: PROXY_USERNAME_2, password: PROXY_PASSWORD_2 });
  }
  if (proxyType === "exclusive") {
    await page.authenticate({ username: PROXY_USERNAME, password: PROXY_PASSWORD });
  }

  await page.setExtraHTTPHeaders({ "Accept-Language": "ja-JP" });
  await page.setUserAgent(UserAgent);

  return { browser, page };
};

export const axiosSetup = (proxyType: ProxyType = "none") => {
  const config: AxiosRequestConfig = {
    headers: { "User-Agent": UserAgent },
    maxRedirects: 0,
  };

  if (proxyType === "normal") {
    config.proxy = false;
    config.httpsAgent = new HttpsProxyAgent({
      host: PROXY_HOST_2,
      port: PROXY_PORT_2,
      auth: `${PROXY_USERNAME_2}:${PROXY_PASSWORD_2}`,
    });
  }
  if (proxyType === "exclusive") {
    config.proxy = false;
    config.httpsAgent = new HttpsProxyAgent({
      host: PROXY_HOST,
      port: PROXY_PORT,
      auth: `${PROXY_USERNAME}:${PROXY_PASSWORD}`,
    });
  }

  return axios.create(config);
};

export const groupByObject = <K, V>(
  array: readonly V[],
  getKey: (cur: V, idx: number, src: readonly V[]) => K,
): [K, V[]][] =>
  Array.from(
    array.reduce((map, cur, idx, src) => {
      const key = getKey(cur, idx, src);
      const list = map.get(key);
      if (list) list.push(cur);
      else map.set(key, [cur]);
      return map;
    }, new Map<K, V[]>()),
  );

export const toUnitString = (targetNum: number) => {
  const unitArray = ["万", "億", "兆"];
  const magnification = 10000;

  let unitNum = 10000;
  if (targetNum < unitNum) {
    return targetNum.toLocaleString();
  }

  let convertedString = "";
  for (const unit of unitArray) {
    if (unitNum * magnification < targetNum) {
      unitNum *= magnification;
      continue;
    }
    convertedString = `${(targetNum / unitNum).toFixed(1).replace(".0", "")}${unit}`;
    break;
  }

  if (!convertedString) {
    const lastArray = unitArray[unitArray.length - 1];
    convertedString = `${Math.round((targetNum / unitNum) * magnification).toLocaleString()}${lastArray}`;
  }

  return convertedString;
};
