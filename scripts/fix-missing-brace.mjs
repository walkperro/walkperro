import fs from "node:fs";

const file = "app/page.tsx";
let src = fs.readFileSync(file, "utf8");

// 1) If there’s a lonely '}' right before return(...), remove it (it breaks balance)
src = src.replace(/\n}\s*\n\s*return\s*\(/, `

  return (`);

// 2) Make sure the file ends with a closing brace for the component
const trimmed = src.trimEnd();
if (!trimmed.endsWith("}")) {
  src = trimmed + "\n}\n";
}

// 3) Optional: collapse accidental extra braces after buy() block
// If we see '}\n\n}' immediately before EOF, reduce to single '}'
src = src.replace(/\}\s*\n\s*\}\s*$/, "}\n");

fs.writeFileSync(file, src);
console.log("Fixed brace balance in app/page.tsx ✓");
