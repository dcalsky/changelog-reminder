import * as yargs from "yargs";
import * as path from "path";
import { Reminder } from "./reminder";

const defaultChangelogFilename = "CHANGELOG";
const defaultLoggerFilename = ".changelogger";

const argv = yargs
  .usage("Usage: $0 [options]")
  .options({
    changelogFilename: {
      alias: "c",
      description: "<filename> changelog name",
      requiresArg: true,
      required: false,
      default: defaultChangelogFilename,
      string: true
    },
    loggerFilename: {
      alias: "l",
      description: "<filename> logger file name",
      requiresArg: true,
      required: false,
      default: defaultLoggerFilename,
      string: true
    },
    intro: {
      alias: "v",
      description: "<boolean> introduce changelog",
      required: true,
      boolean: true
    },
    insure: {
      alias: "i",
      description: "<boolean> confirmation dialog after showing changes",
      required: true,
      boolean: true
    }
  })
  .help().argv;

const cPath = path.join(process.cwd(), argv.changelogFilename);
const lPath = path.join(process.cwd(), argv.loggerFilename);

const changelogger = new Reminder(cPath, lPath, {
  intro: argv.intro,
  insure: argv.insure
});
changelogger.run();
