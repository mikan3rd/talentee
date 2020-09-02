import * as puppeteer from "puppeteer";

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

export const getPuppeteerOptions = (useProxy?: boolean) => {
  const args = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "-–disable-dev-shm-usage",
    "--disable-gpu",
    "--no-first-run",
    "--no-zygote",
    "--single-process",
    // "--lang=ja",
  ];
  if (useProxy) {
    args.push("--proxy-server=157.7.223.210:3128");
  }
  const options: puppeteer.LaunchOptions = {
    headless: true,
    devtools: false,
    args,
  };
  return options;
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
