import path = require("path");
import fs = require("fs");
import * as yaml from "js-yaml";
import { Arguments } from "yargs";

const defaultChangelogPath = "CHANGELOG";
const defaultLoggerPath = ".changelog-reminder";
const defaultConfigPath = "changelog-reminder.yaml";

export interface Argv {
  config: string;
}

export class Config {
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
    this.loadConfig(argv.config);

    this.changelog = path.join(cwd, this.changelog);
    this.logger = path.join(cwd, this.logger);
  }

  private loadConfig(relativePath: string) {
    const configPath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(configPath)) {
      const configFile = yaml.safeLoad(fs.readFileSync(configPath, "utf8"));
      Object.keys(configFile).map(key => {
        this[key] = configFile[key];
      });
    }
  }
}
