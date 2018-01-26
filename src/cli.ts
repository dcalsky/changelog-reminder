import * as yargs from "yargs";
import * as path from "path";
import { ChangeReminder } from "./reminder";

const defaultChangelogPath = path.join(process.cwd(), "CHANGELOG");
const defaultLoggerPath = path.join(process.cwd(), ".changelogger");

const argv = yargs
  .usage("Usage: $0 -c [changelog path] -l [logger path]")
  .default("c", defaultChangelogPath)
  .default("l", defaultLoggerPath).argv;

const changelogger = new ChangeReminder(argv.c, argv.l);
changelogger.run();
