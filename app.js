(function () {
  "use strict";

  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const translations = {
    zh: {
      brandName: "王青锋", footerCredit: "© 2026 王青锋", schoolName: "重庆对外经贸学院", navWork: "作品", navAbout: "关于我", navContact: "联系", eyebrow: "UNITY · AR · INTERACTION",
      heroTitle: "把交互想法做成可运行的世界。", heroLede: "数字媒体技术本科生，专注 Unity 游戏玩法、AR 体验和可验证的交互系统。预计 2027 年 6 月毕业。",
      viewWork: "查看作品", github: "GitHub", signalLabel: "Focus", signalValue: "Interactive 3D", selectedWork: "SELECTED WORK", workTitle: "从玩法到真实场景",
      workNote: "先看 Unity 项目，再看系统与研究项目。", filterAll: "全部", filterSystems: "系统", aboutEyebrow: "ABOUT", aboutTitle: "我关心的不只是画面。",
      aboutText: "我喜欢把一个模糊的体验目标拆成输入、状态、反馈和可测试的运行流程。作品覆盖 Unity 游戏玩法、灾害教育交互、AR、机器人系统集成和软件工程。",
      factSchool: "学校", factMajor: "专业", factGrad: "毕业时间", factInterest: "方向", major: "数字媒体技术", interest: "Unity / AR / HCI",
      contactEyebrow: "链接与联系方式", contactTitle: "GitHub 与联系方式",
      footerNote: "公开页面展示项目说明和完整演示。", mediaPublic: "演示视频", mediaPending: "演示视频", mediaPrivate: "演示视频", exhibitionTitle: "展览记录",
      details: "查看项目说明", contribution: "个人贡献", openLink: "打开链接"
    },
    en: {
      brandName: "Qingfeng Wang", footerCredit: "© 2026 Qingfeng Wang", schoolName: "Chongqing College of International Business and Economics", navWork: "Work", navAbout: "About", navContact: "Contact", eyebrow: "UNITY · AR · INTERACTION",
      heroTitle: "Turning interaction ideas into runnable worlds.", heroLede: "A Digital Media Technology undergraduate focused on Unity gameplay, AR experiences, and testable interactive systems. Graduating in June 2027.",
      viewWork: "View work", github: "GitHub", signalLabel: "Focus", signalValue: "Interactive 3D", selectedWork: "SELECTED WORK", workTitle: "From gameplay to real places",
      workNote: "Unity projects first, followed by systems and research work.", filterAll: "All", filterSystems: "Systems", aboutEyebrow: "ABOUT", aboutTitle: "The frame is only the beginning.",
      aboutText: "I like breaking an ambiguous experience goal into inputs, states, feedback, and testable runtime flows. My work spans Unity gameplay, disaster-education interaction, AR, robot systems integration, and software engineering.",
      factSchool: "School", factMajor: "Major", factGrad: "Graduation", factInterest: "Focus", major: "Digital Media Technology", interest: "Unity / AR / HCI",
      contactEyebrow: "LINKS & CONTACT", contactTitle: "GitHub and contact",
      footerNote: "The public page presents project notes and full demos.", mediaPublic: "Demo video", mediaPending: "Demo video", mediaPrivate: "Demo video", exhibitionTitle: "Exhibition record",
      details: "View project notes", contribution: "Personal contribution", openLink: "Open link"
    }
  };

  let language = "zh";
  let activeFilter = "all";
  const grid = document.getElementById("projectGrid");
  const status = document.getElementById("filterStatus");

  function text(value) { return typeof value === "string" ? value : (value && value[language]) || ""; }
  function mediaLabel(media) {
    if (media.status === "approved-public") return translations[language].mediaPublic;
    if (media.status === "private-provenance-incomplete") return translations[language].mediaPrivate;
    return translations[language].mediaPending;
  }
  function addVideoSources(video, preview) {
    const sources = [preview.hdPath, preview.path].filter(Boolean);
    sources.forEach((sourcePath) => {
      const source = document.createElement("source");
      source.src = sourcePath;
      source.type = "video/mp4";
      video.appendChild(source);
    });
    const standardPath = preview.path;
    if (standardPath && preview.hdPath) {
      video.addEventListener("error", () => {
        if (video.dataset.fallbackTried === "true") return;
        video.dataset.fallbackTried = "true";
        video.replaceChildren();
        const fallbackSource = document.createElement("source");
        fallbackSource.src = standardPath;
        fallbackSource.type = "video/mp4";
        video.appendChild(fallbackSource);
        video.load();
      });
    }
  }
  function configureVideo(video, preload) {
    video.controls = true;
    video.preload = preload;
    video.playsInline = true;
    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
  }
  function renderMedia(project) {
    const media = project.media;
    const visual = document.createElement("div");
    visual.className = "project-visual";
    const previews = Array.isArray(media.previews) ? media.previews : [];
    if (previews.length === 0) {
      const image = document.createElement("img");
      image.src = media.poster;
      image.alt = text(project.title);
      image.loading = "lazy";
      visual.appendChild(image);
    } else {
      const video = document.createElement("video");
      video.className = "project-video";
      configureVideo(video, "metadata");
      video.poster = media.poster;
      video.setAttribute("aria-label", `${text(project.title)} demo preview`);
      addVideoSources(video, previews[0]);
      const fallback = document.createElement("img");
      fallback.src = media.poster;
      fallback.alt = text(project.title);
      video.appendChild(fallback);
      visual.appendChild(video);
      if (previews.length > 1) {
        const count = document.createElement("span");
        count.className = "media-count";
        count.textContent = language === "zh" ? `含 ${previews.length} 段视频` : `${previews.length} videos`;
        visual.appendChild(count);
      }
    }
    return visual;
  }
  function renderLinks(project) {
    const wrapper = document.createElement("div");
    wrapper.className = "project-links";
    (project.links || []).forEach((link) => {
      const anchor = document.createElement("a");
      anchor.href = link.href;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      anchor.textContent = `${text(link.label)} ↗`;
      wrapper.appendChild(anchor);
    });
    return wrapper;
  }
  function renderExhibitions(project) {
    const exhibitions = Array.isArray(project.exhibitions) ? project.exhibitions : [];
    if (exhibitions.length === 0) return null;
    const section = document.createElement("section");
    section.className = "exhibition-evidence";
    const heading = document.createElement("h4");
    heading.textContent = translations[language].exhibitionTitle;
    section.appendChild(heading);
    exhibitions.forEach((exhibition) => {
      const item = document.createElement("article");
      item.className = "exhibition-item";
      const title = document.createElement("h5");
      title.textContent = `${exhibition.year} · ${text(exhibition.title)}`;
      item.appendChild(title);
      const note = document.createElement("p");
      note.textContent = text(exhibition.note);
      item.appendChild(note);
      const gallery = document.createElement("div");
      gallery.className = "exhibition-gallery";
      (exhibition.images || []).forEach((imagePath) => {
        const image = document.createElement("img");
        image.src = imagePath;
        image.alt = `${text(project.title)} · ${text(exhibition.title)}`;
        image.loading = "lazy";
        gallery.appendChild(image);
      });
      item.appendChild(gallery);
      section.appendChild(item);
    });
    return section;
  }
  function renderProjects() {
    grid.replaceChildren();
    const visible = projects.filter((project) => activeFilter === "all" || project.category === activeFilter);
    status.textContent = language === "zh" ? `显示 ${visible.length} 个项目` : `${visible.length} projects shown`;
    visible.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.appendChild(renderMedia(project));
      const body = document.createElement("div");
      body.className = "project-body";
      const meta = document.createElement("div");
      meta.className = "project-meta";
      meta.innerHTML = `<span>${project.featured ? (language === "zh" ? "精选项目" : "Featured") : (language === "zh" ? "补充项目" : "Additional")}</span><span>${project.year}</span>`;
      body.appendChild(meta);
      const title = document.createElement("h3");
      title.textContent = text(project.title);
      body.appendChild(title);
      const summary = document.createElement("p");
      summary.textContent = text(project.summary);
      body.appendChild(summary);
      const tags = document.createElement("div");
      tags.className = "tag-row";
      project.tech.forEach((tag) => { const span = document.createElement("span"); span.className = "tag"; span.textContent = tag; tags.appendChild(span); });
      body.appendChild(tags);
      const details = document.createElement("details");
      details.className = "project-details";
      const summaryToggle = document.createElement("summary");
      summaryToggle.textContent = translations[language].details;
      details.appendChild(summaryToggle);
      const contribution = document.createElement("p");
      contribution.innerHTML = `<strong>${translations[language].contribution}：</strong>${text(project.role)}`;
      details.appendChild(contribution);
      const mediaNote = document.createElement("p");
      mediaNote.textContent = text(project.media.note);
      details.appendChild(mediaNote);
      const exhibitions = renderExhibitions(project);
      if (exhibitions) details.appendChild(exhibitions);
      if (Array.isArray(project.media.previews) && project.media.previews.length > 0) {
        const previewList = document.createElement("ul");
        previewList.className = "preview-list";
        project.media.previews.forEach((preview) => {
          const item = document.createElement("li");
          item.textContent = preview.duration ? `${text(preview.label)} · ${preview.duration}` : text(preview.label);
          previewList.appendChild(item);
          if (project.media.previews.length > 1 && preview !== project.media.previews[0]) {
            const inlineVideo = document.createElement("video");
            inlineVideo.className = "inline-preview-video";
            configureVideo(inlineVideo, "none");
            inlineVideo.poster = project.media.poster;
            addVideoSources(inlineVideo, preview);
            item.appendChild(inlineVideo);
          }
        });
        details.appendChild(previewList);
      }
      body.appendChild(details);
      body.appendChild(renderLinks(project));
      card.appendChild(body);
      grid.appendChild(card);
    });
  }
  function applyTranslations() {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      if (translations[language][key]) element.textContent = translations[language][key];
    });
    document.getElementById("languageToggle").textContent = language === "zh" ? "EN" : "中文";
    document.getElementById("languageToggle").setAttribute("aria-pressed", String(language === "en"));
    const contactEmail = document.getElementById("contactEmail");
    const email = language === "zh" ? "iswangjr@foxmail.com" : "iswangjr05@gmail.com";
    if (contactEmail) {
      contactEmail.href = `mailto:${email}`;
      contactEmail.textContent = `${email} ↗`;
    }
    renderProjects();
  }
  document.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    renderProjects();
  }));
  document.getElementById("languageToggle").addEventListener("click", () => { language = language === "zh" ? "en" : "zh"; applyTranslations(); });
  applyTranslations();
})();
