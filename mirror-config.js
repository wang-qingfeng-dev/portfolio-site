// 国内镜像配置。将站点静态文件上传到阿里云 OSS 或腾讯云 COS 后，
// 把 baseUrl 改成 bucket 的 HTTPS 根地址，再把 enabled 改为 true。
// 空地址表示直接使用 GitHub Pages；镜像资源失败时会自动回退到主站资源。
window.PORTFOLIO_MIRROR = Object.freeze({
  enabled: false,
  baseUrl: "",
  fallbackToPrimary: true
});
