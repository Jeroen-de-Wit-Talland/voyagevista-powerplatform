/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
const Webpack = require("webpack");
const Path = require("path");
const Fs = require("fs");

// Output mode (#88): "bundle" (default) emits one voy_library.js from
// library.ts; "perFile" emits one voy_<name>.js per top-level
// webresources_src/*.ts (excluding library.ts, lib/ and __tests__), each merging
// its exports onto the voy global so form calls stay PREFIX.Class.Fn.
const settings = (() => {
  try {
    return JSON.parse(Fs.readFileSync(Path.resolve(__dirname, "dataverse-powertools.json"), "utf8"));
  } catch {
    return {};
  }
})();
const perFile = settings.webresourceOutput === "perFile";
// Bundle output name (#258): the deployed web resource is voy_<this>.js. Defaults to
// "library" — every project scaffolded before this setting existed keeps exactly the name it
// already deploys to. A sub-component is given its folder name at scaffold so two web-resource
// components in one workspace stop overwriting each other's resource.
const libraryName = String(settings.webresourceLibraryName || "library").replace(/[^A-Za-z0-9_]/g, "") || "library";
const perFileEntries = () =>
  Object.fromEntries(
    Fs.readdirSync(Path.resolve(__dirname, "webresources_src"))
      .filter((f) => f.endsWith(".ts") && !f.endsWith(".d.ts") && f !== "library.ts")
      .map((f) => [f.replace(/\.ts$/, ""), "./webresources_src/" + f]),
  );

// The lib folder is git-ignored (generated locally), so CI builds without it.
const xrmQueryPath = Path.resolve(__dirname, "webresources_src/lib/dg.xrmquery.web.min.js");
const hasXrmQuery = Fs.existsSync(xrmQueryPath);

module.exports = {
  entry: perFile ? perFileEntries() : "./webresources_src/library.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // Build against tsconfig.build.json (types:[] + tests excluded) so the production bundle
        // does not type-check Jest tests or require @types/jest to be in the LOCAL node_modules —
        // it isn't when the project sits inside another node project / a workspace / pnpm layout,
        // where @types/jest hoists to a parent node_modules the explicit typeRoots can't see. The
        // generated XRM typings still load (they're regular .d.ts in the program, not `types`).
        use: { loader: "ts-loader", options: { configFile: Path.resolve(__dirname, "tsconfig.build.json") } },
        exclude: /node_modules/,
      },
      ...(hasXrmQuery
        ? [
            {
              test: xrmQueryPath,
              loader: "exports-loader",
              options: {
                exports: ["XrmQuery", "Filter", "XQW"],
              },
            },
          ]
        : []),
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: perFile
    ? {
        filename: "voy_[name].js",
        // assign-properties merges each file's exports onto the voy
        // global, so forms still call voy.Class.Function.
        library: { name: "voy", type: "assign-properties" },
      }
    : {
        filename: "voy_" + libraryName + ".js",
        library: ["voy"], //used to call functions on forms eg: LIBRARYPREFIX.Class.Function
        libraryTarget: "var",
      },
  plugins: hasXrmQuery
    ? [
        new Webpack.ProvidePlugin({
          XrmQuery: [xrmQueryPath, "XrmQuery"],
          Filter: [xrmQueryPath, "Filter"],
          XQW: [xrmQueryPath, "XQW"],
        }),
      ]
    : [],
};
