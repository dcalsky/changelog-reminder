import * as fs from "fs";
import * as chalk from "chalk";
import { Store, Version } from "./parser";
import { Output } from "./output";
const readline = require("readline");
const o = new Output();
const log = console.log;

interface LoggerOptions {
  insure: boolean;
  intro: boolean;
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
    });

    // If no fresh versions, it's unnecessary to enquire.
    if (freshVersions.length === 0) {
      o.showNochange();
    }
    this.options.intro && this.displayIntro();

    if (freshVersions.length > 0 ) {
      // If answer is Y, record this current version
      this.options.insure && this.inquiry()
    }
  }

  private displayIntro() {
    o.showIntro(this.store.intro);
  }

  private inquiry() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Do you have known all changes? (Y/n) ", answer => {
      if (answer != "Y") {
        this.log();
        return false;
      } else {
        this.wrtieLoggerFile();
        rl.close();
        return true;
      }
    });
  }

  private displayVersion(version: Version) {
    o.addVersion(version.title);
    version.changes.forEach(change => {
      o.addChange(change.type, change.items);
    });
    o.show();
  }
}
