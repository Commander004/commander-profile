/**
 * Admin Panel Logic + Live Preview
 */
(function () {
  let config = getConfig();
  let currentPanel = "overview";

  // ========== AUTH ==========
  const loginScreen = document.getElementById("login-screen");
  const adminApp = document.getElementById("admin-app");

  if (isLoggedIn()) {
    showAdmin();
  }

  document.getElementById("login-btn").onclick = () => {
    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value;
    const remember = document.getElementById("remember-me").checked;
    if (user === ADMIN_CONFIG.username && pass === ADMIN_CONFIG.password) {
      setLoggedIn(remember);
      showAdmin();
    } else {
      document.getElementById("login-error").style.display = "block";
    }
  };
  document.getElementById("login-pass").onkeydown = (e) => {
    if (e.key === "Enter") document.getElementById("login-btn").click();
  };

  document.getElementById("logout-btn").onclick = () => {
    logout();
    location.reload();
  };

  function showAdmin() {
    loginScreen.style.display = "none";
    adminApp.style.display = "flex";
    loadFormFromConfig();
    bindEvents();
    refreshPreview();
  }

  // ========== NAVIGATION ==========
  document.querySelectorAll(".nav-item[data-panel], .bottom-nav button[data-panel]").forEach(btn => {
    btn.onclick = () => switchPanel(btn.dataset.panel);
  });
  document.querySelectorAll("[data-goto]").forEach(btn => {
    btn.onclick = () => switchPanel(btn.dataset.goto);
  });

  document.getElementById("menu-toggle").onclick = () => {
    document.getElementById("sidebar").classList.toggle("open");
  };

  document.getElementById("mobile-preview-btn").onclick = () => {
    document.getElementById("preview-area").classList.toggle("mobile-show");
  };
  document.getElementById("preview-toggle-btn").onclick = () => {
    document.getElementById("preview-area").classList.toggle("mobile-show");
  };

  function switchPanel(name) {
    currentPanel = name;
    document.querySelectorAll(".panel-section").forEach(s => s.classList.remove("active"));
    const panel = document.getElementById("panel-" + name);
    if (panel) panel.classList.add("active");
    document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.panel === name));
    document.querySelectorAll(".bottom-nav button").forEach(n => n.classList.toggle("active", n.dataset.panel === name));
    document.getElementById("panel-title").textContent = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById("sidebar").classList.remove("open");
  }

  // ========== LOAD FORM ==========
  function loadFormFromConfig() {
    const p = config.profile;
    setVal("p-avatar", p.avatar);
    setVal("p-shape", p.avatarShape);
    setVal("p-size", p.avatarSize);
    setCheck("p-border", p.avatarBorder);
    setCheck("p-glow", p.avatarGlow);
    setVal("p-anim", p.avatarAnimation);
    setVal("p-display", p.displayName);
    setVal("p-username", p.username);
    setVal("p-bio", p.bio);
    setVal("p-location", p.location);
    setVal("p-status", p.status);
    setVal("p-pronouns", p.pronouns);
    setCheck("p-verified", p.verified);
    setVal("p-badge", p.customBadge);

    const bg = config.background;
    // UI only has default | upload — map internal types
    const uiType = (bg.type === "image" || bg.type === "gif" || bg.type === "video") ? "upload" : "default";
    setVal("bg-type", uiType);
    if (bg.type === "image" || bg.type === "gif" || bg.type === "video") {
      setVal("bg-media-kind", bg.type);
    } else {
      setVal("bg-media-kind", "image");
    }
    setVal("bg-image", bg.image);
    setVal("bg-video", bg.video);
    setVal("bg-blur", bg.blur);
    setVal("bg-bright", bg.brightness);
    setVal("bg-op", bg.opacity);
    setVal("bg-ov", bg.overlayOpacity);
    setVal("bg-overlay", bg.overlay);
    updateRangeLabels();
    toggleBgCards();
    toggleBgCards();

    const m = config.music;
    setCheck("m-enabled", m.enabled);
    setCheck("m-autoplay", m.autoplay);
    setCheck("m-loop", m.loop);
    setVal("m-style", m.style);
    setVal("m-vol", Math.round((m.volume || 0.6) * 100));
    renderTracks();

    renderTexts();
    renderSocial();

    const th = config.theme;
    setVal("th-preset", th.preset);
    setVal("th-primary", th.primary);
    setVal("th-secondary", th.secondary);
    setVal("th-accent", th.accent);
    setVal("th-bg", th.background);
    setVal("th-text", th.text);
    setVal("th-glow", th.glow);
    setVal("th-radius", th.borderRadius);
    setVal("th-blur", th.blur);

    setCheck("ef-particles", config.effects.particles || config.effects.stars);
    setCheck("ef-glow", config.effects.glow);
    setCheck("ef-transition", config.effects.pageTransition);
    setCheck("ef-perf", config.settings.performanceMode);

    setVal("seo-title", config.seo.title);
    setVal("seo-desc", config.seo.description);
    setVal("seo-keywords", config.seo.keywords);
    setVal("seo-og", config.seo.ogImage);

    setVal("custom-css", config.customCSS);

    setCheck("set-status", config.settings.showStatus);
    setCheck("set-location", config.settings.showLocation);
    setCheck("set-badges", config.settings.showBadges);

    toggleBgCards();
  }

  function setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v ?? "";
  }
  function setCheck(id, v) {
    const el = document.getElementById(id);
    if (el) el.checked = !!v;
  }
  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }
  function getCheck(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
  }

  // ========== COLLECT & SAVE ==========
  function collectConfig() {
    config.profile = {
      ...config.profile,
      avatar: getVal("p-avatar"),
      avatarShape: getVal("p-shape"),
      avatarSize: parseInt(getVal("p-size")) || 120,
      avatarBorder: getCheck("p-border"),
      avatarGlow: getCheck("p-glow"),
      avatarAnimation: getVal("p-anim"),
      displayName: getVal("p-display"),
      username: getVal("p-username"),
      bio: getVal("p-bio"),
      location: getVal("p-location"),
      status: getVal("p-status"),
      pronouns: getVal("p-pronouns"),
      verified: getCheck("p-verified"),
      customBadge: getVal("p-badge")
    };

    const uiBgType = getVal("bg-type"); // default | upload
    let realType = "default";
    if (uiBgType === "upload") {
      realType = getVal("bg-media-kind") || "image"; // image | gif | video
    }
    config.background = {
      ...config.background,
      type: realType,
      image: getVal("bg-image"),
      video: getVal("bg-video"),
      blur: parseInt(getVal("bg-blur")) || 0,
      brightness: parseInt(getVal("bg-bright")) || 100,
      opacity: parseInt(getVal("bg-op")) || 100,
      overlayOpacity: parseInt(getVal("bg-ov")) || 40,
      overlay: getVal("bg-overlay")
    };

    config.music = {
      ...config.music,
      enabled: getCheck("m-enabled"),
      autoplay: getCheck("m-autoplay"),
      loop: getCheck("m-loop"),
      style: getVal("m-style"),
      volume: (parseInt(getVal("m-vol")) || 60) / 100,
      tracks: collectTracks()
    };

    config.texts = collectTexts();
    config.social = collectSocial();

    config.theme = {
      ...config.theme,
      preset: getVal("th-preset"),
      primary: getVal("th-primary"),
      secondary: getVal("th-secondary"),
      accent: getVal("th-accent"),
      background: getVal("th-bg"),
      text: getVal("th-text"),
      glow: getVal("th-glow"),
      borderRadius: parseInt(getVal("th-radius")) || 16,
      blur: parseInt(getVal("th-blur")) || 20
    };

    config.effects.particles = getCheck("ef-particles");
    config.effects.stars = getCheck("ef-particles");
    config.effects.glow = getCheck("ef-glow");
    config.effects.pageTransition = getCheck("ef-transition");
    config.settings.performanceMode = getCheck("ef-perf");

    config.seo.title = getVal("seo-title");
    config.seo.description = getVal("seo-desc");
    config.seo.keywords = getVal("seo-keywords");
    config.seo.ogImage = getVal("seo-og");

    config.customCSS = getVal("custom-css");

    config.settings.showStatus = getCheck("set-status");
    config.settings.showLocation = getCheck("set-location");
    config.settings.showBadges = getCheck("set-badges");

    return config;
  }

  // ========== LIVE UPDATE ==========
  function bindEvents() {
    // Any input change → live update
    const inputs = document.querySelectorAll("#panel-area input, #panel-area select, #panel-area textarea");
    inputs.forEach(el => {
      el.addEventListener("input", debounce(() => {
        collectConfig();
        refreshPreview();
      }, 300));
      el.addEventListener("change", () => {
        collectConfig();
        refreshPreview();
        if (el.id === "bg-type") toggleBgCards();
        if (el.id && el.id.startsWith("bg-")) updateRangeLabels();
        if (el.id === "th-radius" || el.id === "th-blur" || el.id === "m-vol") updateRangeLabels();
      });
    });

    // Background type / media-kind changes
    const bgTypeEl = document.getElementById("bg-type");
    const bgKindEl = document.getElementById("bg-media-kind");
    if (bgTypeEl) bgTypeEl.addEventListener("change", () => { toggleBgCards(); collectConfig(); refreshPreview(); });
    if (bgKindEl) bgKindEl.addEventListener("change", () => { toggleBgCards(); collectConfig(); refreshPreview(); });

    // Background file picker (local preview)
    const bgFile = document.getElementById("bg-file");
    if (bgFile) {
      bgFile.addEventListener("change", () => {
        const file = bgFile.files && bgFile.files[0];
        if (!file) return;

        const kind = getVal("bg-media-kind") || "image";
        const isVideo = kind === "video" || file.type.startsWith("video/");

        // Force upload mode
        setVal("bg-type", "upload");

        if (isVideo) {
          setVal("bg-media-kind", "video");
          const url = URL.createObjectURL(file);
          setVal("bg-video", url);
          config.background.video = url;
          config.background.type = "video";
          toggleBgCards();

          const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
          if (file.size > 10 * 1024 * 1024) {
            toast("⚠️ حجم ویدیو " + sizeMB + "MB — بهتر است زیر ۱۰MB و رزولوشن 1920×1080 یا 1280×720 باشد");
          } else {
            toast("ویدیو برای پیش‌نمایش لود شد. برای دائمی: فایل را در assets/videos بگذار");
          }
        } else {
          const isGif = file.type === "image/gif" || kind === "gif";
          setVal("bg-media-kind", isGif ? "gif" : "image");
          if (file.size > 4 * 1024 * 1024) {
            toast("حجم زیاد (" + (file.size / 1024 / 1024).toFixed(1) + "MB) — بهتر است زیر ۲–۳MB باشد");
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target.result;
            setVal("bg-image", dataUrl);
            config.background.image = dataUrl;
            config.background.type = isGif ? "gif" : "image";
            toggleBgCards();
            collectConfig();
            refreshPreview();
            toast("فایل برای پیش‌نمایش لود شد");
          };
          reader.readAsDataURL(file);
          return;
        }

        collectConfig();
        refreshPreview();
      });
    }

    document.getElementById("save-btn").onclick = () => {
      collectConfig();
      if (saveConfig(config)) {
        toast("Saved ✓");
        refreshPreview();
      } else {
        toast("Save failed");
      }
    };

    document.getElementById("export-btn").onclick = () => {
      collectConfig();
      saveConfig(config);
      exportConfig();
      toast("Exported");
    };

    document.getElementById("import-btn").onclick = () => {
      const file = document.getElementById("import-file").files[0];
      if (!file) return toast("Select a file first");
      importConfig(file).then(cfg => {
        config = cfg;
        loadFormFromConfig();
        refreshPreview();
        toast("Imported ✓");
      }).catch(() => toast("Invalid JSON"));
    };

    document.getElementById("reset-all-btn").onclick = () => {
      showModal("Reset Everything?", "تمام تنظیمات به حالت پیش‌فرض برمی‌گردند.", () => {
        config = resetConfig();
        loadFormFromConfig();
        refreshPreview();
        toast("Reset done");
      });
    };

    document.getElementById("open-site-btn").onclick = () => window.open("index.html", "_blank");
    document.getElementById("refresh-preview").onclick = refreshPreview;

    document.getElementById("add-track-btn").onclick = () => {
      config.music.tracks.push({ title: "New Track", artist: "", cover: "", url: "" });
      renderTracks();
      collectConfig();
      refreshPreview();
    };
    document.getElementById("add-text-btn").onclick = () => {
      config.texts.push({
        id: "t" + Date.now(),
        text: "New text block",
        font: "Inter", fontSize: 16, fontWeight: 400, color: "#e0e0e0",
        gradient: false, letterSpacing: 0, lineHeight: 1.5, align: "center",
        shadow: false, glow: false, opacity: 100, background: "transparent",
        border: "none", borderRadius: 0, padding: 8, margin: 4, animation: "fade"
      });
      renderTexts();
      collectConfig();
      refreshPreview();
    };
    document.getElementById("add-social-btn").onclick = () => {
      config.social.push({
        id: "s" + Date.now(), title: "Custom", url: "", icon: "custom",
        color: "#fff", bg: "rgba(255,255,255,0.08)", visible: true
      });
      renderSocial();
      collectConfig();
      refreshPreview();
    };
  }

  function toggleBgCards() {
    const uiType = getVal("bg-type"); // default | upload
    const kind = getVal("bg-media-kind") || "image"; // image | gif | video
    const isUpload = uiType === "upload";
    const isVideo = isUpload && kind === "video";

    const mediaCard = document.getElementById("bg-media-card");
    if (mediaCard) mediaCard.style.display = isUpload ? "block" : "none";

    const imgWrap = document.getElementById("bg-image-wrap");
    const vidWrap = document.getElementById("bg-video-wrap");
    const vidWarn = document.getElementById("bg-video-warning");
    const fileInput = document.getElementById("bg-file");

    if (imgWrap) imgWrap.style.display = isVideo ? "none" : "block";
    if (vidWrap) vidWrap.style.display = isVideo ? "block" : "none";
    if (vidWarn) vidWarn.style.display = isVideo ? "block" : "none";

    if (fileInput) {
      if (isVideo) fileInput.accept = "video/mp4,video/webm,video/*";
      else if (kind === "gif") fileInput.accept = "image/gif,.gif";
      else fileInput.accept = "image/*,.jpg,.jpeg,.png,.webp";
    }
  }

  function updateRangeLabels() {
    const map = {
      "bg-blur": "bg-blur-val", "bg-bright": "bg-bright-val",
      "bg-op": "bg-op-val", "bg-ov": "bg-ov-val",
      "th-radius": "th-radius-val", "th-blur": "th-blur-val",
      "m-vol": "m-vol-val"
    };
    for (const [id, label] of Object.entries(map)) {
      const el = document.getElementById(id);
      const lab = document.getElementById(label);
      if (el && lab) lab.textContent = el.value;
    }
  }

  // ========== TRACKS / TEXTS / SOCIAL RENDER ==========
  function renderTracks() {
    const list = document.getElementById("tracks-list");
    list.innerHTML = "";
    (config.music.tracks || []).forEach((t, i) => {
      const div = document.createElement("div");
      div.className = "track-item";
      div.innerHTML = `
        <div class="item-header">
          <strong>Track ${i+1}</strong>
          <div class="item-actions">
            <button data-del-track="${i}">🗑</button>
          </div>
        </div>
        <label class="field">Title</label>
        <input type="text" data-track="${i}" data-field="title" value="${esc(t.title)}" />
        <label class="field">Artist</label>
        <input type="text" data-track="${i}" data-field="artist" value="${esc(t.artist)}" />
        <label class="field">Audio URL یا مسیر فایل</label>
        <input type="text" data-track="${i}" data-field="url" value="${esc(t.url)}" placeholder="https://... یا assets/music/song.mp3" />
        <div style="margin:8px 0;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <label class="btn btn-ghost btn-sm" style="cursor:pointer;margin:0;">
            📂 انتخاب از دستگاه
            <input type="file" accept="audio/*" data-file-track="${i}" style="display:none;" />
          </label>
          <span style="font-size:0.75rem;color:var(--admin-muted);" data-file-name="${i}"></span>
        </div>
        <p style="font-size:0.72rem;color:var(--admin-muted);margin:0 0 8px;">
          برای دائمی شدن: فایل را در <code>assets/music/</code> بگذار و مسیر را بنویس (مثلاً assets/music/track1.mp3)
        </p>
        <label class="field">Cover URL</label>
        <input type="url" data-track="${i}" data-field="cover" value="${esc(t.cover)}" />
      `;
      list.appendChild(div);
    });
    list.querySelectorAll("[data-del-track]").forEach(btn => {
      btn.onclick = () => {
        config.music.tracks.splice(+btn.dataset.delTrack, 1);
        renderTracks();
        collectConfig();
        refreshPreview();
      };
    });
    list.querySelectorAll("[data-track]").forEach(inp => {
      inp.oninput = () => {
        const i = +inp.dataset.track;
        config.music.tracks[i][inp.dataset.field] = inp.value;
        collectConfig();
        refreshPreview();
      };
    });
    // Local file picker → blob URL for preview
    list.querySelectorAll("[data-file-track]").forEach(fileInp => {
      fileInp.onchange = () => {
        const i = +fileInp.dataset.fileTrack;
        const file = fileInp.files && fileInp.files[0];
        if (!file) return;
        const blobUrl = URL.createObjectURL(file);
        config.music.tracks[i].url = blobUrl;
        // Auto-fill title from filename if empty
        if (!config.music.tracks[i].title || config.music.tracks[i].title === "New Track") {
          config.music.tracks[i].title = file.name.replace(/\.[^/.]+$/, "");
        }
        const nameSpan = list.querySelector(`[data-file-name="${i}"]`);
        if (nameSpan) nameSpan.textContent = file.name + " (موقت — برای دائمی در assets بگذار)";
        // Update the URL input visually
        const urlInp = list.querySelector(`input[data-track="${i}"][data-field="url"]`);
        if (urlInp) urlInp.value = blobUrl;
        const titleInp = list.querySelector(`input[data-track="${i}"][data-field="title"]`);
        if (titleInp) titleInp.value = config.music.tracks[i].title;
        collectConfig();
        refreshPreview();
        toast("فایل انتخاب شد — فقط برای پیش‌نمایش. برای دائمی در assets/music بگذار");
      };
    });
  }

  function collectTracks() {
    return config.music.tracks || [];
  }

  function renderTexts() {
    const list = document.getElementById("texts-list");
    list.innerHTML = "";
    (config.texts || []).forEach((t, i) => {
      const div = document.createElement("div");
      div.className = "text-block-item";
      div.innerHTML = `
        <div class="item-header">
          <strong>Block ${i+1}</strong>
          <div class="item-actions">
            <button data-del-text="${i}">🗑</button>
          </div>
        </div>
        <label class="field">Text</label>
        <textarea data-text="${i}" data-field="text" rows="2">${esc(t.text)}</textarea>
        <div class="grid-2" style="margin-top:8px;">
          <div><label class="field">Size</label><input type="number" data-text="${i}" data-field="fontSize" value="${t.fontSize||16}" /></div>
          <div><label class="field">Color</label><input type="color" data-text="${i}" data-field="color" value="${t.color||'#e0e0e0'}" /></div>
        </div>
        <label class="field">Animation</label>
        <select data-text="${i}" data-field="animation">
          <option value="none" ${t.animation==='none'?'selected':''}>None</option>
          <option value="fade" ${t.animation==='fade'?'selected':''}>Fade</option>
          <option value="slide" ${t.animation==='slide'?'selected':''}>Slide</option>
          <option value="glow" ${t.animation==='glow'?'selected':''}>Glow</option>
          <option value="pulse" ${t.animation==='pulse'?'selected':''}>Pulse</option>
          <option value="float" ${t.animation==='float'?'selected':''}>Float</option>
        </select>
      `;
      list.appendChild(div);
    });
    list.querySelectorAll("[data-del-text]").forEach(btn => {
      btn.onclick = () => {
        config.texts.splice(+btn.dataset.delText, 1);
        renderTexts();
        collectConfig();
        refreshPreview();
      };
    });
    list.querySelectorAll("[data-text]").forEach(inp => {
      inp.oninput = inp.onchange = () => {
        const i = +inp.dataset.text;
        let val = inp.value;
        if (inp.dataset.field === "fontSize") val = parseInt(val) || 16;
        config.texts[i][inp.dataset.field] = val;
        collectConfig();
        refreshPreview();
      };
    });
  }

  function collectTexts() {
    return config.texts || [];
  }

  function renderSocial() {
    const list = document.getElementById("social-list");
    list.innerHTML = "";
    (config.social || []).forEach((s, i) => {
      const div = document.createElement("div");
      div.className = "social-item";
      div.innerHTML = `
        <div class="item-header">
          <strong>${esc(s.title || "Link")}</strong>
          <div class="item-actions">
            <label class="switch" style="width:36px;height:20px;"><input type="checkbox" data-soc-vis="${i}" ${s.visible?'checked':''} /><span class="slider"></span></label>
            <button data-del-soc="${i}">🗑</button>
          </div>
        </div>
        <label class="field">Title</label>
        <input type="text" data-soc="${i}" data-field="title" value="${esc(s.title)}" />
        <label class="field">URL</label>
        <input type="url" data-soc="${i}" data-field="url" value="${esc(s.url)}" />
        <div class="grid-2" style="margin-top:8px;">
          <div><label class="field">Icon</label>
            <select data-soc="${i}" data-field="icon">
              ${["github","telegram","discord","x","instagram","youtube","spotify","twitch","steam","custom"].map(ic =>
                `<option value="${ic}" ${s.icon===ic?'selected':''}>${ic}</option>`).join("")}
            </select>
          </div>
          <div><label class="field">Color</label><input type="color" data-soc="${i}" data-field="color" value="${s.color||'#ffffff'}" /></div>
        </div>
      `;
      list.appendChild(div);
    });
    list.querySelectorAll("[data-del-soc]").forEach(btn => {
      btn.onclick = () => {
        config.social.splice(+btn.dataset.delSoc, 1);
        renderSocial();
        collectConfig();
        refreshPreview();
      };
    });
    list.querySelectorAll("[data-soc-vis]").forEach(chk => {
      chk.onchange = () => {
        config.social[+chk.dataset.socVis].visible = chk.checked;
        collectConfig();
        refreshPreview();
      };
    });
    list.querySelectorAll("[data-soc]").forEach(inp => {
      inp.oninput = inp.onchange = () => {
        config.social[+inp.dataset.soc][inp.dataset.field] = inp.value;
        collectConfig();
        refreshPreview();
      };
    });
  }

  function collectSocial() {
    return config.social || [];
  }

  // ========== PREVIEW ==========
  function refreshPreview() {
    const iframe = document.getElementById("preview-iframe");
    // Force reload so it reads latest localStorage
    saveConfig(config);
    iframe.src = "index.html?t=" + Date.now();
  }

  // ========== HELPERS ==========
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
  }

  function showModal(title, text, onConfirm) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-text").textContent = text;
    document.getElementById("modal").classList.add("show");
    document.getElementById("modal-cancel").onclick = () => document.getElementById("modal").classList.remove("show");
    document.getElementById("modal-confirm").onclick = () => {
      document.getElementById("modal").classList.remove("show");
      onConfirm();
    };
  }

  function esc(s) {
    return (s || "").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }
})();
