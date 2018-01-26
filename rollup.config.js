import typescript from "rollup-plugin-typescript";

export default {
  input: "src/cli.ts",
  output: {
    file: "bin/cli",
    format: "cjs",
    banner: "#!/usr/bin/env node"
  },
  plugins: [
    typescript({
      exclude: ["./node_modules/*"],
      moduleResolution: 'node'
    })
  ]
};
