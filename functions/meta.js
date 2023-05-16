const chromium = require("@sparticuz/chromium");
const puppeteer = require('puppeteer-core');

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  require('dotenv').config()
}

exports.handler = async function(event, context) {
  try {
    const executablePath = process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath;
    const browser = await puppeteer.launch({
      executablePath,
      headless: !isDev,
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      args: chromium.args,
    });
  
    const page = await browser.newPage();
    // await page.setViewport({width: 500, height: 500});
    await page.goto("https://dumpoir.com/v/fifthavenue", { waitUntil: "networkidle2" });
    await page.waitForSelector("div.content__list", { timeout: 9000 });

    const newList = await page.$$eval("div.content__list > div", (list) => {
      const _list = list.map(oneItem => {
        return oneItem.innerText;
      });
      return _list;
    });

    if (isDev) {
      await page.waitForTimeout(2000);
    }

    await browser.close();

    const value = { newList };
    return {
      statusCode: 200,
      body: JSON.stringify({ note: 'Ok', value }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ note: error?.message, error: String(error) }),
    };
  };
};
