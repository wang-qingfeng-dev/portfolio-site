(function () {
  "use strict";

  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const translations = {
    zh: {
      brandName: "王青锋", footerCredit: "© 2026 王青锋", schoolName: "重庆对外经贸学院", navWork: "作品", navAbout: "关于我", navContact: "联系", eyebrow: "UNITY · AR · 3D · INTERACTION",
      heroTitle: "把交互想法做成可运行的世界。", heroLede: "数字媒体技术本科生，专注 Unity 游戏玩法、AR 体验和可验证的交互系统。预计 2027 年 6 月毕业。",
      pageTitle: "王青锋 · 交互系统作品集", viewWork: "查看作品", github: "GitHub", signalLabel: "Focus", signalValue: "Interactive 3D", selectedWork: "SELECTED WORK", workTitle: "从玩法到真实场景",
      filterAll: "全部", filterUnity: "Unity 作品", filterEngineering: "工程项目", filterInteractive: "交互装置", filterModeling: "建模与动画", filterEditing: "影像制作", aboutEyebrow: "ABOUT", aboutTitle: "我关心的不只是画面。",
      aboutText: "我喜欢把一个模糊的体验目标拆成输入、状态、反馈和可测试的运行流程。作品覆盖 Unity 游戏玩法、灾害教育交互、TouchDesigner 实时装置、C4D/Blender 三维制作、机器人系统集成和计算机视觉研究。",
      factSchool: "学校", factMajor: "专业", factGrad: "毕业时间", factInterest: "方向", major: "数字媒体技术", interest: "Unity / AR / HCI", academicTitle: "学业表现", academicAverage: "2025–2026 学年平均成绩：90.39", academicRank: "2025–2026 学年年级第 1 / 92", academicCertificate: "Coursera · Machine Learning Specialization（2026）",
      contactEyebrow: "链接与联系方式", contactTitle: "GitHub 与联系方式", contactGithubLabel: "GitHub：", contactEmailLabel: "联系邮箱：",
      footerNote: "公开页面展示项目说明和完整演示。", mediaPublic: "演示视频", mediaPending: "演示视频", mediaPrivate: "演示视频", exhibitionTitle: "展览记录",
      details: "查看项目说明", openLink: "打开链接"
    },
    en: {
      brandName: "Qingfeng Wang", footerCredit: "© 2026 Qingfeng Wang", schoolName: "Chongqing College of International Business and Economics", navWork: "Work", navAbout: "About", navContact: "Contact", eyebrow: "UNITY · AR · 3D · INTERACTION",
      heroTitle: "Turning interaction ideas into runnable worlds.", heroLede: "A Digital Media Technology undergraduate focused on Unity gameplay, AR experiences, and testable interactive systems. Graduating in June 2027.",
      pageTitle: "Qingfeng Wang · Interactive Systems Portfolio", viewWork: "View work", github: "GitHub", signalLabel: "Focus", signalValue: "Interactive 3D", selectedWork: "SELECTED WORK", workTitle: "From gameplay to real places",
      filterAll: "All", filterUnity: "Unity work", filterEngineering: "Engineering projects", filterInteractive: "Interactive installations", filterModeling: "Modeling & animation", filterEditing: "Moving image", aboutEyebrow: "ABOUT", aboutTitle: "The frame is only the beginning.",
      aboutText: "I like breaking an ambiguous experience goal into inputs, states, feedback, and testable runtime flows. My work spans Unity gameplay, disaster-education interaction, TouchDesigner installations, C4D/Blender 3D production, robot systems integration, and computer-vision research.",
      factSchool: "School", factMajor: "Major", factGrad: "Graduation", factInterest: "Focus", major: "Digital Media Technology", interest: "Unity / AR / HCI", academicTitle: "Academic highlights", academicAverage: "2025–2026 annual average: 90.39", academicRank: "Ranked 1st of 92 students in 2025–2026", academicCertificate: "Coursera · Machine Learning Specialization (2026)",
      contactEyebrow: "LINKS & CONTACT", contactTitle: "GitHub and contact", contactGithubLabel: "GitHub:", contactEmailLabel: "Email:",
      footerNote: "The public page presents project notes and full demos.", mediaPublic: "Demo video", mediaPending: "Demo video", mediaPrivate: "Demo video", exhibitionTitle: "Exhibition record",
      details: "View project notes", openLink: "Open link"
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
  function parseDurationLabel(value) {
    if (Number.isFinite(value)) return Math.max(0, value);
    if (typeof value !== "string" || !value.trim()) return 0;
    const parts = value.split(":").map(Number);
    if (parts.some((part) => !Number.isFinite(part) || part < 0)) return 0;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  }
  // Public playback starts at 720p. 480p files remain as legacy fallbacks,
  // but they are never offered to viewers.
  const QUALITY_LABELS = ["720", "1080"];
  const ALL_QUALITY_LABELS = ["480", "720", "1080"];
  const QUALITY_RANK = Object.freeze({ "480": 480, "720": 720, "1080": 1080 });
  const MIN_PUBLIC_QUALITY = "720";
  function mirrorConfig() { return window.PORTFOLIO_MIRROR || {}; }
  function assetCandidates(path) {
    if (!path) return [];
    if (/^(?:https?:)?\/\//.test(path)) return [path];
    const mirror = mirrorConfig();
    const base = typeof mirror.baseUrl === "string" ? mirror.baseUrl.replace(/\/+$/, "") : "";
    const mirrorPath = mirror.enabled && base ? base + "/" + path.replace(/^\/+/, "") : "";
    return [mirrorPath, path].filter((candidate, index, list) => candidate && list.indexOf(candidate) === index);
  }
  function assetUrl(path) { return assetCandidates(path)[0] || path || ""; }
  function setAssetWithFallback(element, path) {
    const candidates = assetCandidates(path);
    let index = 0;
    if (!candidates.length) return;
    element.src = candidates[index];
    if (candidates.length > 1 && mirrorConfig().fallbackToPrimary !== false) {
      element.addEventListener("error", () => {
        if (index >= candidates.length - 1) return;
        index += 1;
        element.src = candidates[index];
      });
    }
  }
  function qualitySourcesFor(preview) {
    // Expose configured 1080p paths on every host. Large files can be placed
    // in the domestic mirror or a release; until then the error handler falls
    // back to the verified 720p source without offering 480p.
    return {
      "480": preview.qualitySources?.["480"] || preview.path || "",
      "720": preview.qualitySources?.["720"] || preview.hdPath || "",
      "1080": preview.qualitySources?.["1080"] || preview.fullHdPath || ""
    };
  }
  function configuredQualities(video) {
    return ALL_QUALITY_LABELS.filter((quality) => video.__qualitySources?.[quality]);
  }
  function availableQualities(video) {
    const configured = configuredQualities(video);
    return configured.filter((quality) => QUALITY_RANK[quality] >= QUALITY_RANK[MIN_PUBLIC_QUALITY]);
  }
  function chooseVideoQuality(video, requested) {
    const available = availableQualities(video);
    if (!available.length) return "";
    if (requested !== "auto" && available.includes(requested)) return requested;
    // 国内访问优先从同域名 720p 开始，减少首屏请求和跨境大文件卡顿。
    // 1080p 仍保留在清晰度菜单中，由用户在网络条件允许时手动选择。
    return available.includes(MIN_PUBLIC_QUALITY) ? MIN_PUBLIC_QUALITY : available[available.length - 1];
  }
  function lowerQuality(video, quality) {
    const available = availableQualities(video);
    const index = available.indexOf(quality);
    return index > 0 ? available[index - 1] : "";
  }
  function createQualityBuffer(activeVideo) {
    const target = activeVideo.closest(".project-visual");
    if (!target) return null;
    const buffer = document.createElement("video");
    buffer.className = "project-video project-video-buffer";
    buffer.setAttribute("aria-hidden", "true");
    configureVideo(buffer, "auto");
    buffer.muted = activeVideo.muted;
    buffer.defaultMuted = activeVideo.defaultMuted;
    buffer.volume = activeVideo.volume;
    buffer.poster = activeVideo.poster || "";
    target.insertBefore(buffer, target.querySelector(".video-controls"));
    if (typeof activeVideo.__bindQualityBuffer === "function") activeVideo.__bindQualityBuffer(buffer);
    return buffer;
  }
  function finalizeQualitySwitch(video, buffer, activeVideo, resolvedQuality, requested, currentTime, wasPlaying, token) {
    if (token !== video.__qualityLoadToken || !buffer.isConnected) {
      // A newer quality request superseded this buffer before it became ready.
      // Detach it so it cannot keep downloading or retain stale event closures.
      buffer.remove();
      return;
    }
    const duration = Number.isFinite(buffer.duration) && buffer.duration > 0 ? buffer.duration : 0;
    const switchNow = () => {
      if (token !== video.__qualityLoadToken || !buffer.isConnected) {
        if (video.__pendingQualityBuffer === buffer) video.__pendingQualityBuffer = null;
        buffer.remove();
        return;
      }
      buffer.classList.add("is-active");
      buffer.removeAttribute("aria-hidden");
      activeVideo.classList.remove("is-active");
      activeVideo.setAttribute("aria-hidden", "true");
      activeVideo.pause();
      video.__activeVideo = buffer;
      video.__qualityBuffer = buffer;
      video.__pendingQualityBuffer = null;
      video.__pendingQualityRequest = null;
      buffer.__bindQualityBuffer = video.__bindQualityBuffer;
      video.dataset.quality = requested === "auto" ? "auto" : resolvedQuality;
      video.dataset.resolvedQuality = resolvedQuality;
      if (wasPlaying) buffer.play().catch(() => {});
      if (activeVideo !== video) activeVideo.remove();
      if (typeof video.__qualitySwitchComplete === "function") video.__qualitySwitchComplete(buffer);
    };
    const targetTime = duration > 0 ? Math.min(Math.max(0, currentTime), duration) : 0;
    if (targetTime <= 0) {
      window.requestAnimationFrame(switchNow);
      return;
    }
    // Safari can report canplay before a seek has committed. Poll the
    // timeline while listening for seeked so the first displayed frame stays
    // at the same point as the old video. The timer also covers Safari builds
    // that do not emit seeked for a hidden, muted buffer.
    let settled = false;
    let seekAttempts = 0;
    let seekTimer = null;
    const cleanUpSeek = () => {
      buffer.removeEventListener("seeked", checkSeek);
      if (seekTimer) window.clearTimeout(seekTimer);
      seekTimer = null;
    };
    const abandonSeek = () => {
      if (settled) return;
      settled = true;
      cleanUpSeek();
      // Keep the old video playing if the new source cannot seek to the
      // requested position. A failed quality switch must never jump to 0.
      if (video.__pendingQualityBuffer === buffer) video.__pendingQualityBuffer = null;
      video.__pendingQualityRequest = null;
      buffer.remove();
    };
    const checkSeek = () => {
      if (settled) return;
      const observedTime = Number(buffer.currentTime);
      if (targetTime <= 0 || (Number.isFinite(observedTime) && Math.abs(observedTime - targetTime) <= 0.35)) {
        settled = true;
        cleanUpSeek();
        window.requestAnimationFrame(switchNow);
        return;
      }
      if (seekAttempts >= 20) {
        abandonSeek();
        return;
      }
      seekAttempts += 1;
      try {
        buffer.currentTime = targetTime;
      } catch (_) {
        abandonSeek();
        return;
      }
      seekTimer = window.setTimeout(checkSeek, 120);
    };
    buffer.addEventListener("seeked", checkSeek);
    try {
      buffer.currentTime = targetTime;
      seekTimer = window.setTimeout(checkSeek, 80);
    } catch (_) {
      abandonSeek();
    }
  }
  function setVideoQuality(video, requested, preservePlayback, playbackState, loadNow = true) {
    const activeVideo = video.__activeVideo || video;
    const pendingBuffer = video.__pendingQualityBuffer;
    if (pendingBuffer && pendingBuffer !== activeVideo) pendingBuffer.remove();
    video.__pendingQualityBuffer = null;
    // 保存切换前的播放位置；源文件加载失败时浏览器可能先把 currentTime 重置为 0。
    const currentTime = Number.isFinite(playbackState?.currentTime)
      ? playbackState.currentTime
      : (Number.isFinite(activeVideo.currentTime) ? activeVideo.currentTime : 0); // preserve video.currentTime across the buffered switch
    const wasPlaying = typeof playbackState?.wasPlaying === "boolean" ? playbackState.wasPlaying : !activeVideo.paused;
    const resolvedQuality = chooseVideoQuality(video, requested);
    const sourcePath = video.__qualitySources?.[resolvedQuality];
    if (!sourcePath) return;
    video.__pendingQualityRequest = loadNow ? requested : null;
    const candidates = assetCandidates(sourcePath);
    let candidateIndex = 0;
    const token = (video.__qualityLoadToken || 0) + 1;
    video.__qualityLoadToken = token;
    if (!loadNow) {
      video.dataset.quality = requested === "auto" ? "auto" : resolvedQuality;
      video.dataset.resolvedQuality = resolvedQuality;
      const loadCandidate = () => {
        video.src = candidates[candidateIndex];
        if (loadNow) video.load();
      };
      const onInitialError = () => {
        if (token !== video.__qualityLoadToken) return;
        if (candidateIndex < candidates.length - 1) {
          candidateIndex += 1;
          loadCandidate();
          return;
        }
        const fallback = lowerQuality(video, resolvedQuality);
        if (fallback) setVideoQuality(video, fallback, false, { currentTime: 0, wasPlaying: false }, false);
      };
      video.removeEventListener("error", video.__qualityErrorHandler);
      video.__qualityErrorHandler = onInitialError;
      video.addEventListener("error", onInitialError);
      loadCandidate();
      return;
    }
    const buffer = createQualityBuffer(activeVideo);
    if (!buffer) return;
    video.__pendingQualityBuffer = buffer;
    let readyToSwitch = false;
    const restoreAndSwitch = () => {
      if (token !== video.__qualityLoadToken) return;
      if (readyToSwitch) return;
      // canplay can fire before metadata/duration is available (especially
      // when the source is remote). Keep the current video active until the
      // buffer has a real timeline, otherwise currentTime would be clamped to
      // 0 and the visible player would jump to the beginning.
      if (!Number.isFinite(buffer.duration) || buffer.duration <= 0 || buffer.readyState < 1) return;
      readyToSwitch = true;
      ["loadedmetadata", "durationchange", "loadeddata", "canplay"].forEach((eventName) => buffer.removeEventListener(eventName, restoreAndSwitch));
      finalizeQualitySwitch(video, buffer, activeVideo, resolvedQuality, requested, currentTime, preservePlayback && wasPlaying, token);
    };
    const onError = () => {
      if (token !== video.__qualityLoadToken) return;
      if (candidateIndex < candidates.length - 1) {
        candidateIndex += 1;
        loadCandidate();
        return;
      }
      buffer.remove();
      video.__pendingQualityBuffer = null;
      video.__pendingQualityRequest = null;
      const fallback = lowerQuality(video, resolvedQuality);
      if (fallback) setVideoQuality(video, fallback, preservePlayback, { currentTime, wasPlaying });
    };
    const loadCandidate = () => {
      buffer.src = candidates[candidateIndex];
      buffer.load();
    };
    video.removeEventListener("error", video.__qualityErrorHandler);
    video.__qualityErrorHandler = onError;
    buffer.addEventListener("error", onError);
    ["loadedmetadata", "durationchange", "loadeddata", "canplay"].forEach((eventName) => buffer.addEventListener(eventName, restoreAndSwitch));
    loadCandidate();
  }
  function addVideoSources(video, preview) {
    video.__qualitySources = qualitySourcesFor(preview);
    video.__activeVideo = video;
    video.dataset.quality = "auto";
    // Set the initial source without starting network work for every card.
    // The first play or an explicit quality choice calls load() on demand.
    setVideoQuality(video, "auto", false, undefined, false);
  }
  function configureVideo(video, preload) {
    video.controls = false;
    video.preload = preload;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
  }
  function activeMediaFor(video) { return video.__activeVideo || video; }
  function recoverSuspendedVideo(video) {
    const active = activeMediaFor(video);
    if (!active || !active.isConnected || !active.src) return;
    const hasStarted = video.__mediaLoadStarted || video.__hasPlayed || active.currentTime > 0;
    if (!hasStarted || video.__recoveringSafariVideo) return;
    const hasDecodedFrame = active.readyState >= 2 && active.videoWidth > 0 && active.videoHeight > 0;
    if (hasDecodedFrame && !active.error) return;
    const savedTime = Number.isFinite(active.currentTime) ? active.currentTime : 0;
    const wasPlaying = !active.paused;
    const source = active.currentSrc || active.src;
    if (!source) return;
    video.__recoveringSafariVideo = true;
    video.classList.add("video-poster");
    const finish = () => {
      if (!video.__recoveringSafariVideo) return;
      if (active.readyState < 2 || active.videoWidth <= 0 || active.videoHeight <= 0) return;
      video.__recoveringSafariVideo = false;
      active.removeEventListener("loadeddata", finish);
      active.removeEventListener("canplay", finish);
      active.removeEventListener("error", fail);
      if (savedTime > 0 && Number.isFinite(active.duration) && active.duration > 0) {
        try { active.currentTime = Math.min(savedTime, active.duration); } catch (_) { /* Safari may still be seeking. */ }
      }
      video.classList.remove("video-poster");
      if (wasPlaying) active.play().catch(() => {});
    };
    const fail = () => {
      video.__recoveringSafariVideo = false;
      video.classList.remove("video-poster");
      active.removeEventListener("loadeddata", finish);
      active.removeEventListener("canplay", finish);
      active.removeEventListener("error", fail);
    };
    active.addEventListener("loadeddata", finish);
    active.addEventListener("canplay", finish);
    active.addEventListener("error", fail, { once: true });
    // Reassigning the same source before load() forces Safari to rebuild the
    // decoder after it has reclaimed an off-screen video layer.
    active.src = source;
    active.load();
  }
  function recoverVisibleVideos() {
    document.querySelectorAll(".project-video").forEach((video) => recoverSuspendedVideo(video));
  }
  function watchVideoForSafari(video) {
    if (!video || video.__safariWatched) return;
    video.__safariWatched = true;
    if (typeof window.IntersectionObserver === "function") {
      if (!window.__portfolioVideoObserver) {
        window.__portfolioVideoObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) recoverSuspendedVideo(entry.target);
          });
        }, { rootMargin: "240px 0px" });
      }
      window.__portfolioVideoObserver.observe(video);
    }
  }
  function installVideoRecoveryHooks() {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) window.setTimeout(recoverVisibleVideos, 80);
    });
    window.addEventListener("pageshow", () => window.setTimeout(recoverVisibleVideos, 80));
  }
  function isIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }
  function lockPageForVideo(target) {
    if (document.body.classList.contains("video-modal-open")) return;
    const body = document.body;
    body.__videoModalStyles = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow
    };
    body.__videoModalScrollY = window.scrollY || window.pageYOffset || 0;
    body.classList.add("video-modal-open");
    document.documentElement.classList.add("video-modal-open");
    body.style.position = "fixed";
    body.style.top = `-${body.__videoModalScrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    target.__videoModalLocked = true;
  }
  function unlockPageForVideo(target) {
    if (!target.__videoModalLocked) return;
    const body = document.body;
    const scrollY = body.__videoModalScrollY || 0;
    const previous = body.__videoModalStyles || {};
    body.classList.remove("video-modal-open");
    document.documentElement.classList.remove("video-modal-open");
    body.style.position = previous.position || "";
    body.style.top = previous.top || "";
    body.style.width = previous.width || "";
    body.style.overflow = previous.overflow || "";
    target.__videoModalLocked = false;
    body.__videoModalStyles = null;
    body.__videoModalScrollY = 0;
    window.scrollTo(0, scrollY);
  }
  function enterExpandedVideo(target) {
    const previous = document.querySelector(".project-visual.is-expanded");
    if (previous && previous !== target) {
      previous.classList.remove("is-expanded", "controls-visible");
      unlockPageForVideo(previous);
    }
    lockPageForVideo(target);
    target.classList.add("is-expanded", "controls-visible");
  }
  function exitExpandedVideo(target) {
    target.classList.remove("is-expanded", "controls-visible");
    unlockPageForVideo(target);
  }
  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const total = Math.floor(seconds);
    const minutes = Math.floor(total / 60).toString().padStart(2, "0");
    const remainder = (total % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}`;
  }
  function createVideoControls(video, preview) {
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
    time.textContent = "00:00 / " + formatTime(parseDurationLabel(preview?.duration));
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
    const volumeControl = document.createElement("span");
    volumeControl.className = "video-volume-control";
    volumeControl.setAttribute("role", "group");
    volumeControl.setAttribute("aria-label", language === "zh" ? "音量控制" : "Volume control");
    volumeControl.append(muteButton, volume);
    const fullscreenButton = document.createElement("button");
    fullscreenButton.type = "button";
    fullscreenButton.className = "video-control-button video-fullscreen";
    fullscreenButton.textContent = "⛶";
    const quality = document.createElement("select");
    quality.className = "video-quality";
    quality.setAttribute("aria-label", language === "zh" ? "视频清晰度" : "Video quality");
    [["auto", language === "zh" ? "自动" : "Auto"], ...availableQualities(video).map((value) => [value, value + "p"])]
      .forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        quality.appendChild(option);
      });
    quality.value = video.dataset.quality || "auto";
    const qualityStatus = document.createElement("span");
    qualityStatus.className = "video-quality-status";
    const knownDuration = parseDurationLabel(preview?.duration);
    let isScrubbing = false;
    let pendingSeekRatio = null;
    let mediaLoadStarted = false;
    let hideTimer = null;
    const target = video.closest(".project-visual") || video;
    const getActiveVideo = () => video.__activeVideo || video;

    function bindMedia(media) {
      if (!media || media.__controlsBound) return;
      media.__controlsBound = true;
      media.addEventListener("play", () => {
        video.__hasPlayed = true;
        pauseOtherVideos(media);
      });
      ["loadeddata", "playing"].forEach((eventName) => media.addEventListener(eventName, () => video.classList.remove("video-poster")));
      ["durationchange", "timeupdate", "play", "pause", "ended", "volumechange", "webkitbeginfullscreen", "webkitendfullscreen"]
        .forEach((eventName) => media.addEventListener(eventName, updateControls));
    }
    video.__bindQualityBuffer = bindMedia;
    video.__qualitySwitchComplete = (active) => {
      bindMedia(active);
      updateControls();
    };

    function ensureMediaLoaded() {
      if (mediaLoadStarted) return;
      mediaLoadStarted = true;
      video.__mediaLoadStarted = true;
      const active = getActiveVideo();
      active.preload = "auto";
      if (active.readyState === 0) active.load();
    }

    function showTransientControls() {
      if (!target.classList.contains("is-expanded") && document.fullscreenElement !== target) return;
      target.classList.add("controls-visible");
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => target.classList.remove("controls-visible"), 2200);
    }

    function getDuration() {
      const active = getActiveVideo();
      return Number.isFinite(active.duration) && active.duration > 0 ? active.duration : knownDuration;
    }

    function updateControls() {
      const active = getActiveVideo();
      const duration = getDuration();
      const current = Number.isFinite(active.currentTime) ? active.currentTime : 0;
      if (!isScrubbing) progress.value = duration > 0 ? String((current / duration) * 100) : "0";
      progress.disabled = duration <= 0;
      time.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
      playButton.textContent = active.paused ? "▶" : "❚❚";
      playButton.setAttribute("aria-label", active.paused ? (language === "zh" ? "播放" : "Play") : (language === "zh" ? "暂停" : "Pause"));
      muteButton.textContent = active.muted || active.volume === 0 ? "🔇" : "🔊";
      muteButton.setAttribute("aria-label", active.muted || active.volume === 0 ? (language === "zh" ? "取消静音" : "Unmute") : (language === "zh" ? "静音" : "Mute"));
      const volumePercent = Math.round(active.volume * 100);
      muteButton.title = language === "zh"
        ? `${active.muted ? "已静音" : `音量 ${volumePercent}%`}`
        : `${active.muted ? "Muted" : `Volume ${volumePercent}%`}`;
      const expanded = document.fullscreenElement === target || target.classList.contains("is-expanded");
      fullscreenButton.setAttribute("aria-label", expanded ? (language === "zh" ? "退出全屏" : "Exit fullscreen") : (language === "zh" ? "放大视频" : "Fullscreen"));
      const resolvedQuality = video.dataset.resolvedQuality || availableQualities(video)[0] || MIN_PUBLIC_QUALITY;
      const resolvedLabel = resolvedQuality + "p";
      qualityStatus.textContent = language === "zh" ? `当前 ${resolvedLabel}` : `Now ${resolvedLabel}`;
      quality.title = language === "zh" ? `当前清晰度：${resolvedLabel}` : `Current quality: ${resolvedLabel}`;
      const pendingQuality = video.__pendingQualityRequest;
      quality.value = pendingQuality || (video.dataset.quality === "auto" ? "auto" : resolvedQuality);
      quality.setAttribute("aria-label", language === "zh" ? `视频清晰度，当前${resolvedLabel}` : `Video quality, currently ${resolvedLabel}`);
    }
    function pauseOtherVideos(except) {
      document.querySelectorAll("video").forEach((other) => {
        if (other !== except) other.pause();
      });
    }
    playButton.addEventListener("click", () => {
      const active = getActiveVideo();
      if (active.paused) {
        ensureMediaLoaded();
        pauseOtherVideos(active);
        active.play().catch(() => {});
      } else active.pause();
    });
    function seekToProgress() {
      const percentage = Math.max(0, Math.min(100, Number(progress.value) || 0));
      const active = getActiveVideo();
      const duration = Number.isFinite(active.duration) && active.duration > 0 ? active.duration : 0;
      if (duration <= 0) {
        pendingSeekRatio = percentage / 100;
        ensureMediaLoaded();
        return;
      }
      pendingSeekRatio = null;
      active.currentTime = (percentage / 100) * duration;
    }
    function adjustVolume(delta) {
      const active = getActiveVideo();
      const current = active.muted ? 0 : active.volume;
      const next = Math.max(0, Math.min(1, current + delta));
      active.volume = next;
      active.muted = next === 0;
      volume.value = String(next);
      updateControls();
    }
    progress.addEventListener("input", () => {
      isScrubbing = true;
      seekToProgress();
      updateControls();
    });
    progress.addEventListener("change", () => {
      seekToProgress();
      isScrubbing = false;
      updateControls();
    });
    progress.addEventListener("blur", () => {
      if (!isScrubbing) return;
      seekToProgress();
      isScrubbing = false;
      updateControls();
    });
    quality.addEventListener("change", () => {
      setVideoQuality(video, quality.value, true);
      updateControls();
    });
    volume.addEventListener("input", () => {
      const active = getActiveVideo();
      active.volume = Number(volume.value);
      active.muted = active.volume === 0;
      updateControls();
    });
    muteButton.addEventListener("click", () => {
      const active = getActiveVideo();
      active.muted = !active.muted;
      if (!active.muted && active.volume === 0) {
        active.volume = 0.8;
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
      const active = getActiveVideo();
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          const exitResult = document.exitFullscreen();
          if (exitResult && typeof exitResult.catch === "function") exitResult.catch(() => {});
        }
      } else if (target.classList.contains("is-expanded")) {
        exitExpandedVideo(target);
        updateControls();
      } else if (isIOSDevice()) {
        // iOS Safari's native webkit fullscreen detaches the video layer from
        // the page. Keep the player in our fixed, scroll-locked modal instead.
        enterExpandedVideo(target);
        showTransientControls();
        updateControls();
      } else if (typeof target.requestFullscreen === "function") {
        const requestResult = target.requestFullscreen();
        if (requestResult && typeof requestResult.catch === "function") requestResult.catch(() => {});
        window.setTimeout(() => {
          if (!document.fullscreenElement && !target.classList.contains("is-expanded")) {
            enterExpandedVideo(target);
            showTransientControls();
            updateControls();
          }
        }, 250);
      } else {
        enterExpandedVideo(target);
        updateControls();
      }
    });
    video.addEventListener("loadedmetadata", () => {
      const active = getActiveVideo();
      if (pendingSeekRatio !== null && Number.isFinite(active.duration) && active.duration > 0) {
        active.currentTime = pendingSeekRatio * active.duration;
        pendingSeekRatio = null;
      }
      updateControls();
    });
    bindMedia(video);
    watchVideoForSafari(video);
    target.addEventListener("pointermove", showTransientControls);
    target.addEventListener("pointerdown", showTransientControls);
    target.addEventListener("focusin", showTransientControls);
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement === target) showTransientControls();
      else target.classList.remove("controls-visible");
      updateControls();
    });
    controls.append(playButton, progress, time, volumeControl, quality, qualityStatus, fullscreenButton);
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
      setAssetWithFallback(image, media.poster);
      image.alt = text(project.title);
      image.loading = "lazy";
      visual.appendChild(image);
    } else {
      const video = document.createElement("video");
      video.className = "project-video";
      video.classList.add("is-active");
      configureVideo(video, "none");
      video.poster = assetUrl(media.poster);
      video.setAttribute("aria-label", `${text(project.title)} demo preview`);
      addVideoSources(video, previews[0]);
      video.classList.add("video-poster");
      const fallback = document.createElement("img");
      setAssetWithFallback(fallback, media.poster);
      fallback.alt = text(project.title);
      video.appendChild(fallback);
      visual.appendChild(video);
      visual.appendChild(createVideoControls(video, previews[0]));
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
        setAssetWithFallback(image, imagePath);
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
      setAssetWithFallback(image, imagePath);
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
      const description = document.createElement("p");
      description.className = "project-description";
      description.textContent = text(project.description || project.summary);
      details.appendChild(description);
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
    document.title = translations[language].pageTitle;
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
  installVideoRecoveryHooks();
  applyTranslations();
})();
