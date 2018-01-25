import { Logger } from "./logger";
import { Parser, Store } from "./parser/index";

export class ChangeReminder {
  private parser: Parser;
  private store: Store = new Store();
  private logger: Logger;
  constructor(public changelogPath: string, public loggerPath: string) {
    this.parser = new Parser(changelogPath, this.store);
  }
  public run() {
    this.parser.parse();
    this.logger = new Logger(this.loggerPath, this.store);
  }
}
