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

export const puppeteerOptions: puppeteer.LaunchOptions = {
  headless: true,
  devtools: false,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "-–disable-dev-shm-usage",
    "--disable-gpu",
    "--no-first-run",
    "--no-zygote",
    "--single-process",
    "--proxy-server=163.43.108.114:8080",
    // "--lang=ja",
  ],
};
