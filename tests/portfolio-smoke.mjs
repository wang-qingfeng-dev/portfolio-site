import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const content = fs.readFileSync(path.join(root, "content.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(content, context);
const projects = context.window.PORTFOLIO_PROJECTS;

test("page contains required semantic regions", () => {
  for (const id of ["main", "top", "work", "about", "contact", "projectGrid", "languageToggle"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("catalog has Unity featured projects and bilingual fields", () => {
  assert.ok(projects.length >= 5);
  assert.ok(projects.filter((project) => project.featured && project.category === "unity").length >= 3);
  for (const project of projects) {
    assert.ok(project.title.zh && project.title.en);
    assert.ok(project.summary.zh && project.summary.en);
    assert.ok(project.role.zh && project.role.en);
    assert.match(project.media.poster, /^assets\/posters\/[^/]+\.(?:jpg|png|svg)$/);
    assert.ok(fs.existsSync(path.join(root, project.media.poster)));
  }
});

test("media previews stay inside the repository", () => {
  for (const project of projects) {
    for (const preview of project.media.previews ?? []) {
      assert.match(preview.path, /^assets\/videos\/[^/]+\.mp4$/);
      assert.ok(fs.existsSync(path.join(root, preview.path)));
      if (preview.hdPath) assert.match(preview.hdPath, /^assets\/videos-hd\/[^/]+\.mp4$/);
    }
  }
});

test("public content has no local Windows paths or credentials", () => {
  assert.doesNotMatch(html + content, /[A-Z]:\\\\|password|api[_-]?key|token/i);
});
