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
  id: string;
  title: string;

  constructor(title: string) {
    this.title = title
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

  public getFreshVersions(index: number): Version[] {
    let freshVersions: Version[] = [];
    for (let i = 0; i < index; ++i) {
      freshVersions.push(this.versions[i]);
    }
    return freshVersions;
  }
}
