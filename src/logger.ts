import * as fs from "fs";
import * as chalk from "chalk";
import { Store, Version } from "./parser";

export class Logger {
  constructor(private loggerPath: string, private store: Store) {
    const freshVersions = this.getFreshVersions();
    this.log(freshVersions);
    this.wrtieLoggerFile();
  }

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

  public log(versions: Version[]) {
    versions.forEach(version => {
      this.displayVersion(version);
      console.log("#".repeat(20) + "\n");
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
