import yargs = require("yargs");
import path = require("path");
import fs = require("fs");
import { Reminder } from "./reminder";
import { Config } from "./config";
import { Argv } from "./config";

interface IArgv extends Argv, yargs.Arguments {}

const defaultConfigPath = "changelog-reminder.yaml";
const argv = yargs
  .usage("Usage: $0 [options]")
  .options({
    config: {
      description: "<path> config file relative path",
      alias: "c",
      requiresArg: true,
      required: false,
      default: defaultConfigPath,
      string: true
    }
  })
  .alias("help", "h")
  .alias("version", "v").argv;

const config: Config = new Config(argv as IArgv);
const changelogger = new Reminder(config);
changelogger.run();
