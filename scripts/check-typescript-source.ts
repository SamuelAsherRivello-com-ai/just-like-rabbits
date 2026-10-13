import { readdir } from "node:fs/promises";
import { join } from "node:path";

const roots = ["src", "scripts"];
const forbidden = new Set([".js", ".jsx", ".mjs", ".cjs"]);

async function scan(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const violations: string[] = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) violations.push(...await scan(path));
    else if (forbidden.has(entry.name.slice(entry.name.lastIndexOf(".")))) violations.push(path);
  }
  return violations;
}

const violations = (await Promise.all(roots.map(scan))).flat();
if (violations.length > 0) {
  throw new Error(`Authored JavaScript is not permitted: ${violations.join(", ")}`);
}
