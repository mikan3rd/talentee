import * as puppeteer from "puppeteer";

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
    args.push("--proxy-server=163.43.108.114:8080");
  }
  const options: puppeteer.LaunchOptions = {
    headless: true,
    devtools: false,
    args,
  };
  return options;
};
