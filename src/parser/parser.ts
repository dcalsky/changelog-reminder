import * as marked from "marked";
import * as cheerio from "cheerio";
import * as fs from "fs";
import { Version, Change, Store } from "./store";

const VERSION_FLAG = "h2";
const CHANGE_FLAG = "h3";
const LIST_FLAG = "ul";

enum ParserStatus {
  VERSION,
  CHANGE,
  LIST,
  END
}

export class Parser {
  private $: CheerioStatic;
  private status: ParserStatus = ParserStatus.VERSION;
  private currentElement: Cheerio;
  private currentVersion: Version;
  private currentChange: Change;

  constructor(private filePath: string, public store: Store, options = {}) {
    const marked_ = marked 
    if (!this.changelogExist()) {
      throw "Changlog is not existed.";
    }
    const content = fs.readFileSync(filePath).toString();
    const html = marked_(content);
    this.$ = cheerio.load(html);
    this.currentElement = this.$("h2");
  }

  private changelogExist(): boolean {
    return fs.existsSync(this.filePath);
  }

  public parse(): void {
    const el = this.currentElement.first()[0];
    if (!el) {
      return;
    }
    const name = el.tagName;
    let stop = false;
    switch (this.status) {
      case ParserStatus.VERSION:
        if (name == CHANGE_FLAG) {
          this.status = ParserStatus.CHANGE;
          stop = true;
          break;
        }
        if (this.currentVersion) {
          this.pushVersion();
        }
        this.addVersion();
        break;
      case ParserStatus.CHANGE:
        this.addChange();
        this.status = ParserStatus.LIST;
        break;
      case ParserStatus.LIST:
        if (name == VERSION_FLAG) {
          this.status = ParserStatus.VERSION;
          this.pushChange();
          stop = true;
          break;
        } else if (name == CHANGE_FLAG) {
          this.status = ParserStatus.CHANGE;
          this.pushChange();
          stop = true;
          break;
        }
        this.addList();
        break;
      default:
        break;
    }

    if (!stop) {
      this.currentElement = this.currentElement.next();
    }
    this.parse();
  }
  private pushVersion() {
    this.store.addVersion(this.currentVersion);
  }
  private pushChange() {
    this.currentVersion.changes.push(this.currentChange);
  }
  private addVersion() {
    const el = this.currentElement.first();
    const name = el[0].tagName;
    if (name !== VERSION_FLAG) {
      throw "error h2";
    }
    this.currentVersion = new Version(el.text());
  }

  private addChange() {
    const name = this.currentElement.first()[0].tagName;
    if (name !== CHANGE_FLAG) {
      throw "error h3";
    }
    this.currentChange = new Change();
    const text = this.currentElement[0].children[0].data;
    if (!this.currentChange.setType(text)) {
      throw "error set type";
    }
  }

  private addList() {
    const name = this.currentElement.first()[0].tagName;
    if (name !== LIST_FLAG) {
      throw "error ul";
    }
    const list = this.currentElement.first().children("li");
    list.each((i, el) => {
      this.currentChange.items.push(this.getLiText(el));
    });
  }

  private getLiText(li: CheerioElement): string {
    return li.children[0].data;
  }
}
