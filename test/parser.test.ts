import { Parser, Change, Store } from "../src/parser/index";
import { expect } from "chai";
import path = require("path");
import { Config } from "../src/config";

describe("parser", () => {
  const filePath = path.join(__dirname, "CHANGELOG");
  const config = new Config();
  const parser = new Parser(config, new Store());
  parser.parse();

  const versions = parser.store.versions;

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
    expect(change.type).to.eql("Changed");
  });

  it("Show the introduction", () => {
    const intro = parser.store.intro;
    const CHNAGELOG_INTRO = `All notable changes to this project will be documented in this file.The format is based on Keep a Changelog.`;
    expect(intro).to.eql(CHNAGELOG_INTRO);
  });
});
