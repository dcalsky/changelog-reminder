import * as fs from "fs";
import * as chalk from "chalk";
import { Store, Version } from "./parser";
import { Output } from "./output";
import { Config } from "./config";
const readline = require("readline");
const o = new Output();
const log = console.log;

export class Logger {
  constructor(private config: Config, private store: Store) {}

  private getFreshVersions() {
    const title = this.findLoggerFile() ? fs.readFileSync(this.config.logger).toString() : "";
    return this.store.getFreshVersions(title);
  }

  private findLoggerFile(): boolean {
    return fs.existsSync(this.config.logger);
  }

  private wrtieLoggerFile(): void {
    const latestVersion = this.store.getLatestVersion();
    fs.writeFileSync(this.config.logger, latestVersion.title);
  }

  public log() {
    const freshVersions = this.getFreshVersions();
    // If no fresh versions, it's unnecessary to enquire.
    if (freshVersions.length === 0) {
      o.showNochange();
    }
    this.config.showIntro && this.displayIntro();
    freshVersions.forEach(version => {
      this.displayVersion(version);
    });

    if (freshVersions.length === 0) return;
    if (this.config.confirm) {
      this.inquiry();
    } else {
      this.wrtieLoggerFile();
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
    rl.question("Changes acknowledged. (Y/n) ", answer => {
      if (answer != "Y") {
        this.log();
      } else {
        this.wrtieLoggerFile();
        rl.close();
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
