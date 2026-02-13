/**
 * Old Alabama Town Tours — Dashboard Logic
 * ──────────────────────────────────────────
 * Features: Dark/Light mode, Import/Export, Print, Mobile-first
 */

let allLocations = [];
let currentDetailId = null;
let deleteTargetId = null;
let pendingImportData = null;

// ══════════════════════════════════════════════════
//  Initialization
// ══════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  loadLocations();
  checkBackendHealth();
  setupDragDrop();
  initTheme();
  setupClickOutside();
});

// ══════════════════════════════════════════════════
//  Theme (Dark / Light)
// ══════════════════════════════════════════════════

function initTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  const desktopToggle = document.getElementById("theme-toggle-desktop");
  const mobileToggle = document.getElementById("theme-toggle-mobile");
  if (desktopToggle) desktopToggle.checked = isDark;
  if (mobileToggle) mobileToggle.checked = isDark;
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("oat-theme", isDark ? "dark" : "light");

  // Sync both toggles
  const desktopToggle = document.getElementById("theme-toggle-desktop");
  const mobileToggle = document.getElementById("theme-toggle-mobile");
  if (desktopToggle) desktopToggle.checked = isDark;
  if (mobileToggle) mobileToggle.checked = isDark;
}

// ══════════════════════════════════════════════════
//  Mobile Menu
// ══════════════════════════════════════════════════

function openMobileMenu() {
  document.getElementById("mobile-menu").classList.add("open");
  document.getElementById("mobile-overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  document.getElementById("mobile-menu").classList.remove("open");
  document.getElementById("mobile-overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

// ══════════════════════════════════════════════════
//  Dropdowns
// ══════════════════════════════════════════════════

function toggleDropdown(id) {
  const el = document.getElementById(id);
  const isOpen = el.classList.contains("show");
  closeAllDropdowns();
  if (!isOpen) el.classList.add("show");
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-menu").forEach((d) => d.classList.remove("show"));
}

function setupClickOutside() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative")) closeAllDropdowns();
  });
}

// ══════════════════════════════════════════════════
//  Health Check
// ══════════════════════════════════════════════════

async function checkBackendHealth() {
  const badge = document.getElementById("health-badge");
  try {
    const data = await checkHealth();
    badge.textContent = `${data.provider.toUpperCase()} ✓`;
    badge.className =
      "text-[10px] px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-mono hidden md:inline-flex";
  } catch {
    badge.textContent = "offline";
    badge.className =
      "text-[10px] px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-mono hidden md:inline-flex";
  }
}

// ══════════════════════════════════════════════════
//  Load & Render Locations
// ══════════════════════════════════════════════════

async function loadLocations() {
  try {
    allLocations = await fetchLocations();
    renderLocations(allLocations);
    renderMobileLocations(allLocations);
    updateStats(allLocations);
  } catch (err) {
    showToast("Failed to load locations", "error");
    document.getElementById("locations-body").innerHTML =
      `<tr><td colspan="7" class="px-6 py-12 text-center text-red-400">Error loading data. Is the backend running?</td></tr>`;
    document.getElementById("locations-mobile").innerHTML =
      `<div class="px-4 py-12 text-center text-red-400 text-sm">Error loading data. Is the backend running?</div>`;
  }
}

