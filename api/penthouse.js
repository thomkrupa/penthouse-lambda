import penthouse from "penthouse";
import puppeteer from "puppeteer-core";
import fs from "fs-extra";
import chrome from "chrome-aws-lambda";
import { execFileSync } from "child_process";

const isDev = process.env.NOW_REGION === "dev1";

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getOptions() {
  if (isDev) {
    return {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  }

  return {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  };
}

function getFileContents({ url }) {
  return execFileSync("curl", ["--silent", "-L", url], {
    encoding: "utf8",
    maxBuffer: Infinity,
  });
}

async function getCriticalCss({ url, html, cssPath, cssString }) {
  if (!url) {
    await fs.writeFile("/tmp/page.html", html);
  }

  const cssContent = cssString || getFileContents({ url: cssPath });
  const options = await getOptions();
  const browser = await puppeteer.launch(options);

  const criticalCss = await penthouse({
    url: url || `file:///tmp/page.html`,
    cssString: cssContent,
    width: 1300,
    height: 900,
    keepLargerMediaQueries: true,
    puppeteer: {
      getBrowser: () => browser,
    },
  });

  return criticalCss;
}

export default async (req, res) => {
  const { url, cssPath, html, cssString } = req.body || {};

  if (!html && !url) {
    return res.status(400).send("url or html is required");
  }

  if (!cssPath && !cssString) {
    return res.status(400).send("cssPath or cssString is required");
  }

  const criticalCss = await getCriticalCss({ url, html, cssPath, cssString });

  return res.status(200).json({ criticalCss });
};
