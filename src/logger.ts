import * as fs from "fs";
import * as chalk from "chalk";
import { Store, Version } from "./parser";
const readline = require("readline");

interface LoggerOptions {
  insure: boolean;
}

export class Logger {
  constructor(private loggerPath: string, private store: Store, private options: LoggerOptions) {}

  private getFreshVersions() {
    const title = this.findLoggerFile() ? fs.readFileSync(this.loggerPath).toString() : "";
    return this.store.getFreshVersions(title);
  }

  private findLoggerFile(): boolean {
    return fs.existsSync(this.loggerPath);
  }

  private wrtieLoggerFile(): void {
    const latestVersion = this.store.getLatestVersion();
    fs.writeFileSync(this.loggerPath, latestVersion.title);
  }

  public log() {
    const freshVersions = this.getFreshVersions();
    freshVersions.forEach(version => {
      this.displayVersion(version);
      console.log("#".repeat(20) + "\n");
    });
    // If no fresh versions, it's unnecessary to enquire.
    if (freshVersions.length === 0) {
      console.log(chalk.green("No any change."))
      return
    }
    if (this.options.insure && freshVersions.length > 0) {
      this.inquiry();
    }
  }

  private inquiry() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Do you have known all changes? (Y/n) ", answer => {
      if (answer != "Y") {
        this.log();
      } else {
        // If answer is Y, record this current version
        this.wrtieLoggerFile();
        rl.close();
      }
    });
  }

  private displayVersion(version: Version) {
    const log = console.log;
    log(chalk.bgYellow(version.title));
    version.changes.forEach(change => {
      log("\n" + chalk.default.greenBright(change.type));
      change.items.forEach(item => {
        log(item);
      });
    });
  }
}
