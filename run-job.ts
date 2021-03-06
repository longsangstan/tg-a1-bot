import * as puppeteer from "puppeteer";
import * as TelegramBot from "node-telegram-bot-api";
import moment = require("moment-timezone");

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
  await bot.sendMessage(
    chatId,
    `=====${moment.tz("Asia/Hong_Kong").format("YYYY-MM-DD HH:mm")}=====`
  );

  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint
  });
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.setDefaultNavigationTimeout(0);

  for (let i = 0; i < sources.length; i++) {
    await bot.sendMessage(chatId, `=====${sources[i].category}=====`);

    for (let j = 0; j < sources[i].list.length; j++) {
      const element = sources[i].list[j];

      await page.goto(element.url);
      const img = await page.screenshot();

      await bot.sendPhoto(chatId, img, {
        caption: `${element.title}\n${element.url}`
      });
    }
  }

  await bot.sendMessage(chatId, "====================");
};

export default runJob;
