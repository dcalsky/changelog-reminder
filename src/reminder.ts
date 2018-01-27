import { Logger } from "./logger";
import { Parser, Store } from "./parser";

interface Options {
  insure: boolean;
  intro: boolean;
}

export class Reminder {
  private parser: Parser;
  private store: Store = new Store();
  private logger: Logger;
  private options: Options;

  constructor(public changelogPath: string, public loggerPath: string, options?: Options) {
    this.options = options || {
      insure: false,
      intro: false
    };
    this.parser = new Parser(changelogPath, this.store, this.options);
    this.logger = new Logger(this.loggerPath, this.store, this.options);
  }
  public run() {
    this.parser.parse();
    this.logger.log();
  }
}
