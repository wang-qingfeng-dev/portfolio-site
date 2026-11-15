# 国内访问方案：域名、镜像与备案

当前 GitHub Pages 主站：

`https://wang-qingfeng-dev.github.io/portfolio-site/`

## 先明确一件事

购买一个 `.cn` 域名并把它指向 GitHub Pages，只会改变网址，不会改变视频文件的来源。视频仍然从 GitHub Pages 加载，在中国大陆仍可能慢。

要真正改善访问速度，需要把站点文件和 `assets/` 视频复制到中国大陆区域的 OSS/COS，再用国内 CDN 或云厂商 HTTPS 域名提供资源。页面已经支持这个方案：浏览器先尝试 `mirror-config.js` 中的镜像地址，镜像失败后自动回退到 GitHub Pages。

## 推荐路线：阿里云 OSS + CDN

以下步骤需要你本人完成实名认证、付款和备案，我不能代你操作这些账户步骤：

1. 在[阿里云域名注册](https://wanwang.aliyun.com/domain)查询并购买一个域名，例如 `wangqingfeng.cn` 或 `qingfengwang.cn`；先确认实际可注册性和价格。
2. 完成域名实名认证，并通过[阿里云备案入口](https://beian.aliyun.com/)提交 ICP 备案。中国内地 OSS Bucket 绑定自定义域名时，阿里云要求该域名已完成 ICP 备案。
3. 在中国内地区域创建 OSS Bucket，开启适合公开作品集的公共读权限，只上传本仓库的静态文件和 `assets/`，不要上传密钥、源代码私密仓库或个人证件。
4. 按[阿里云 OSS 自定义域名文档](https://help.aliyun.com/zh/oss/user-guide/access-buckets-via-custom-domain-names)绑定备案域名，并配置 HTTPS。若使用 CDN，开启 Range 请求，视频拖动进度条才会稳定。
5. 将仓库根目录和 `assets/` 上传到 Bucket，使以下地址可访问：

   `https://你的域名/assets/videos-hd/3dshoot-hd.mp4`

6. 修改根目录 `mirror-config.js`：

   ```js
   window.PORTFOLIO_MIRROR = Object.freeze({
     enabled: true,
     baseUrl: "https://你的域名",
     fallbackToPrimary: true
   });
   ```

7. 推送后分别测试首页、封面和视频的 720p/1080p 选择、拖动进度条，以及镜像失效时是否能回退到 GitHub Pages。

## 腾讯云替代方案

腾讯云 COS 也可以采用同样的结构：购买并备案域名 → 中国内地 COS 存储桶 → 公共读/HTTPS → CDN → 上传整个站点 → 把 `baseUrl` 指向 CDN 根地址。不要把密钥写进前端；上传应使用控制台或本地 CLI 的私密配置。

## 不备案的临时测试

可以先使用云厂商提供的 Bucket 默认 HTTPS endpoint 测试镜像，例如 `https://<bucket>.oss-cn-<region>.aliyuncs.com`。这种地址不适合作为最终作品集域名，访问策略、HTTPS 和 CDN 能力也需要以云厂商当前规则为准。

GitHub Pages 自定义域名的官方说明见[GitHub Pages 文档](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。绑定 GitHub Pages 只解决地址展示，不能替代国内视频镜像。
