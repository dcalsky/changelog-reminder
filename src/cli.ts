import * as yargs from "yargs";
import * as path from "path";
import { Reminder } from "./reminder";

const defaultChangelogFilename = "CHANGELOG";
const defaultLoggerFilename = ".changelogger";

const argv = yargs
  .usage("Usage: $0 [options]")
  .options({
    changelog: {
      description: "<path> changelog file relative path",
      requiresArg: true,
      required: false,
      default: defaultChangelogFilename,
      string: true
    },
    logger: {
      description: "<path> logger file relative path",
      requiresArg: true,
      required: false,
      default: defaultLoggerFilename,
      string: true
    },
    intro: {
      description: "<boolean> show introduction of changelog",
      required: true,
      boolean: true
    },
    confirm: {
      description: "<boolean> show confirmation dialog at last",
      required: true,
      boolean: true
    }
  })
  .alias("help", "h")
  .alias("version", "v").argv;

const cPath = path.join(process.cwd(), argv.changelog);
const lPath = path.join(process.cwd(), argv.logger);

const changelogger = new Reminder(cPath, lPath, {
  intro: argv.intro,
  insure: argv.confirm
});

changelogger.run();
