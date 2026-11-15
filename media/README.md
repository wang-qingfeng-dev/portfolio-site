# Media staging

The portfolio uses real screenshots and full-length H.264 web copies so the site remains usable on a phone. The original high-bitrate recordings stay outside this repository.

- `3D射击游戏demo展示.mov` — Unity third-person shooter walkthrough.
- `科技馆展览游玩演示.mov` — interactive Unity exhibition walkthrough.
- `向生而行演示.mov` — Disaster Education capstone walkthrough.

Video files:

- `../assets/videos/3dshoot-full.mp4`
- `../assets/videos/live-onward-full.mp4`
- `../assets/videos/science-museum-full.mp4`
- `../assets/videos/ar-full.mp4`
- `../assets/videos/robot-full.mp4`

The 3D-shooter source recording includes an AAC track, but its measured audio level is digital silence. The site keeps the original recording unchanged and labels that demo as silent; adding replacement music would change the evidence and is intentionally not done.

The manifest records the source filename and the web-copy path. The large originals are intentionally kept outside this repository.

Higher-quality local encodes are generated under `../assets/videos-hd/` for previewing. They are ignored by Git because the 16-minute 720p encode is larger than GitHub's normal single-file limit. For public deployment, upload those HD files as Release assets or to a video CDN and place the hosted URL in the corresponding `hdPath` field; the browser will fall back to the repository copy when an HD source is unavailable.
