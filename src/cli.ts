import * as yargs from "yargs";
import * as path from "path";
import * as fs from "fs";
import { Reminder } from "./reminder";
import { Config } from "./config";
import { Argv } from "./config";

interface IArgv extends Argv, yargs.Arguments {}

const defaultConfigPath = "change-reminder.yaml";
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
