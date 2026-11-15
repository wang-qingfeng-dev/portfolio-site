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

The public bundle uses real project screenshots and compressed full-length H.264 demonstration videos. Original high-bitrate recordings stay outside the repository; see `media/media-manifest.json` and `media/README.md` for the web-copy mapping.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the repository root. In the repository settings, choose **Pages → GitHub Actions** as the source. The public address will be:

`https://<username>.github.io/<repository>/`

## Content boundaries

The site describes personal contributions and identifies third-party frameworks or assets. It does not publish private Unity source trees, local Windows paths, credentials, or unverified media.
