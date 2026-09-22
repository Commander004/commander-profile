/**
 * Storage & Config Manager
 * - Admin: localStorage (live edit)
 * - Public: config.json from repo (published settings)
 * - Export / Import / Publish
 */

const STORAGE_KEY = "commander_profile_v1";
const PUBLIC_CONFIG_URL = "config.json";

function getConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONFIG)), parsed);
    }
  } catch (e) {
    console.warn("Failed to load config", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

/**
 * Public page: load published config.json first, fall back to DEFAULT_CONFIG.
 * Does NOT use localStorage so visitors always see what you published.
 */
async function loadPublicConfig() {
  try {
    const res = await fetch(PUBLIC_CONFIG_URL + "?t=" + Date.now(), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONFIG)), data);
    }
  } catch (e) {
    console.warn("config.json not found or invalid, using defaults", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

function saveConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Save failed", e);
    return false;
  }
}

function resetConfig() {
  localStorage.removeItem(STORAGE_KEY);
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

function exportConfig() {
  const config = getConfig();
  downloadJSON(config, `commander-profile-backup-${new Date().toISOString().slice(0, 10)}.json`);
}

/** Publish: download as config.json — commit this file to the repo root for public site */
function publishConfig(config) {
  const data = config || getConfig();
  downloadJSON(data, "config.json");
}

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function importConfig(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const merged = deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONFIG)), data);
        saveConfig(merged);
        resolve(merged);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Auth helpers
function isLoggedIn() {
  return sessionStorage.getItem("commander_auth") === "1" ||
         localStorage.getItem("commander_auth_remember") === "1";
}

function setLoggedIn(remember) {
  sessionStorage.setItem("commander_auth", "1");
  if (remember) localStorage.setItem("commander_auth_remember", "1");
}

function logout() {
  sessionStorage.removeItem("commander_auth");
  localStorage.removeItem("commander_auth_remember");
}
