import fs = require("fs");
import chalk = require("chalk");
import { Store, Version } from "./parser/index";

export class Logger {
  constructor(private loggerPath: string, private store: Store) {
    if (this.findLoggerFile()) {
      const freshVersions = this.getFreshVersions();
      this.log(freshVersions);
    }
    this.wrtieLoggerFile();
  }

  private getFreshVersions() {
    const index = parseInt(fs.readFileSync(this.loggerPath).toString());
    return this.store.getFreshVersions(index);
  }

  private findLoggerFile(): boolean {
    return fs.existsSync(this.loggerPath);
  }

  private wrtieLoggerFile(): void {
    fs.writeFileSync(this.loggerPath, 0);
  }

  public log(versions: Version[]) {
    versions.forEach(version => {
      this.displayVersion(version);
      console.log("#".repeat(20) + "\n");
    });
  }

  private displayVersion(version: Version) {
    const log = console.log;
    log(chalk.default.bgBlue.white(version.title));
    version.changes.forEach(change => {
      log("\n" + chalk.default.greenBright(change.type));
      change.items.forEach(item => {
        log(item);
      });
    });
  }
}
