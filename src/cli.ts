import yargs = require("yargs");
import path = require("path");
import { Changelogger } from "./changelogger";

const defaultChangelogPath = path.join(process.cwd(), "CHANGELOG");
const defaultLoggerPath = path.join(process.cwd(), ".changelogger");

const argv = yargs
  .usage("Usage: $0 -c [changelog path] -l [logger path]")
  .default("c", defaultChangelogPath)
  .default("l", defaultLoggerPath).argv;

const changelogger = new Changelogger(argv.c, argv.l);
changelogger.run();
