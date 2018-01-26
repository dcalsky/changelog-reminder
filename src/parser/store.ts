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
  private versions: Version[] = [];

  public addVersion(v: Version): void {
    this.versions.push(v);
  }

  public getVersions(): Version[] {
    return this.versions;
  }

  public getFreshVersions(title: string): Version[] {
    let freshVersions: Version[] = [];
    for (let i = 0; i < this.versions.length; ++i) {
      if (this.versions[i].title === title) {
        return freshVersions;
      }
      freshVersions.push(this.versions[i]);
    }
    return freshVersions
  }

  public getLatestVersion() {
    return this.versions[0];
  }
}
