import path = require("path");
import fs = require("fs");
import { Arguments } from "yargs";

const defaultChangelogPath = "CHANGELOG";
const defaultLoggerPath = ".changelog-reminder";

export const defaultConfigPath = "changelog-reminder.js";

export interface Argv {
  config: string;
}

export interface ConfigOptions {
  confirm: boolean;
  showIntro: boolean;
  logger: string;
  changelog: string;
}

export class Config implements ConfigOptions {
  confirm: boolean = false;
  showIntro: boolean = true;
  logger: string = defaultLoggerPath;
  changelog: string = defaultChangelogPath;

  constructor(
    argv: Argv = {
      config: defaultConfigPath
    }
  ) {
    const cwd = process.cwd();
    const configPath = path.resolve(cwd, argv.config);

    this.loadConfig(configPath);
    this.changelog = path.resolve(cwd, this.changelog);
    this.logger = path.resolve(cwd, this.logger);
  }

  private loadConfig(configPath: string) {
    if (fs.existsSync(configPath)) {
      const configFile: ConfigOptions = require(configPath);
      this.mergeOptions(configFile);
    }
  }

  private mergeOptions(configFile: ConfigOptions) {
    Object.keys(configFile).map(key => {
      this[key] = configFile[key] === undefined ? this[key] : configFile[key];
    });
  }
}
