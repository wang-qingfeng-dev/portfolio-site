# Media staging

The portfolio uses real screenshots and full-length H.264 web copies so the site remains usable on a phone. The original high-bitrate recordings stay outside this repository.

- `3D射击游戏demo展示.mov` — Unity third-person shooter walkthrough.
- `科技馆展览游玩演示.mov` — interactive Unity exhibition walkthrough.
- `向生而行演示.mov` — Disaster Education capstone walkthrough.
- `e3205206bcec18797e4ddcd7c3a3aa17_raw.mp4` — 2024 DaVinci Resolve color-grading study.
- `《文明重启》最终版.mp4` — 2025 AIGC short-film editing project.

The public web copies are grouped by quality:

- `../assets/videos-480p/` — legacy low-bandwidth sources retained for archival fallback; they are not offered by the public selector.
- `../assets/videos-hd/` — existing H.264 720p copies for the Unity/AR/robot/science-museum demos.
- `../assets/videos-720p/` — generated 720p copies for TouchDesigner, XPPen, DaVinci Resolve, the AIGC film, and Live Onward.
- `../assets/videos-1080p/` — original-resolution encodes. The 3D-shooter, robot, and XPPen files are tracked because they are below GitHub's single-file limit; larger originals remain ignored.

All committed 720p copies use H.264 video, yuv420p, AAC audio, and fast-start MP4 metadata so common Chromium, Edge, Safari, and mobile browsers can decode the picture while streaming. The `向生而行` 720p copy is kept below GitHub's 100 MB hard limit, but a mainland mirror is still recommended for reliable loading in China.

Exhibition evidence supplied by the portfolio owner is stored under `../assets/exhibitions/`. The 2025 images document the TouchDesigner installation; the 2026 images document the Xiaozhi robot exhibition and its project board.
Blender render evidence is stored under `../assets/renders/` and is used for the keycap-modeling project.

The 3D-shooter source recording includes an AAC track, but its measured audio level is digital silence. The site keeps the original recording unchanged and labels that demo as silent; adding replacement music would change the evidence and is intentionally not done.

The manifest records the source filename and the web-copy path. The complete availability table is in `docs/video-quality-availability.md`.

Higher-quality local encodes are generated under `../assets/videos-hd/` and `../assets/videos-720p/` for previewing. The original-resolution 1080p release files are generated under `../assets/videos-1080p/` and described in `hd-1080p-manifest.json`. Only files within GitHub's single-file limit are tracked in the repository.

For public deployment, upload the large files from `../assets/videos-1080p/` as assets of a public GitHub Release (or to a video CDN), then put each asset's public URL in the corresponding `qualitySources["1080"]` field in `content.js` or place the same path in the configured domestic mirror. The browser tries that high-resolution source first and falls back to the verified 720p repository copy if it is unavailable.
