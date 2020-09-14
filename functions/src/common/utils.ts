import puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin = require("puppeteer-extra-plugin-stealth");
import axios, { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

import { PROXY_HOST, PROXY_PASSWORD, PROXY_PORT, PROXY_USERNAME } from "./config";

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

export const puppeteerSetup = async (useProxy = false) => {
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
  if (useProxy) {
    const proxy = `${PROXY_HOST}:${PROXY_PORT}`;
    // -w "%{time_starttransfer}\n"
    args.push(`--proxy-server=${proxy}`);
  }
  const options: puppeteer.LaunchOptions = {
    // ignoreHTTPSErrors: true,
    headless: true,
    devtools: false,
    args,
  };

  const browser = await puppeteerExtra.use(StealthPlugin()).launch(options);
  const page = await browser.newPage();

  if (useProxy) {
    await page.authenticate({ username: PROXY_USERNAME, password: PROXY_PASSWORD });
  }

  await page.setExtraHTTPHeaders({ "Accept-Language": "ja-JP" });
  await page.setUserAgent(UserAgent);

  return { browser, page };
};

export const axiosSetup = (useProxy = false) => {
  const config: AxiosRequestConfig = {
    headers: { "User-Agent": UserAgent },
    maxRedirects: 0,
  };

  if (useProxy) {
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
