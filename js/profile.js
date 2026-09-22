/**
 * Public Profile Renderer
 */
(function () {
  const config = getConfig();

  // Apply SEO
  document.title = config.seo.title || "Profile";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = config.seo.description || "";

  // Apply theme CSS vars
  const root = document.documentElement;
  const t = config.theme;
  root.style.setProperty("--primary", t.primary);
  root.style.setProperty("--secondary", t.secondary);
  root.style.setProperty("--accent", t.accent);
  root.style.setProperty("--bg", t.background);
  root.style.setProperty("--text", t.text);
  root.style.setProperty("--card", t.card);
  root.style.setProperty("--border", t.border);
  root.style.setProperty("--glow", t.glow);
  root.style.setProperty("--radius", t.borderRadius + "px");
  root.style.setProperty("--blur", t.blur + "px");
  root.style.setProperty("--shadow", t.shadow);

  // Custom CSS
  if (config.customCSS) {
    const style = document.createElement("style");
    style.textContent = config.customCSS;
    document.head.appendChild(style);
  }

  // Background
  renderBackground(config.background);

  // Profile
  const p = config.profile;
  const avatar = document.getElementById("avatar");
  avatar.src = p.avatar || "https://via.placeholder.com/150";
  avatar.className = "avatar " + (p.avatarShape || "circle");
  if (p.avatarGlow) avatar.classList.add("glow");
  if (p.avatarAnimation && p.avatarAnimation !== "none") avatar.classList.add(p.avatarAnimation);
  avatar.style.width = avatar.style.height = (p.avatarSize || 120) + "px";
  if (!p.avatarBorder) avatar.style.border = "none";

  document.getElementById("display-name").innerHTML =
    escapeHtml(p.displayName || "User") +
    (p.verified ? '<span class="badge verified">Verified</span>' : "") +
    (p.customBadge ? `<span class="badge">${escapeHtml(p.customBadge)}</span>` : "");

  document.getElementById("username").textContent = "@" + (p.username || "user");
  document.getElementById("bio").textContent = p.bio || "";

  const meta = document.getElementById("meta");
  let metaHtml = "";
  if (config.settings.showStatus && p.status) metaHtml += `<span>🟢 ${escapeHtml(p.status)}</span>`;
  if (config.settings.showLocation && p.location) metaHtml += `<span>📍 ${escapeHtml(p.location)}</span>`;
  if (p.pronouns) metaHtml += `<span>${escapeHtml(p.pronouns)}</span>`;
  meta.innerHTML = metaHtml;

  // Social
  const socialGrid = document.getElementById("social-grid");
  socialGrid.innerHTML = "";
  (config.social || []).filter(s => s.visible && s.url).forEach(s => {
    const a = document.createElement("a");
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "social-btn";
    a.style.background = s.bg || "rgba(255,255,255,0.08)";
    a.style.color = s.color || "#fff";
    a.innerHTML = `${getSocialIcon(s.icon)} <span>${escapeHtml(s.title)}</span>`;
    socialGrid.appendChild(a);
  });

  // Text blocks
  const textContainer = document.getElementById("text-blocks");
  textContainer.innerHTML = "";
  (config.texts || []).forEach(tb => {
    const div = document.createElement("div");
    div.className = "text-block";
    if (tb.animation && tb.animation !== "none") div.classList.add("anim-" + tb.animation);
    div.style.fontFamily = tb.font || "Inter";
    div.style.fontSize = (tb.fontSize || 16) + "px";
    div.style.fontWeight = tb.fontWeight || 400;
    div.style.color = tb.color || "#e0e0e0";
    div.style.letterSpacing = (tb.letterSpacing || 0) + "px";
    div.style.lineHeight = tb.lineHeight || 1.5;
    div.style.textAlign = tb.align || "center";
    div.style.opacity = (tb.opacity || 100) / 100;
    div.style.background = tb.background || "transparent";
    div.style.border = tb.border || "none";
    div.style.borderRadius = (tb.borderRadius || 0) + "px";
    div.style.padding = (tb.padding || 8) + "px";
    div.style.margin = (tb.margin || 4) + "px 0";
    if (tb.shadow) div.style.textShadow = "0 2px 8px rgba(0,0,0,0.5)";
    if (tb.glow) div.style.textShadow = `0 0 12px ${t.glow}`;
    if (tb.gradient) {
      div.style.backgroundImage = `linear-gradient(90deg, ${t.primary}, ${t.secondary})`;
      div.style.webkitBackgroundClip = "text";
      div.style.webkitTextFillColor = "transparent";
    }
    div.textContent = tb.text || "";
    textContainer.appendChild(div);
  });

  // Music
  setupMusic(config.music);

  // Effects
  if (config.effects.particles || config.effects.stars) {
    initParticles(config.effects);
  }

  // Helpers
  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str || "";
    return d.innerHTML;
  }

  function renderBackground(bg) {
    const media = document.getElementById("bg-media");
    const overlay = document.getElementById("bg-overlay");
    media.innerHTML = "";
    media.style.background = "";
    media.style.filter = "";

    if (bg.type === "solid") {
      media.style.background = bg.solid || "#0a0a0f";
    } else if (bg.type === "gradient") {
      media.style.background = bg.gradient || "linear-gradient(135deg,#0a0a0f,#1a1a2e)";
    } else if (bg.type === "image" || bg.type === "gif") {
      if (bg.image) {
        const img = document.createElement("img");
        img.src = bg.image;
        img.className = "bg-media";
        img.style.objectFit = bg.size || "cover";
        img.style.objectPosition = bg.position || "center";
        media.appendChild(img);
      }
    } else if (bg.type === "video" && bg.video) {
      const vid = document.createElement("video");
      vid.src = bg.video;
      vid.autoplay = true;
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.className = "bg-media";
      media.appendChild(vid);
    }

    const filters = [];
    if (bg.blur) filters.push(`blur(${bg.blur}px)`);
    if (bg.brightness !== undefined && bg.brightness !== 100) filters.push(`brightness(${bg.brightness}%)`);
    if (bg.contrast !== undefined && bg.contrast !== 100) filters.push(`contrast(${bg.contrast}%)`);
    media.style.filter = filters.join(" ") || "none";
    media.style.opacity = (bg.opacity || 100) / 100;

    overlay.style.background = bg.overlay || "rgba(0,0,0,0.4)";
    overlay.style.opacity = (bg.overlayOpacity || 40) / 100;
  }

  function getSocialIcon(name) {
    const icons = {
      github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.1 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
      telegram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.75 8.4l-1.9 9c-.14.63-.5.78-1.02.5l-2.82-2.08-1.36 1.3c-.15.15-.28.28-.57.28l.2-2.86 5.2-4.7c.23-.2-.05-.31-.35-.12l-6.43 4.05-2.77-.87c-.6-.19-.61-.6.13-.89l10.83-4.17c.5-.18.94.12.78.86z"/></svg>`,
      discord: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19.5 19.5 0 0 0 15.6 3l-.2.5a16.5 16.5 0 0 1 4.1 1.6 14 14 0 0 0-12.9 0A16 16 0 0 1 8.6 3.5L8.4 3a19.4 19.4 0 0 0-4.7 1.4C.9 9 0 13.4.5 17.7a19.7 19.7 0 0 0 5.9 3c.5-.6.9-1.3 1.2-2a12.6 12.6 0 0 1-1.9-.9l.5-.4a14 14 0 0 0 12.6 0l.5.4c-.6.4-1.2.7-1.9.9.4.7.8 1.4 1.2 2a19.5 19.5 0 0 0 5.9-3c.6-5 .1-9.3-2.5-13.3zM8.2 14.7c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2zm7.6 0c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2z"/></svg>`,
      x: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2H21.8l-7.6 8.7L22.8 22h-6.7l-5.2-6.8L5 22H1.4l8.1-9.3L1 2h6.9l4.7 6.2L18.2 2zm-1.2 18h1.9L7.1 3.9H5.1L17 20z"/></svg>`,
      instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.9s0-3.6.1-4.9C2.4 4 4 2.4 7.1 2.3 8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 0 2.7.2.2 2.7 0 7c-.1 1.3-.1 1.7-.1 5s0 3.7.1 5c.2 4.3 2.7 6.8 7 7 1.3.1 1.7.1 5 .1s3.7 0 5-.1c4.3-.2 6.8-2.7 7-7 .1-1.3.1-1.7.1-5s0-3.7-.1-5c-.2-4.3-2.7-6.8-7-7C15.7 0 15.3 0 12 0z"/><path d="M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.5a1.4 1.4 0 1 1-2.9 0 1.4 1.4 0 0 1 2.9 0z"/></svg>`,
      youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z"/></svg>`,
      spotify: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.4-.7.5-1 .2-2.9-1.8-6.5-2.2-10.8-1.2-.4.1-.8-.2-.9-.6-.1-.4.2-.8.6-.9 4.7-1.1 8.7-.6 11.9 1.4.4.2.5.7.2 1.1zm1.5-3.3c-.3.4-.8.6-1.2.3-3.3-2-8.3-2.6-12.2-1.4-.5.1-1-.1-1.2-.6-.1-.5.1-1 .6-1.2 4.4-1.3 10-0.7 13.8 1.6.4.3.5.8.2 1.3zm.1-3.4C15.2 8.1 8.8 7.9 5.2 9c-.6.2-1.2-.2-1.4-.7-.2-.6.2-1.2.7-1.4 4.2-1.3 11.2-1.1 15.6 1.6.5.3.7 1 .3 1.5-.3.5-1 .7-1.5.3z"/></svg>`,
      twitch: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.6 5.5h1.7v5.1h-1.7zm4.7 0H18v5.1h-1.7zM6 2L2.5 5.5v13.1h4.3V22l3.4-3.4h2.9L21.5 12V2zm13.7 9.4l-2.6 2.6h-2.9l-2.5 2.5v-2.5H7.7V3.7h12z"/></svg>`,
      steam: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.5 0 .2 5.2.1 11.6l6.4 2.6a3.4 3.4 0 0 1 1.9-.6c.1 0 .2 0 .3.1l2.9-4.2v-.1c0-2.3 1.9-4.2 4.2-4.2s4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2h-.1l-4.1 2.9c0 .1.1.2.1.3a3.4 3.4 0 0 1-3.4 3.4c-1.5 0-2.8-1-3.3-2.3L.4 15.2C1.9 20.3 6.6 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0zm-4.3 17.3l-1.5-.6c.3.7.9 1.2 1.7 1.4a2.1 2.1 0 0 0 2.7-2c0-.2 0-.4-.1-.6l1.5.6a2.1 2.1 0 0 1-2.6 3.1 2.1 2.1 0 0 1-1.7-1.9zm10-5.6c1.5 0 2.8-1.2 2.8-2.8S19.2 6 17.7 6s-2.8 1.2-2.8 2.8 1.3 2.9 2.8 2.9zm0-4.6c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8.8-1.8 1.8-1.8z"/></svg>`,
      custom: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 3v2h3.6l-9.3 9.3 1.4 1.4L19 6.4V10h2V3h-7zM5 5v14h14v-7h-2v5H7V7h5V5H5z"/></svg>`
    };
    return icons[name] || icons.custom;
  }

  function setupMusic(m) {
    const player = document.getElementById("music-player");
    if (!m.enabled || !m.tracks || !m.tracks.length || !m.tracks[0].url) {
      player.classList.add("hidden");
      return;
    }
    player.classList.remove("hidden");
    player.classList.add(m.style || "glass");

    const audio = document.getElementById("audio-el");
    let idx = 0;
    let playing = false;

    function loadTrack(i) {
      const t = m.tracks[i];
      if (!t || !t.url) return;
      audio.src = t.url;
      document.getElementById("music-title").textContent = t.title || "Unknown";
      document.getElementById("music-artist").textContent = t.artist || "";
      const cover = document.getElementById("music-cover");
      cover.src = t.cover || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23333' width='48' height='48'/%3E%3C/svg%3E";
      audio.volume = m.volume ?? 0.6;
      if (m.loop) audio.loop = true;
    }

    loadTrack(0);

    document.getElementById("play-btn").onclick = () => {
      if (playing) {
        audio.pause();
        document.getElementById("play-btn").textContent = "▶";
      } else {
        audio.play().catch(() => {});
        document.getElementById("play-btn").textContent = "⏸";
      }
      playing = !playing;
    };
    document.getElementById("prev-btn").onclick = () => {
      idx = (idx - 1 + m.tracks.length) % m.tracks.length;
      loadTrack(idx);
      if (playing) audio.play().catch(() => {});
    };
    document.getElementById("next-btn").onclick = () => {
      idx = (idx + 1) % m.tracks.length;
      loadTrack(idx);
      if (playing) audio.play().catch(() => {});
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        document.getElementById("music-progress-bar").style.width =
          (audio.currentTime / audio.duration * 100) + "%";
      }
    };
    audio.onended = () => {
      if (!m.loop) {
        idx = (idx + 1) % m.tracks.length;
        loadTrack(idx);
        audio.play().catch(() => {});
      }
    };

    if (m.autoplay) {
      audio.play().then(() => {
        playing = true;
        document.getElementById("play-btn").textContent = "⏸";
      }).catch(() => {});
    }
  }

  function initParticles(effects) {
    const canvas = document.getElementById("effects-canvas");
    const ctx = canvas.getContext("2d");
    let w, h, particles = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const count = effects.stars ? 80 : 40;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.5 + 0.2
      });
    }

    function draw() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }
})();
