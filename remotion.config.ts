import { Config } from "@remotion/cli/config";
import fs from "node:fs";

const explicitBrowser = process.env.BROWSER_EXECUTABLE;
const macChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

if (explicitBrowser && fs.existsSync(explicitBrowser)) {
  Config.setBrowserExecutable(explicitBrowser);
} else if (process.platform === "darwin" && fs.existsSync(macChrome)) {
  Config.setBrowserExecutable(macChrome);
}

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