function renderLocations(locations) {
  const tbody = document.getElementById("locations-body");

  if (locations.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7" class="px-6 py-16 text-center">
        <svg class="w-12 h-12 mx-auto text-ink-200 dark:text-ink-700 mb-3" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path d="M3 21h18M3 7v1a3 3 0 003 3h0a3 3 0 003-3V7m0 0V4h6v3m0 0v1a3 3 0 003 3h0a3 3 0 003-3V7M6 21V11m12 10V11"/></svg>
        <p class="text-ink-400 dark:text-ink-500 text-sm">No tour locations yet</p>
        <p class="text-ink-300 dark:text-ink-600 text-xs mt-1">Click "Add Location" to create your first beacon</p>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = locations
    .map((loc) => {
      const audioCount = (loc.audioFiles || []).length;
      const videoCount = (loc.videoFiles || []).length;
      const textCount = (loc.textFiles || []).length;
      const desc = loc.description
        ? loc.description.length > 50
          ? loc.description.substring(0, 50) + "…"
          : loc.description
        : "—";

      return `
      <tr class="hover:bg-ink-50/40 dark:hover:bg-ink-950/40 transition-colors fade-in cursor-pointer" onclick="openDetail('${loc.locationId}')">
        <td class="px-6 py-4">
          <span class="font-mono text-xs bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 px-2 py-1 rounded">${escHtml(loc.beaconId)}</span>
        </td>
        <td class="px-6 py-4 font-medium dark:text-ink-100">${escHtml(loc.name)}</td>
        <td class="px-6 py-4 text-ink-500 dark:text-ink-400 text-xs max-w-xs truncate hidden lg:table-cell">${escHtml(desc)}</td>
        <td class="px-6 py-4 text-center">
          <span class="inline-flex items-center gap-1 text-xs ${audioCount ? "text-clay-500 font-medium" : "text-ink-300 dark:text-ink-600"}">
            ${audioCount ? `<span class="w-2 h-2 rounded-full bg-clay-400"></span> ${audioCount}` : "—"}
          </span>
        </td>
        <td class="px-6 py-4 text-center">
          <span class="inline-flex items-center gap-1 text-xs ${videoCount ? "text-blue-500 font-medium" : "text-ink-300 dark:text-ink-600"}">
            ${videoCount ? `<span class="w-2 h-2 rounded-full bg-blue-400"></span> ${videoCount}` : "—"}
          </span>
        </td>
        <td class="px-6 py-4 text-center">
          <span class="inline-flex items-center gap-1 text-xs ${textCount ? "text-emerald-500 font-medium" : "text-ink-300 dark:text-ink-600"}">
            ${textCount ? `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> ${textCount}` : "—"}
          </span>
        </td>
        <td class="px-6 py-4 text-right no-print" onclick="event.stopPropagation()">
          <button onclick="openEditModal('${loc.locationId}')" class="text-ink-400 hover:text-bronze-500 transition-colors p-1.5 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800" title="Edit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
          <button onclick="confirmDelete('${loc.locationId}')" class="text-ink-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800 ml-0.5" title="Delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </td>
      </tr>`;
    })
    .join("");
}

function renderMobileLocations(locations) {
  const container = document.getElementById("locations-mobile");

  if (locations.length === 0) {
    container.innerHTML = `
      <div class="px-4 py-12 text-center">
        <svg class="w-10 h-10 mx-auto text-ink-200 dark:text-ink-700 mb-2" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path d="M3 21h18M3 7v1a3 3 0 003 3h0a3 3 0 003-3V7m0 0V4h6v3m0 0v1a3 3 0 003 3h0a3 3 0 003-3V7M6 21V11m12 10V11"/></svg>
        <p class="text-ink-400 dark:text-ink-500 text-sm">No locations yet</p>
        <p class="text-ink-300 dark:text-ink-600 text-xs mt-1">Tap "Add" to get started</p>
      </div>`;
    return;
  }

  container.innerHTML = locations
    .map((loc) => {
      const audioCount = (loc.audioFiles || []).length;
      const videoCount = (loc.videoFiles || []).length;
      const textCount = (loc.textFiles || []).length;

      return `
      <div class="px-4 py-3.5 hover:bg-ink-50/50 dark:hover:bg-ink-950/40 transition-colors fade-in active:bg-ink-100 dark:active:bg-ink-900 cursor-pointer" onclick="openDetail('${loc.locationId}')">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="font-medium text-sm dark:text-ink-100 truncate">${escHtml(loc.name)}</p>
            <p class="font-mono text-[11px] text-ink-400 dark:text-ink-500 mt-0.5">${escHtml(loc.beaconId)}</p>
          </div>
          <div class="flex items-center gap-0.5 shrink-0" onclick="event.stopPropagation()">
            <button onclick="openEditModal('${loc.locationId}')" class="text-ink-400 hover:text-bronze-500 p-1.5 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button onclick="confirmDelete('${loc.locationId}')" class="text-ink-400 hover:text-red-500 p-1.5 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
        <div class="flex items-center gap-3 mt-2">
          <span class="inline-flex items-center gap-1 text-[11px] ${audioCount ? "text-clay-500" : "text-ink-300 dark:text-ink-600"}">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19V6l12-3v13"/></svg>
            ${audioCount}
          </span>
          <span class="inline-flex items-center gap-1 text-[11px] ${videoCount ? "text-blue-500" : "text-ink-300 dark:text-ink-600"}">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"/></svg>
            ${videoCount}
          </span>
          <span class="inline-flex items-center gap-1 text-[11px] ${textCount ? "text-emerald-500" : "text-ink-300 dark:text-ink-600"}">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586"/></svg>
            ${textCount}
          </span>
        </div>
      </div>`;
    })
    .join("");
}

function updateStats(locations) {
  document.getElementById("stat-total").textContent = locations.length;
  document.getElementById("stat-audio").textContent = locations.reduce((n, l) => n + (l.audioFiles || []).length, 0);
  document.getElementById("stat-video").textContent = locations.reduce((n, l) => n + (l.videoFiles || []).length, 0);
  document.getElementById("stat-text").textContent = locations.reduce((n, l) => n + (l.textFiles || []).length, 0);
}

function filterLocations(query) {
  const q = query.toLowerCase();
  const filtered = allLocations.filter(
    (l) =>
      l.beaconId.toLowerCase().includes(q) ||
      l.name.toLowerCase().includes(q) ||
      (l.description || "").toLowerCase().includes(q)
  );
  renderLocations(filtered);
  renderMobileLocations(filtered);
}

// ══════════════════════════════════════════════════
//  Create / Edit Modal
// ══════════════════════════════════════════════════

function openCreateModal() {
  document.getElementById("modal-title").textContent = "Add Tour Location";
  document.getElementById("form-submit-text").textContent = "Create Location";
  document.getElementById("form-locationId").value = "";
  document.getElementById("form-beaconId").value = "";
  document.getElementById("form-name").value = "";
  document.getElementById("form-description").value = "";
  document.getElementById("modal-overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function openEditModal(locationId) {
  const loc = allLocations.find((l) => l.locationId === locationId);
  if (!loc) return;
  document.getElementById("modal-title").textContent = "Edit Location";
  document.getElementById("form-submit-text").textContent = "Save Changes";
  document.getElementById("form-locationId").value = loc.locationId;
  document.getElementById("form-beaconId").value = loc.beaconId;
  document.getElementById("form-name").value = loc.name;
  document.getElementById("form-description").value = loc.description || "";
  document.getElementById("modal-overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const locationId = document.getElementById("form-locationId").value;
  const payload = {
    beaconId: document.getElementById("form-beaconId").value.trim(),
    name: document.getElementById("form-name").value.trim(),
    description: document.getElementById("form-description").value.trim(),
  };

  try {
    if (locationId) {
      await updateLocation(locationId, payload);
      showToast("Location updated");
    } else {
      await createLocation(payload);
      showToast("Location created");
    }
    closeModal();
    await loadLocations();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ══════════════════════════════════════════════════
//  Detail / Upload Modal
// ══════════════════════════════════════════════════

async function openDetail(locationId) {
  currentDetailId = locationId;
  try {
    const loc = await fetchLocation(locationId);
    document.getElementById("detail-title").textContent = loc.name;
    document.getElementById("detail-beacon").textContent = `Beacon: ${loc.beaconId}`;
    document.getElementById("detail-description").textContent = loc.description || "No description provided.";

    renderFileList("audio-files-list", loc.audioFiles || [], locationId);
    renderFileList("video-files-list", loc.videoFiles || [], locationId);
    renderFileList("text-files-list", loc.textFiles || [], locationId);

    document.getElementById("detail-overlay").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  } catch (err) {
    showToast("Failed to load details", "error");
  }
}

function closeDetail() {
  document.getElementById("detail-overlay").classList.add("hidden");
  document.body.style.overflow = "";
  currentDetailId = null;
  document.getElementById("upload-progress").classList.add("hidden");
  document.getElementById("progress-bar").style.width = "0%";
}

function renderFileList(containerId, files, locationId) {
  const container = document.getElementById(containerId);
  if (files.length === 0) {
    container.innerHTML = `<p class="text-xs text-ink-300 dark:text-ink-600 italic pl-6">No files uploaded</p>`;
    return;
  }

  container.innerHTML = files
    .map((f) => {
      const url = getDisplayUrl(f.url);
      const size = formatBytes(f.size);
      return `
      <div class="flex items-center justify-between bg-ink-50/50 dark:bg-ink-950/40 rounded-lg px-3 py-2 group">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-xs text-ink-500 dark:text-ink-400 truncate" title="${escHtml(f.filename)}">${escHtml(f.filename)}</span>
          <span class="text-[10px] text-ink-300 dark:text-ink-600 shrink-0">${size}</span>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <a href="${escHtml(url)}" target="_blank" rel="noopener"
             class="text-bronze-500 hover:text-bronze-600 p-1 transition-colors" title="Open file">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
          <button onclick="handleDeleteFile('${locationId}', '${f.fileId}')"
                  class="text-ink-300 hover:text-red-500 p-1 transition-colors sm:opacity-0 sm:group-hover:opacity-100" title="Delete file">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>`;
    })
    .join("");
}

// ══════════════════════════════════════════════════
//  File Upload
// ══════════════════════════════════════════════════

function setupDragDrop() {
  document.addEventListener("dragover", (e) => e.preventDefault());
  document.addEventListener("drop", (e) => e.preventDefault());

  const zone = document.getElementById("upload-zone");
  if (!zone) return;

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("dragover");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("dragover");
    if (e.dataTransfer.files.length && currentDetailId) {
      uploadFiles(e.dataTransfer.files);
    }
  });
}

function handleFileSelect(e) {
  if (e.target.files.length && currentDetailId) {
    uploadFiles(e.target.files);
    e.target.value = "";
  }
}

async function uploadFiles(fileList) {
  const progressContainer = document.getElementById("upload-progress");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  for (const file of fileList) {
    progressContainer.classList.remove("hidden");
    progressBar.style.width = "0%";
    progressText.textContent = "0%";

    try {
      await uploadFile(currentDetailId, file, (pct) => {
        progressBar.style.width = pct + "%";
        progressText.textContent = pct + "%";
      });
      showToast(`Uploaded: ${file.name}`);
    } catch (err) {
      showToast(`Failed: ${file.name} — ${err.message}`, "error");
    }
  }

  progressContainer.classList.add("hidden");
  await openDetail(currentDetailId);
  await loadLocations();
}

async function handleDeleteFile(locationId, fileId) {
  try {
    await deleteFile(locationId, fileId);
    showToast("File deleted");
    await openDetail(locationId);
    await loadLocations();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ══════════════════════════════════════════════════
//  Delete Confirmation
// ══════════════════════════════════════════════════

function confirmDelete(locationId) {
  deleteTargetId = locationId;
  document.getElementById("confirm-overlay").classList.remove("hidden");
  document.getElementById("confirm-delete-btn").onclick = async () => {
    try {
      await deleteLocation(deleteTargetId);
      showToast("Location deleted");
      closeConfirm();
      await loadLocations();
    } catch (err) {
      showToast(err.message, "error");
    }
  };
}

function closeConfirm() {
  document.getElementById("confirm-overlay").classList.add("hidden");
  deleteTargetId = null;
}

// ══════════════════════════════════════════════════
//  Import / Export
// ══════════════════════════════════════════════════

function handleImport() {
  pendingImportData = null;
  document.getElementById("import-preview").classList.add("hidden");
  document.getElementById("import-file-input").value = "";
  document.getElementById("import-overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeImportModal() {
  document.getElementById("import-overlay").classList.add("hidden");
  document.body.style.overflow = "";
  pendingImportData = null;
}

function processImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      let locations = [];

      // Handle both flat array and { locations: [...] } format
      if (Array.isArray(data)) {
        locations = data;
      } else if (data.locations && Array.isArray(data.locations)) {
        locations = data.locations;
      } else {
        throw new Error("Invalid format");
      }

      // Validate
      const valid = locations.filter((l) => l.beaconId && l.name);
      if (valid.length === 0) {
        showToast("No valid locations found in file", "error");
        return;
      }

      pendingImportData = valid;
      document.getElementById("import-preview").classList.remove("hidden");
      document.getElementById("import-preview-text").textContent = `Found ${valid.length} location${valid.length > 1 ? "s" : ""} ready to import.`;
    } catch (err) {
      showToast("Invalid JSON file: " + err.message, "error");
    }
  };
  reader.readAsText(file);
}

async function confirmImport() {
  if (!pendingImportData || pendingImportData.length === 0) return;

  let success = 0;
  let failed = 0;

  for (const loc of pendingImportData) {
    try {
      await createLocation({
        beaconId: loc.beaconId,
        name: loc.name,
        description: loc.description || "",
      });
      success++;
    } catch {
      failed++;
    }
  }

  closeImportModal();
  await loadLocations();

  if (failed > 0) {
    showToast(`Imported ${success}, failed ${failed}`, "error");
  } else {
    showToast(`Successfully imported ${success} location${success > 1 ? "s" : ""}`);
  }
}

function handleExport(format) {
  if (allLocations.length === 0) {
    showToast("No data to export", "error");
    return;
  }

  const timestamp = new Date().toISOString().slice(0, 10);

  if (format === "json") {
    const exportData = {
      exportDate: new Date().toISOString(),
      appName: "Old Alabama Town Tours",
      totalLocations: allLocations.length,
      locations: allLocations.map((l) => ({
        beaconId: l.beaconId,
        name: l.name,
        description: l.description || "",
        audioFiles: (l.audioFiles || []).length,
        videoFiles: (l.videoFiles || []).length,
        textFiles: (l.textFiles || []).length,
      })),
    };
    downloadFile(JSON.stringify(exportData, null, 2), `oat-tours-${timestamp}.json`, "application/json");
    showToast("JSON exported successfully");
  } else if (format === "csv") {
    let csv = "Beacon ID,Name,Description,Audio Files,Video Files,Text Files\n";
    allLocations.forEach((l) => {
      const desc = (l.description || "").replace(/"/g, '""');
      const name = l.name.replace(/"/g, '""');
      csv += `"${l.beaconId}","${name}","${desc}",${(l.audioFiles || []).length},${(l.videoFiles || []).length},${(l.textFiles || []).length}\n`;
    });
    downloadFile(csv, `oat-tours-${timestamp}.csv`, "text/csv");
    showToast("CSV exported successfully");
  }
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════════════
//  Print Report
// ══════════════════════════════════════════════════

function handlePrintReport() {
  // Set print date
  const dateEl = document.getElementById("print-date");
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  window.print();
}

// ══════════════════════════════════════════════════
//  Utilities
// ══════════════════════════════════════════════════

function escHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  const bg = type === "error" ? "bg-red-600" : "bg-gallery-900 dark:bg-bronze-600";
  toast.className = `toast ${bg} text-white text-sm px-4 py-3 rounded-lg shadow-lg max-w-xs`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}
