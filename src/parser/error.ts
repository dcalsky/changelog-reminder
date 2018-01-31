import { ParserStatus } from "./parser";
import chalk = require("chalk");

export class ParseError extends Error {
  constructor(status: ParserStatus, expect?: object | any, actual?: string) {
    super();
    const messagePrefix = `${chalk.default.bold.red("Parsing error")}: `;

    if (expect && actual) {
      expect =
        expect instanceof Object ? Object.keys(expect).join(", ") : expect;
      this.message = `expect ${expect}, but got '${chalk.default.bold(actual)}' `;
    }
    this.message = messagePrefix + this.message + `while parsing ${chalk.default.bold(status)}.`;
  }
}
