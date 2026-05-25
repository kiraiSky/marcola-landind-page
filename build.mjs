import * as esbuild from "esbuild";
import { watch } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");
const ENTRIES = ["i18n.jsx", "components.jsx", "booking.jsx", "chat.jsx", "app.jsx"];

async function buildEntry(entry) {
  const inputPath = path.join(ROOT, entry);
  const outputName = entry.replace(/\.jsx$/, ".js");
  const outputPath = path.join(DIST, outputName);
  const mapName = `${outputName}.map`;
  const source = await fs.readFile(inputPath, "utf8");

  const result = await esbuild.transform(source, {
    loader: "jsx",
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    target: ["es2019"],
    minify: true,
    sourcemap: true,
    sourcefile: entry,
  });

  await fs.writeFile(outputPath, `${result.code}\n//# sourceMappingURL=${mapName}\n`);
  await fs.writeFile(path.join(DIST, mapName), result.map);
}

async function buildAll() {
  await fs.mkdir(DIST, { recursive: true });
  await Promise.all(ENTRIES.map(buildEntry));
  console.log("Build complete -> dist/");
}

await buildAll();

if (process.argv.includes("--watch")) {
  console.log("Watching for changes...");
  for (const entry of ENTRIES) {
    watch(path.join(ROOT, entry), async () => {
      try {
        await buildEntry(entry);
        console.log(`Rebuilt ${entry}`);
      } catch (err) {
        console.error(err);
      }
    });
  }
}
