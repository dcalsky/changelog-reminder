export enum ChangeTypes {
  Added = "Added",
  Changed = "Changed",
  Deprecated = "Deprecated",
  Removed = "Removed",
  Fixed = "Fixed",
  Security = "Security"
}

export class Change {
  type: ChangeTypes;
  items: string[] = [];

  public setType(text: string): boolean {
    if (!(text in ChangeTypes)) {
      return false;
    }
    this.type = ChangeTypes[text];
    return true;
  }
}

export class Version {
  changes: Change[] = [];
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}

export class Store {
  private _versions: Version[] = [];
  private _intro: string;

  public addVersion(v: Version): void {
    this._versions.push(v);
  }

  get versions(): Version[] {
    return this._versions;
  }

  get intro() {
    return this._intro;
  }

  public getFreshVersions(title: string): Version[] {
    let freshVersions: Version[] = [];
    for (let i = 0; i < this._versions.length; ++i) {
      if (this._versions[i].title === title) {
        return freshVersions;
      }
      freshVersions.push(this._versions[i]);
    }
    return freshVersions;
  }

  public getLatestVersion() {
    return this._versions[0];
  }
}
