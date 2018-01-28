import * as marked from "marked";
import * as cheerio from "cheerio";
import * as fs from "fs";
import { Version, Change, Store } from "./store";
import { Config } from "../config";

const INTRO_FLAG = "h1";
const VERSION_FLAG = "h2";
const CHANGE_FLAG = "h3";
const LIST_FLAG = "ul";
const INTRO_TEXT_FLAG = "p";

enum ParserStatus {
  INTRO,
  VERSION,
  CHANGE,
  LIST,
  END
}

export class Parser {
  private $: CheerioStatic;
  private status: ParserStatus = ParserStatus.INTRO;
  private currentElement: Cheerio;
  private currentVersion: Version;
  private currentChange: Change;
  private introText: string[] = [];

  constructor(private config: Config, public store: Store) {
    const marked_ = marked;
    if (!this.changelogExist()) {
      console.error(`${config.changelog} is not existed.`);
      process.exit(1);
    }
    const content = fs.readFileSync(config.changelog).toString();
    const html = marked_(content);
    this.$ = cheerio.load(html);
    this.currentElement = this.$("h1");
  }

  private changelogExist(): boolean {
    return fs.existsSync(this.config.changelog);
  }

  public parse(): void {
    const el = this.currentElement.first()[0];
    if (!el) {
      // Push the last version
      this.pushChange();
      this.pushVersion();
      return;
    }
    const name = el.tagName;
    let stop = false;
    switch (this.status) {
      case ParserStatus.INTRO:
        if (name == VERSION_FLAG) {
          this.pushIntroText();
          this.status = ParserStatus.VERSION;
          stop = true;
          break;
        }
        // Do not add changlog title into introduction text
        name !== INTRO_FLAG && this.addIntroText();
        break;
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
  private addIntroText() {
    const el = this.currentElement.first();
    this.introText.push(el.text());
  }
  private pushIntroText() {
    const intro = this.introText.join("\n");
    this.store.setIntro(intro);
    this.introText = [];
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
