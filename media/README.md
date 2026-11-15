# Media staging

The portfolio uses real screenshots and full-length H.264 web copies so the site remains usable on a phone. The original high-bitrate recordings stay outside this repository.

- `3D射击游戏demo展示.mov` — Unity third-person shooter walkthrough.
- `科技馆展览游玩演示.mov` — interactive Unity exhibition walkthrough.
- `向生而行演示.mov` — Disaster Education capstone walkthrough.
- `e3205206bcec18797e4ddcd7c3a3aa17_raw.mp4` — 2024 DaVinci Resolve color-grading study.
- `《文明重启》最终版.mp4` — 2025 AIGC short-film editing project.

The public web copies are grouped by quality:

- `../assets/videos-480p/` — the default low-bandwidth sources for every video, including the 2024 DaVinci Resolve and 2025 AIGC projects.
- `../assets/videos-hd/` — existing H.264 720p copies for the Unity/AR/robot/science-museum demos.
- `../assets/videos-720p/` — generated 720p copies for TouchDesigner, XPPen, DaVinci Resolve, and the AIGC film.
- `../assets/videos-1080p/` — original-resolution encodes kept locally and ignored by Git because several exceed GitHub's normal single-file limit.

All committed 480p/720p copies use H.264 video, yuv420p, AAC audio, and fast-start MP4 metadata so common Chromium, Edge, Safari, and mobile browsers can decode the picture while streaming. The large `向生而行` 480p copy is kept below GitHub's 100 MB hard limit, but a mainland mirror is still recommended for reliable loading in China.

Exhibition evidence supplied by the portfolio owner is stored under `../assets/exhibitions/`. The 2025 images document the TouchDesigner installation; the 2026 images document the Xiaozhi robot exhibition and its project board.
Blender render evidence is stored under `../assets/renders/` and is used for the keycap-modeling project.

The 3D-shooter source recording includes an AAC track, but its measured audio level is digital silence. The site keeps the original recording unchanged and labels that demo as silent; adding replacement music would change the evidence and is intentionally not done.

The manifest records the source filename and the web-copy path. The large originals are intentionally kept outside this repository.

Higher-quality local encodes are generated under `../assets/videos-hd/` and `../assets/videos-720p/` for previewing. The original-resolution 1080p release files are generated under `../assets/videos-1080p/` and described in `hd-1080p-manifest.json`. They are ignored by Git because several files exceed GitHub's normal single-file limit.

For public deployment, upload the files from `../assets/videos-1080p/` as assets of a public GitHub Release (or to a video CDN), then put each asset's public URL in the corresponding `hdPath` field in `content.js`. The browser tries that high-resolution source first and falls back to the repository copy if it is unavailable.
