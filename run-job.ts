import * as puppeteer from "puppeteer";
import * as TelegramBot from "node-telegram-bot-api";
import * as dayjs from "dayjs";

import { getChrome } from "./chrome-script";
import sources from "./sources";

/**
 * Config
 */

const iPhone = puppeteer.devices["iPhone 6"];

const token = process.env.TOKEN;
const chatId = process.env.CHAT_ID;

const runJob = async () => {
  const bot = new TelegramBot(token);
  await bot.sendMessage(chatId, `=====${dayjs().format("YYYY-MM-DD")}=====`);

  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint
  });
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.setDefaultNavigationTimeout(0);

  for (let index = 0; index < sources.length; index++) {
    const element = sources[index];

    await page.goto(element.url);
    const img = await page.screenshot();

    await bot.sendPhoto(chatId, img, { caption: element.title });
  }

  await bot.sendMessage(chatId, "====================");
};

export default runJob;
