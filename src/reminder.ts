import { Config } from "./config";
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

  constructor(private config: Config) {
    this.parser = new Parser(config, this.store);
    this.logger = new Logger(config, this.store);
  }
  public run() {
    this.parser.parse();
    this.logger.log();
  }
}
