import { Context, Callback } from "aws-lambda";

import * as puppeteer from "puppeteer";
import * as TelegramBot from "node-telegram-bot-api";
import * as dayjs from "dayjs";

import { getChrome } from "./chrome-script";

/**
 * Config
 */

const iPhone = puppeteer.devices["iPhone 6"];

const token = process.env.TOKEN;
const chatId = process.env.CHAT_ID;

const sources = [
  {
    url: "https://www.mingpao.com/",
    title: "mingpao"
  },
  {
    url: "https://hk.appledaily.com",
    title: "appledaily"
  },
  {
    url: "https://orientaldaily.on.cc/",
    title: "orientaldaily"
  },
  // {
  //   url: "https://www.hkej.com/",
  //   title: "hkej"
  // },
  {
    url: "https://www.hket.com",
    title: "hket"
  },
  {
    url: "https://www.hk01.com",
    title: "hk01"
  },
  {
    url: "http://std.stheadline.com/",
    title: "stheadline"
  },
  {
    url: "https://news.rthk.hk/rthk/ch/",
    title: "rthk"
  },
  {
    url: "http://www.takungpao.com.hk/hongkong/",
    title: "takungpao"
  },
  {
    url: "https://www.scmp.com/",
    title: "scmp"
  }
];

export const run = async (event, context: Context, callback: Callback) => {
  console.log("Start");

  const bot = new TelegramBot(token);

  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint
  });
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.setDefaultNavigationTimeout(0);

  await bot.sendMessage(chatId, `=====${dayjs().format("YYYY-MM-DD")}=====`);

  for (let index = 0; index < sources.length; index++) {
    const element = sources[index];

    await page.goto(element.url);
    const img = await page.screenshot();

    await bot.sendPhoto(chatId, img, { caption: element.title });
  }

  await bot.sendMessage(chatId, "====================");

  console.log("Done");

  callback(null, "success");
};
