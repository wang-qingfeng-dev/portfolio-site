(function () {
  "use strict";

  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const translations = {
    zh: {
      brandName: "王青锋", footerCredit: "© 2026 王青锋", schoolName: "重庆对外经贸学院", navWork: "作品", navAbout: "关于我", navContact: "联系", eyebrow: "UNITY · AR · 3D · INTERACTION",
      heroTitle: "把交互想法做成可运行的世界。", heroLede: "数字媒体技术本科生，专注 Unity 游戏玩法、AR 体验和可验证的交互系统。预计 2027 年 6 月毕业。",
      viewWork: "查看作品", github: "GitHub", signalLabel: "Focus", signalValue: "Interactive 3D", selectedWork: "SELECTED WORK", workTitle: "从玩法到真实场景",
      filterAll: "全部", filterUnity: "Unity 作品", filterEngineering: "工程项目", filterInteractive: "交互装置", filterModeling: "建模与动画", aboutEyebrow: "ABOUT", aboutTitle: "我关心的不只是画面。",
      aboutText: "我喜欢把一个模糊的体验目标拆成输入、状态、反馈和可测试的运行流程。作品覆盖 Unity 游戏玩法、灾害教育交互、TouchDesigner 实时装置、C4D/Blender 三维制作、机器人系统集成和计算机视觉研究。",
      factSchool: "学校", factMajor: "专业", factGrad: "毕业时间", factInterest: "方向", major: "数字媒体技术", interest: "Unity / AR / HCI", academicTitle: "学业表现", academicAverage: "2025–2026 学年平均成绩：90.39", academicCertificate: "Coursera · Machine Learning Specialization（2026）",
      contactEyebrow: "链接与联系方式", contactTitle: "GitHub 与联系方式", contactGithubLabel: "GitHub：", contactEmailLabel: "联系邮箱：",
      footerNote: "公开页面展示项目说明和完整演示。", mediaPublic: "演示视频", mediaPending: "演示视频", mediaPrivate: "演示视频", exhibitionTitle: "展览记录",
      details: "查看项目说明", contribution: "完成内容", openLink: "打开链接"
    },
    en: {
      brandName: "Qingfeng Wang", footerCredit: "© 2026 Qingfeng Wang", schoolName: "Chongqing College of International Business and Economics", navWork: "Work", navAbout: "About", navContact: "Contact", eyebrow: "UNITY · AR · 3D · INTERACTION",
      heroTitle: "Turning interaction ideas into runnable worlds.", heroLede: "A Digital Media Technology undergraduate focused on Unity gameplay, AR experiences, and testable interactive systems. Graduating in June 2027.",
      viewWork: "View work", github: "GitHub", signalLabel: "Focus", signalValue: "Interactive 3D", selectedWork: "SELECTED WORK", workTitle: "From gameplay to real places",
      filterAll: "All", filterUnity: "Unity work", filterEngineering: "Engineering projects", filterInteractive: "Interactive installations", filterModeling: "Modeling & animation", aboutEyebrow: "ABOUT", aboutTitle: "The frame is only the beginning.",
      aboutText: "I like breaking an ambiguous experience goal into inputs, states, feedback, and testable runtime flows. My work spans Unity gameplay, disaster-education interaction, TouchDesigner installations, C4D/Blender 3D production, robot systems integration, and computer-vision research.",
      factSchool: "School", factMajor: "Major", factGrad: "Graduation", factInterest: "Focus", major: "Digital Media Technology", interest: "Unity / AR / HCI", academicTitle: "Academic highlights", academicAverage: "2025–2026 annual average: 90.39", academicCertificate: "Coursera · Machine Learning Specialization (2026)",
      contactEyebrow: "LINKS & CONTACT", contactTitle: "GitHub and contact", contactGithubLabel: "GitHub:", contactEmailLabel: "Email:",
      footerNote: "The public page presents project notes and full demos.", mediaPublic: "Demo video", mediaPending: "Demo video", mediaPrivate: "Demo video", exhibitionTitle: "Exhibition record",
      details: "View project notes", contribution: "Work completed", openLink: "Open link"
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
    video.controls = false;
    video.preload = preload;
    video.playsInline = true;
    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
  }
  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const total = Math.floor(seconds);
    const minutes = Math.floor(total / 60).toString().padStart(2, "0");
    const remainder = (total % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}`;
  }
  function createVideoControls(video) {
    const controls = document.createElement("div");
    controls.className = "video-controls";
    controls.setAttribute("aria-label", language === "zh" ? "视频控制" : "Video controls");
    const playButton = document.createElement("button");
    playButton.type = "button";
    playButton.className = "video-control-button video-play";
    const progress = document.createElement("input");
    progress.type = "range";
    progress.className = "video-progress";
    progress.min = "0";
    progress.max = "100";
    progress.step = "0.1";
    progress.value = "0";
    progress.setAttribute("aria-label", language === "zh" ? "视频进度" : "Video progress");
    const time = document.createElement("span");
    time.className = "video-time";
    time.textContent = "00:00 / 00:00";
    const volumeLabel = document.createElement("span");
    volumeLabel.className = "video-volume-label";
    volumeLabel.textContent = language === "zh" ? "音量" : "Volume";
    const volume = document.createElement("input");
    volume.type = "range";
    volume.className = "video-volume";
    volume.min = "0";
    volume.max = "1";
    volume.step = "0.01";
    volume.value = String(video.volume);
    volume.setAttribute("aria-label", language === "zh" ? "音量大小" : "Volume level");
    const muteButton = document.createElement("button");
    muteButton.type = "button";
    muteButton.className = "video-control-button video-mute";
    const fullscreenButton = document.createElement("button");
    fullscreenButton.type = "button";
    fullscreenButton.className = "video-control-button video-fullscreen";
    fullscreenButton.textContent = "⛶";
    let isScrubbing = false;
    let nativeRangeInputSeen = false;
    let hideTimer = null;
    const target = video.closest(".project-visual") || video;

    function showTransientControls() {
      if (!target.classList.contains("is-expanded") && document.fullscreenElement !== target) return;
      target.classList.add("controls-visible");
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => target.classList.remove("controls-visible"), 2200);
    }

    function updateControls() {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const current = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      if (!isScrubbing) progress.value = duration > 0 ? String((current / duration) * 100) : "0";
      time.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
      playButton.textContent = video.paused ? "▶" : "❚❚";
      playButton.setAttribute("aria-label", video.paused ? (language === "zh" ? "播放" : "Play") : (language === "zh" ? "暂停" : "Pause"));
      muteButton.textContent = video.muted || video.volume === 0 ? "🔇" : "🔊";
      muteButton.setAttribute("aria-label", video.muted || video.volume === 0 ? (language === "zh" ? "取消静音" : "Unmute") : (language === "zh" ? "静音" : "Mute"));
      const volumePercent = Math.round(video.volume * 100);
      muteButton.title = language === "zh"
        ? `${video.muted ? "已静音" : `音量 ${volumePercent}%`}，使用滚轮或上下键调节`
        : `${video.muted ? "Muted" : `Volume ${volumePercent}%`}. Use the wheel or arrow keys to adjust.`;
      const target = video.closest(".project-visual") || video;
      const expanded = document.fullscreenElement === target || target.classList.contains("is-expanded");
      fullscreenButton.setAttribute("aria-label", expanded ? (language === "zh" ? "退出全屏" : "Exit fullscreen") : (language === "zh" ? "放大视频" : "Fullscreen"));
    }
    function pauseOtherVideos() {
      document.querySelectorAll("video").forEach((other) => {
        if (other !== video) other.pause();
      });
    }
    playButton.addEventListener("click", () => {
      if (video.paused) {
        pauseOtherVideos();
        video.play().catch(() => {});
      } else video.pause();
    });
    function seekToProgress() {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const percentage = Math.max(0, Math.min(100, Number(progress.value) || 0));
      video.currentTime = (percentage / 100) * video.duration;
    }
    function adjustVolume(delta) {
      const current = video.muted ? 0 : video.volume;
      const next = Math.max(0, Math.min(1, current + delta));
      video.volume = next;
      video.muted = next === 0;
      volume.value = String(next);
      updateControls();
    }
    function setProgressFromPointer(event) {
      const rect = progress.getBoundingClientRect();
      if (!Number.isFinite(video.duration) || video.duration <= 0 || rect.width <= 0) return;
      const offsetX = Number(event.offsetX);
      const pointerOffset = event.clientX - rect.left;
      const localX = (event.type === "pointerdown" || event.type === "click") && Number.isFinite(offsetX) && offsetX >= 0 && offsetX <= rect.width
        ? offsetX
        : pointerOffset;
      const ratio = Math.max(0, Math.min(1, localX / rect.width));
      progress.value = String(ratio * 100);
      seekToProgress();
    }
    progress.addEventListener("input", () => {
      nativeRangeInputSeen = true;
      seekToProgress();
    });
    progress.addEventListener("change", () => {
      seekToProgress();
      isScrubbing = false;
      updateControls();
    });
    progress.addEventListener("pointerdown", (event) => {
      isScrubbing = true;
      nativeRangeInputSeen = false;
      progress.setPointerCapture?.(event.pointerId);
    });
    progress.addEventListener("pointermove", (event) => {
      if (isScrubbing && !nativeRangeInputSeen) setProgressFromPointer(event);
    });
    progress.addEventListener("pointerup", (event) => {
      isScrubbing = false;
      progress.releasePointerCapture?.(event.pointerId);
      window.setTimeout(() => {
        seekToProgress();
        updateControls();
      }, 0);
    });
    progress.addEventListener("pointercancel", () => { isScrubbing = false; updateControls(); });
    progress.addEventListener("click", (event) => {
      if (!nativeRangeInputSeen) setProgressFromPointer(event);
      seekToProgress();
      window.setTimeout(updateControls, 0);
    });
    volume.addEventListener("input", () => {
      video.volume = Number(volume.value);
      video.muted = video.volume === 0;
      updateControls();
    });
    muteButton.addEventListener("click", () => {
      video.muted = !video.muted;
      if (!video.muted && video.volume === 0) {
        video.volume = 0.8;
        volume.value = "0.8";
      }
      updateControls();
    });
    muteButton.addEventListener("wheel", (event) => {
      event.preventDefault();
      adjustVolume(event.deltaY < 0 ? 0.1 : -0.1);
    }, { passive: false });
    muteButton.addEventListener("keydown", (event) => {
      const steps = event.key === "PageUp" || event.key === "PageDown" ? 0.2 : 0.1;
      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        adjustVolume(steps);
      } else if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        adjustVolume(-steps);
      }
    });
    fullscreenButton.addEventListener("click", () => {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          const exitResult = document.exitFullscreen();
          if (exitResult && typeof exitResult.catch === "function") exitResult.catch(() => {});
        }
      } else if (target.classList.contains("is-expanded")) {
        target.classList.remove("is-expanded");
        target.classList.remove("controls-visible");
        updateControls();
      } else if (typeof target.requestFullscreen === "function") {
        const requestResult = target.requestFullscreen();
        if (requestResult && typeof requestResult.catch === "function") requestResult.catch(() => {});
        window.setTimeout(() => {
          if (!document.fullscreenElement && !target.classList.contains("is-expanded")) {
            target.classList.add("is-expanded");
            showTransientControls();
            updateControls();
          }
        }, 250);
      } else {
        target.classList.toggle("is-expanded");
        updateControls();
      }
    });
    video.addEventListener("play", pauseOtherVideos);
    ["loadedmetadata", "durationchange", "timeupdate", "play", "pause", "ended", "volumechange"].forEach((eventName) => video.addEventListener(eventName, updateControls));
    target.addEventListener("pointermove", showTransientControls);
    target.addEventListener("focusin", showTransientControls);
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement === target) showTransientControls();
      else target.classList.remove("controls-visible");
      updateControls();
    });
    controls.append(playButton, progress, time, volumeLabel, volume, muteButton, fullscreenButton);
    updateControls();
    return controls;
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
      visual.appendChild(createVideoControls(video));
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
  function renderGallery(project) {
    const gallery = project.media && project.media.gallery;
    if (!gallery || !Array.isArray(gallery.images) || gallery.images.length === 0) return null;
    const section = document.createElement("section");
    section.className = "exhibition-evidence";
    const heading = document.createElement("h4");
    heading.textContent = text(gallery.title);
    section.appendChild(heading);
    if (gallery.note) {
      const note = document.createElement("p");
      note.textContent = text(gallery.note);
      section.appendChild(note);
    }
    const imageGrid = document.createElement("div");
    imageGrid.className = "exhibition-gallery";
    gallery.images.forEach((imagePath) => {
      const image = document.createElement("img");
      image.src = imagePath;
      image.alt = `${text(project.title)} · ${text(gallery.title)}`;
      image.loading = "lazy";
      imageGrid.appendChild(image);
    });
    section.appendChild(imageGrid);
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
      meta.innerHTML = `<span>${project.year}</span>`;
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
      const gallery = renderGallery(project);
      if (gallery) details.appendChild(gallery);
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
            item.appendChild(createVideoControls(inlineVideo));
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
