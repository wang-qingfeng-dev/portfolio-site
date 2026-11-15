# Qingfeng Wang · Interactive Systems Portfolio

双语静态作品集站，重点展示 Unity、AR、交互媒体和系统整合项目。

## Local preview

From this directory, run:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

The site has no build step and no API key. Project copy lives in `content.js`; layout and responsive behavior live in `styles.css`; rendering and language/filter interactions live in `app.js`.

## Media policy

The public bundle uses real project screenshots and compressed full-length H.264 demonstration videos. Original high-bitrate recordings stay outside the repository; see `media/media-manifest.json` and `media/README.md` for the web-copy mapping. Video cards offer an automatic choice plus the available 480p, 720p, and 1080p sources; a failed high-quality source falls back without losing the current playback position.

The two moving-image projects use 2024 DaVinci Resolve footage and a 2025 AIGC short-film encode. The site labels them as course projects and does not claim ownership of third-party brand or generated assets beyond the work described.

## Domestic mirror

`mirror-config.js` supports a domestic OSS/COS copy of the same static files. Set `enabled: true` and provide the HTTPS bucket/CDN root in `baseUrl`; the browser tries that mirror first and falls back to GitHub Pages when an asset is unavailable. The repository does not contain cloud credentials. See [`docs/domestic-mirror.md`](docs/domestic-mirror.md) for the upload and Range/HTTPS checklist.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the repository root. In the repository settings, choose **Pages → GitHub Actions** as the source. The public address will be:

`https://<username>.github.io/<repository>/`

## Content boundaries

The site describes personal contributions and identifies third-party frameworks or assets. It does not publish private Unity source trees, local Windows paths, credentials, or unverified media.
