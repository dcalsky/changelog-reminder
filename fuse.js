const { FuseBox, JSONPlugin, BannerPlugin } = require("fuse-box");

const fuse = FuseBox.init({
  homeDir: "src",
  target: "server@es5",
  output: "$name.js",
  tsConfig: "tsconfig.json",
  useTypescriptCompiler: true,
  plugins: [JSONPlugin(), BannerPlugin("#!/usr/bin/env node")]
});

let bundler = fuse.bundle("cli").instructions(" > [cli.ts]");

if (process.env.NODE_ENV !== "production") {
  bundler = bundler.watch();
}

fuse.run();
