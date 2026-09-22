/**
 * Storage & Config Manager
 * localStorage + Export / Import
 */

const STORAGE_KEY = "commander_profile_v1";

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
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `commander-profile-${new Date().toISOString().slice(0,10)}.json`;
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
