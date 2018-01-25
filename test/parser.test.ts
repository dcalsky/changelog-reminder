import { Parser, Change, Store } from "../src/parser/index";
import { expect } from "chai";
import path = require("path");

describe("parser", () => {
  const filePath = path.join(__dirname, "CHANGELOG");
  const parser = new Parser(filePath, new Store());
  parser.parse();
  const versions = parser.store.getVersions();

  it("Unreleased version", () => {
    expect(versions[0].title === "Unreleased");
  });

  it("Number of versions", () => {
    expect(versions.length === 12);
  });

  it("Set a change type (1)", () => {
    const change = new Change();
    expect(change.setType("Added")).to.equal(true);
  });

  it("Set a change type (2)", () => {
    const change = new Change();
    expect(change.setType("dcalsky")).to.equal(false);
  });

  it("The change name", () => {
    const change = versions[3].changes[0];
    expect(change.type === "Changed");
  });
});
