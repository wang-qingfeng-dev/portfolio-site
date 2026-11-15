# 国内访问镜像

作品集主站继续使用 GitHub Pages：

`https://wang-qingfeng-dev.github.io/portfolio-site/`

仓库已经支持把页面、封面和视频资源切换到国内 OSS/COS 镜像。镜像配置在根目录的 `mirror-config.js`：

```js
window.PORTFOLIO_MIRROR = Object.freeze({
  enabled: true,
  baseUrl: "https://你的存储域名",
  allow1080: true,
  fallbackToPrimary: true
});
```

`baseUrl` 必须指向包含 `assets/` 的 HTTPS 根目录。例如 bucket 根目录下应该能访问：

`https://你的存储域名/assets/videos-hd/3dshoot-hd.mp4`

只有在镜像已经上传 `assets/videos-1080p/` 并能正常返回视频时，才设置 `allow1080: true`。GitHub Pages 公共主站不会显示不存在的 1080p 文件，因此不会出现点击 1080p 后悄悄回退到 720p 的误导状态。

## 推荐部署

使用阿里云 OSS 或腾讯云 COS 创建公共读 bucket，再用对应 CDN 加速。需要完成：

1. 创建 bucket，并开启静态文件公共读取；
2. 上传站点文件和 `assets/` 目录；
3. 配置 CDN 的 Range 请求和 HTTPS；
4. 将镜像根地址写入 `mirror-config.js`；
5. 推送后测试 GitHub 主站和国内镜像。

如果使用大陆服务器或自定义大陆域名，按云厂商要求完成 ICP 备案。只使用云厂商提供的 bucket endpoint 时，通常可以先不购买域名，但地址不够好看。

本仓库不包含任何云账号密钥。真正上传镜像需要站长自己的 OSS/COS 账号、bucket 权限和可能产生的流量费用；在这些信息准备好后，再配置自动同步 workflow。
