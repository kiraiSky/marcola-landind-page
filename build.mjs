import * as esbuild from "esbuild";

const ENTRIES = ["i18n.jsx", "components.jsx", "booking.jsx", "chat.jsx", "app.jsx"];

const baseOptions = {
  entryPoints: ENTRIES,
  outdir: "dist",
  bundle: false,
  loader: { ".jsx": "jsx" },
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  target: ["es2019"],
  minify: true,
  sourcemap: true,
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const ctx = await esbuild.context(baseOptions);
  await ctx.watch();
  console.log("esbuild watching for changes...");
} else {
  await esbuild.build(baseOptions);
  console.log("Build complete -> dist/");
}
