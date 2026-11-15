import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const content = fs.readFileSync(path.join(root, "content.js"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const context = { window: {} };
vm.runInNewContext(content, context);
const projects = context.window.PORTFOLIO_PROJECTS;

test("page contains required semantic regions", () => {
  for (const id of ["main", "top", "work", "about", "contact", "projectGrid", "languageToggle"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("catalog has Unity featured projects and bilingual fields", () => {
  assert.ok(projects.length >= 10);
  assert.ok(projects.filter((project) => project.featured && project.category === "unity").length >= 3);
  for (const project of projects) {
    assert.ok(project.title.zh && project.title.en);
    assert.ok(project.summary.zh && project.summary.en);
    assert.ok(project.role.zh && project.role.en);
    assert.match(project.media.poster, /^assets\/posters\/[^/]+\.(?:jpg|png|svg)$/);
    assert.ok(fs.existsSync(path.join(root, project.media.poster)));
  }
});

test("catalog uses specific discipline categories", () => {
  const categories = new Set(projects.map((project) => project.category));
  for (const category of ["unity", "engineering", "interactive", "modeling"]) {
    assert.ok(categories.has(category), `missing category: ${category}`);
  }
  assert.doesNotMatch(content, /category:\s*["']systems["']/);
  assert.ok(projects.some((project) => project.id === "disaster-education" && project.media.previews.length === 1));
  assert.ok(projects.some((project) => project.id === "science-museum" && project.media.previews.length === 1));
});

test("project cards use equal presentation", () => {
  assert.doesNotMatch(app, /精选项目|补充项目|Featured|Additional/);
  assert.match(app, /meta\.innerHTML = `\<span>\$\{project\.year\}/);
  assert.doesNotMatch(html + app, /按 Unity 作品、工程、交互装置和建模动画方向浏览/);
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

test("exhibition evidence points to local assets", () => {
  const exhibitionProjects = projects.filter((project) => Array.isArray(project.exhibitions));
  assert.ok(exhibitionProjects.some((project) => project.id === "robot"));
  assert.ok(exhibitionProjects.some((project) => project.id === "touchdesigner-installation"));
  for (const project of exhibitionProjects) {
    for (const exhibition of project.exhibitions) {
      assert.ok(exhibition.year);
      assert.ok(exhibition.title.zh && exhibition.title.en);
      for (const imagePath of exhibition.images) {
        assert.match(imagePath, /^assets\/exhibitions\/[^/]+\.jpg$/);
        assert.ok(fs.existsSync(path.join(root, imagePath)));
      }
    }
  }
});

test("render galleries point to local assets", () => {
  const galleryProjects = projects.filter((project) => project.media.gallery);
  assert.ok(galleryProjects.some((project) => project.id === "blender-keycap"));
  for (const project of galleryProjects) {
    assert.ok(project.media.gallery.title.zh && project.media.gallery.title.en);
    for (const imagePath of project.media.gallery.images) {
      assert.match(imagePath, /^assets\/renders\/[^/]+\/[^/]+\.png$/);
      assert.ok(fs.existsSync(path.join(root, imagePath)));
    }
  }
});

test("public content has no local Windows paths or credentials", () => {
  assert.doesNotMatch(html + content, /[A-Z]:\\\\|password|api[_-]?key|token/i);
});

test("contact section only exposes profile links", () => {
  assert.doesNotMatch(html + app, /欢迎交流|Open to Unity internships|加拿大计算机硕士申请/);
  assert.match(html, /github\.com\/wang-qingfeng-dev/);
  assert.match(html, /id=["']contactEmail["']/);
  assert.match(html, /联系邮箱：/);
  assert.match(html, /GitHub：/);
});

test("video playback preserves audio and has a standard-source fallback", () => {
  assert.match(app, /video\.controls = false/);
  assert.match(app, /video-progress/);
  assert.match(app, /video-volume/);
  assert.match(app, /video-fullscreen/);
  assert.match(app, /requestFullscreen/);
  assert.match(app, /video\.currentTime/);
  assert.match(app, /seekToProgress/);
  assert.match(app, /const sources = \[preview\.path, preview\.hdPath\]/);
  assert.match(app, /configureVideo\(video, "none"\)/);
  assert.match(app, /createVideoControls\(video, preview\)/);
  assert.match(app, /pendingSeekRatio/);
  assert.doesNotMatch(app, /setProgressFromPointer/);
  assert.doesNotMatch(app, /progress\.addEventListener\("pointerdown"/);
  assert.match(app, /progress\.addEventListener\("change"/);
  assert.match(app, /progress\.addEventListener\("input"/);
  assert.match(app, /pauseOtherVideos/);
  assert.match(app, /other\.pause\(\)/);
  assert.match(app, /function adjustVolume/);
  assert.match(app, /ArrowUp/);
  assert.match(app, /deltaY/);
  assert.match(app, /controls-visible/);
  assert.match(app, /2200/);
  assert.match(app, /video\.muted = false/);
  assert.match(app, /video\.defaultMuted = false/);
  assert.match(app, /video\.volume = 1/);
  assert.match(app, /fallbackTried/);
});

test("video frames stay responsive and preserve the source aspect", () => {
  assert.match(styles, /\.project-visual\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*2/s);
  assert.match(styles, /\.project-video\s*\{[^}]*object-fit:\s*contain/s);
  assert.match(styles, /@media\s*\(max-width:\s*900px\)[\s\S]*\.project-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(styles, /@media\s*\(min-width:\s*1100px\)[\s\S]*\.project-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3/s);
  assert.match(styles, /@container\s*\(max-width:\s*28rem\)[\s\S]*\.video-volume[^{]*\{[^}]*display:\s*none/s);
});

test("project years reflect the supplied portfolio timeline", () => {
  assert.equal(projects.find((project) => project.id === "science-museum")?.year, "2024");
  assert.equal(projects.find((project) => project.id === "blender-keycap")?.year, "2024");
});

test("academic highlights use the verified junior-year ranking", () => {
  assert.match(html, /academicHighlights/);
  assert.match(html + app, /2025[–-]2026/);
  assert.match(html + app, /90\.39/);
  assert.match(html + app, /Machine Learning Specialization/);
  assert.match(html + app, /年级第 1 \/ 92|Ranked 1st of 92/);
});
