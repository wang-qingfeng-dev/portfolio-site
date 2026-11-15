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
const mirrorConfig = fs.readFileSync(path.join(root, "mirror-config.js"), "utf8");
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
    assert.ok(project.description.zh && project.description.en);
    assert.ok(project.role.zh && project.role.en);
    assert.match(project.media.poster, /^assets\/posters\/[^/]+\.(?:jpg|png|svg)$/);
    assert.ok(fs.existsSync(path.join(root, project.media.poster)));
  }
});

test("catalog uses specific discipline categories", () => {
  const categories = new Set(projects.map((project) => project.category));
  for (const category of ["unity", "engineering", "interactive", "modeling", "editing"]) {
    assert.ok(categories.has(category), `missing category: ${category}`);
  }
  assert.doesNotMatch(content, /category:\s*["']systems["']/);
  assert.ok(projects.some((project) => project.id === "disaster-education" && project.media.previews.length === 1));
  assert.ok(projects.some((project) => project.id === "science-museum" && project.media.previews.length === 1));
  assert.ok(projects.some((project) => project.id === "davinci-color-grade" && project.year === "2024"));
  assert.ok(projects.some((project) => project.id === "aigc-civilization-reboot" && project.year === "2025"));
});

test("project cards use equal presentation", () => {
  assert.doesNotMatch(app, /精选项目|补充项目|Featured|Additional/);
  assert.doesNotMatch(app, /完成内容|Work completed/);
  assert.match(app, /project\.description \|\| project\.summary/);
  assert.match(app, /meta\.innerHTML = `\<span>\$\{project\.year\}/);
  assert.doesNotMatch(html + app, /按 Unity 作品、工程、交互装置和建模动画方向浏览/);
});

test("media previews stay inside the repository", () => {
  for (const project of projects) {
    for (const preview of project.media.previews ?? []) {
      assert.match(preview.path, /^assets\/videos-480p\/[^/]+\.mp4$/);
      assert.ok(fs.existsSync(path.join(root, preview.path)));
      if (preview.hdPath) assert.match(preview.hdPath, /^assets\/videos-(?:720p|hd)\/[^/]+\.mp4$/);
      for (const sourcePath of Object.values(preview.qualitySources || {})) {
        if (/^https?:\/\//.test(sourcePath) || sourcePath.includes("videos-1080p")) continue;
        assert.ok(fs.existsSync(path.join(root, sourcePath)), sourcePath);
      }
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
  assert.match(app, /video-quality/);
  assert.match(app, /chooseVideoQuality/);
  assert.match(app, /setVideoQuality/);
  assert.match(app, /resolvedQuality/);
  assert.match(app, /video-volume/);
  assert.match(app, /video-fullscreen/);
  assert.match(app, /requestFullscreen/);
  assert.match(app, /video\.currentTime/);
  assert.match(app, /seekToProgress/);
  assert.match(app, /__qualitySources/);
  assert.match(app, /qualitySourcesFor/);
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
  assert.match(app, /assetCandidates/);
  assert.match(app, /setVideoQuality\(video, fallback, preservePlayback, \{ currentTime, wasPlaying \}\)/);
  assert.match(app, /video\.src = candidates\[candidateIndex\]/);
  assert.doesNotMatch(app, /isGitHubPagesWithout1080|canExpose1080/);
  assert.match(app, /setVideoQuality\(video, "auto", false, undefined, false\)/);
  assert.match(app, /if \(loadNow\) video\.load\(\)/);
});

test("video quality data retains source tiers while the public selector starts at 720p", () => {
  assert.match(app, /qualitySources/);
  assert.match(app, /480/);
  assert.match(app, /720/);
  assert.match(app, /1080/);
  assert.match(content, /qualitySources/);
  const previews = projects.flatMap((project) => project.media.previews ?? []);
  assert.ok(previews.some((preview) => preview.qualitySources?.["480"]));
  assert.ok(previews.some((preview) => preview.qualitySources?.["720"]));
  assert.ok(previews.some((preview) => preview.qualitySources?.["1080"]));
});

test("public video playback never offers or selects a quality below 720p", () => {
  assert.match(app, /const QUALITY_LABELS = \[\"720\", \"1080\"\]/);
  assert.match(app, /QUALITY_RANK\[quality\] >= QUALITY_RANK\[MIN_PUBLIC_QUALITY\]/);
  assert.match(app, /available\.includes\(MIN_PUBLIC_QUALITY\) \? MIN_PUBLIC_QUALITY : available\[available\.length - 1\]/);
  const previews = projects.flatMap((project) => project.media.previews ?? []);
  for (const preview of previews) {
    assert.ok(
      preview.qualitySources?.["720"] || preview.qualitySources?.["1080"],
      `missing public HD source for ${preview.label?.zh || "video"}`
    );
  }
});

test("public playback defaults to same-domain 720p and keeps 720p as the floor", () => {
  assert.match(app, /MIN_PUBLIC_QUALITY/);
  assert.match(app, /const QUALITY_LABELS = \[\"720\", \"1080\"\]/);
  assert.match(app, /const ALL_QUALITY_LABELS = \[\"480\", \"720\", \"1080\"\]/);
  assert.match(app, /available\.includes\(MIN_PUBLIC_QUALITY\) \? MIN_PUBLIC_QUALITY : available\[available\.length - 1\]/);
  const liveOnward = projects.find((project) => project.id === "disaster-education");
  const preview = liveOnward?.media.previews?.[0];
  assert.ok(preview?.qualitySources?.["720"], "Live Onward must expose a 720p source");
  assert.match(preview?.hdPath || "", /^assets\/videos-(?:720p|hd)\/[^/]+\.mp4$/);
});

test("small original 1080p files are tracked for public playback", () => {
  for (const file of ["3dshoot-1080p.mp4", "robot-1080p.mp4", "xppen-c4d-1080p.mp4"]) {
    assert.ok(fs.existsSync(path.join(root, "assets", "videos-1080p", file)), file);
  }
  for (const id of ["3dshoot", "robot", "xppen-c4d"]) {
    assert.equal(projects.find((project) => project.id === id)?.media.previews?.[0]?.public1080, true, id);
  }
  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.doesNotMatch(gitignore, /^assets\/videos-1080p\/$/m);
});

test("mirror configuration supports a domestic asset base with primary fallback", () => {
  assert.match(html, /mirror-config\.js/);
  assert.match(mirrorConfig, /baseUrl/);
  assert.match(mirrorConfig, /fallbackToPrimary/);
  assert.match(mirrorConfig, /allow1080/);
  assert.match(app, /PORTFOLIO_MIRROR/);
  assert.match(app, /assetUrl/);
  assert.match(app, /fallbackToPrimary/);
});

test("video frames stay responsive and preserve the source aspect", () => {
  assert.match(styles, /\.project-visual\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*2/s);
  assert.match(styles, /\.project-video\s*\{[^}]*object-fit:\s*contain/s);
  assert.match(styles, /@media\s*\(max-width:\s*900px\)[\s\S]*\.project-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(styles, /@media\s*\(min-width:\s*1100px\)[\s\S]*\.project-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3/s);
  assert.match(styles, /\.video-volume-control:hover \.video-volume/);
  assert.match(styles, /\.video-volume[^\{]*\{[^\}]*writing-mode:\s*vertical-lr/s);
  assert.match(styles, /\.video-quality option[^\{]*\{[^\}]*background:\s*var\(--surface-raised\)/s);
});

test("iOS video expansion uses an isolated, scroll-safe path", () => {
  assert.match(app, /setAttribute\("playsinline"/);
  assert.match(app, /setAttribute\("webkit-playsinline"/);
  assert.doesNotMatch(app, /webkitEnterFullscreen/);
  assert.match(app, /isIOSDevice\(\)/);
  assert.match(app, /isIOSDevice\(\)[\s\S]{0,260}enterExpandedVideo\(target\)/);
  assert.match(app, /video-modal-open/);
  assert.match(app, /scrollY/);
  assert.match(styles, /body\.video-modal-open/);
  assert.match(styles, /100dvh/);
  assert.match(styles, /safe-area-inset/);
});

test("iOS cards recover their poster and decoder after Safari suspends media", () => {
  assert.match(app, /video-poster/);
  assert.match(app, /IntersectionObserver/);
  assert.match(app, /visibilitychange/);
  assert.match(app, /pageshow/);
});

test("page chrome uses the portfolio identity", () => {
  assert.match(html, /<title>王青锋 · 交互系统作品集<\/title>/);
  assert.match(html, /assets\/favicon\.svg/);
  assert.match(app, /pageTitle/);
  assert.match(html, /class="signal-core">QW<\/span>/);
  assert.doesNotMatch(html, /class="signal-core">01<\/span>/);
});

test("quality changes prepare a second video before switching", () => {
  assert.match(app, /createQualityBuffer/);
  assert.match(app, /canplay/);
  assert.match(app, /__qualityBuffer/);
  assert.match(app, /__activeVideo/);
  assert.match(app, /__qualityLoadToken/);
  assert.match(app, /currentTime/);
  assert.match(app, /seeked/);
  assert.match(app, /pendingQualityBuffer/);
  assert.match(app, /buffer\.remove\(\)/);
  assert.match(app, /if \(token !== video\.__qualityLoadToken \|\| !buffer\.isConnected\)/);
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
