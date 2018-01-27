const chalk = require("chalk");
const Table = require("cli-table-redemption");

const CHARS = {
  top: "═",
  "top-mid": "╤",
  "top-left": "╔",
  "top-right": "╗",
  bottom: "═",
  "bottom-mid": "╧",
  "bottom-left": "╚",
  "bottom-right": "╝",
  left: "║",
  "left-mid": "╟",
  mid: "─",
  "mid-mid": "┼",
  right: "║",
  "right-mid": "╢",
  middle: "│"
};

const log = console.log;

interface OutputOptions {
  versionTitleColor: any;
  changeTypeColor: any;
}

export class Output {
  table: any;
  private options: OutputOptions = {
    versionTitleColor: chalk.bold.magentaBright,
    changeTypeColor: chalk.bold.cyanBright
  };
  constructor(options?: OutputOptions) {
    // this.options = this.options
  }
  public addVersion(title: string) {
    title = this.options.versionTitleColor(title);
    this.table = new Table({
      chars: CHARS
    });
    this.table.push([`Version: ${title}`]);
  }

  public addChange(type: string, items: string[]) {
    type = this.options.changeTypeColor(type);
    this.table.push([`Change: ${type}`]);
    this.table.push([this.orderChangeItems(items)]);
  }

  public showIntro(intro: string, show: boolean = true) {
    this.table = this.table || new Table({
      chars: CHARS
    });
    const introTitle = chalk.bold.blue("CHANGELOG NOTE");
    this.table.push([introTitle], [intro]);
    show && this.show();
  }

  public showNochange(show: boolean = true) {
    this.table = new Table({
      chars: CHARS
    });
    const statusText = chalk.bold.blue("Status");
    this.table.push([statusText], ["No changes found."]);
  }

  public show() {
    log(this.table.toString());
  }

  private orderChangeItems(items: string[]): string {
    return items
      .map((item, i) => {
        const order = chalk.bold.gray(`${i + 1}`);
        return `${order}. ${item}`;
      })
      .join("\n");
  }
}
