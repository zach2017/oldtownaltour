/**
 * Old Alabama Town Tours — LocalStorage API Layer
 * ────────────────────────────────────────────────
 * All data persists in the browser's localStorage.
 * No backend server required.
 *
 * Keeps the same function signatures so app.js works
 * without any changes.
 */

const STORAGE_KEY = "oat-tour-locations";

// ══════════════════════════════════════════════════
//  LocalStorage Helpers
// ══════════════════════════════════════════════════

function _loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function _saveAll(locations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
}

function _generateId() {
  return "loc_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

function _generateFileId() {
  return "file_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

// ══════════════════════════════════════════════════
//  Sample Data — Old Alabama Town, Montgomery AL
// ══════════════════════════════════════════════════

const SAMPLE_LOCATIONS = [
  {
    locationId: "loc_oat_001",
    beaconId: "BLE-LUCAS-001",
    name: "Lucas Tavern",
    description: "Built around 1818, Lucas Tavern is one of the oldest structures in Old Alabama Town. It served as a stagecoach stop, polling place, and social gathering spot in frontier Montgomery. Visitors can explore the original taproom, dining hall, and upstairs lodging quarters where early travelers rested on their journeys through the Alabama Territory.",
    audioFiles: [
      { fileId: "f_001a", filename: "lucas-tavern-history.mp3", size: 3245000, url: "#", type: "audio" },
      { fileId: "f_001b", filename: "tavern-ambience.wav", size: 8120000, url: "#", type: "audio" }
    ],
    videoFiles: [
      { fileId: "f_001c", filename: "lucas-tavern-tour.mp4", size: 45200000, url: "#", type: "video" }
    ],
    textFiles: [
      { fileId: "f_001d", filename: "lucas-tavern-guide.pdf", size: 524000, url: "#", type: "text" }
    ],
    createdAt: "2025-01-15T10:00:00Z"
  },
  {
    locationId: "loc_oat_002",
    beaconId: "BLE-ORDEMAN-002",
    name: "Ordeman-Shaw House",
    description: "This elegant Italianate townhouse was built in 1848 by Charles Ordeman, a German-born cabinetmaker and entrepreneur. The home showcases the prosperity of antebellum Montgomery with its ornate plasterwork, period furnishings, and a beautifully restored parlor. The house reflects the refined urban life of the mid-19th century South.",
    audioFiles: [
      { fileId: "f_002a", filename: "ordeman-house-narration.mp3", size: 4100000, url: "#", type: "audio" }
    ],
    videoFiles: [],
    textFiles: [
      { fileId: "f_002b", filename: "ordeman-history.txt", size: 12400, url: "#", type: "text" },
      { fileId: "f_002c", filename: "architectural-notes.md", size: 8700, url: "#", type: "text" }
    ],
    createdAt: "2025-01-15T10:30:00Z"
  },
  {
    locationId: "loc_oat_003",
    beaconId: "BLE-DRUGSTORE-003",
    name: "Rose-Morris Craft Store",
    description: "Originally operated as a neighborhood drugstore in the late 1800s, this building now houses demonstrations of traditional Alabama crafts including pottery, weaving, and blacksmithing. Artisans periodically demonstrate heritage craft techniques that were common throughout rural Alabama in the 19th century.",
    audioFiles: [
      { fileId: "f_003a", filename: "craft-demonstrations.mp3", size: 2800000, url: "#", type: "audio" }
    ],
    videoFiles: [
      { fileId: "f_003b", filename: "pottery-demo.mp4", size: 38500000, url: "#", type: "video" },
      { fileId: "f_003c", filename: "blacksmith-forge.mp4", size: 52000000, url: "#", type: "video" }
    ],
    textFiles: [],
    createdAt: "2025-02-01T09:00:00Z"
  },
  {
    locationId: "loc_oat_004",
    beaconId: "BLE-CHURCH-004",
    name: "Gallagher House",
    description: "This charming shotgun-style house represents the homes of working-class families in post-Civil War Montgomery. Named for one of its later occupants, the house features simple but functional design typical of the era. The interior has been furnished to depict everyday life for an Alabama family in the 1890s.",
    audioFiles: [
      { fileId: "f_004a", filename: "gallagher-family-story.mp3", size: 5200000, url: "#", type: "audio" },
      { fileId: "f_004b", filename: "shotgun-house-architecture.mp3", size: 3700000, url: "#", type: "audio" }
    ],
    videoFiles: [
      { fileId: "f_004c", filename: "daily-life-1890s.mp4", size: 61000000, url: "#", type: "video" }
    ],
    textFiles: [
      { fileId: "f_004d", filename: "working-class-montgomery.pdf", size: 890000, url: "#", type: "text" }
    ],
    createdAt: "2025-02-10T14:00:00Z"
  },
  {
    locationId: "loc_oat_005",
    beaconId: "BLE-COTTON-005",
    name: "Cotton Gin & Cotton Exchange",
    description: "This exhibit explores Montgomery's central role in the cotton economy that shaped the antebellum South. Visitors can see a working cotton gin and learn about the cotton exchange system that made Montgomery one of the wealthiest cities in America before the Civil War. The exhibit also addresses the enslaved labor that made the cotton industry possible.",
    audioFiles: [
      { fileId: "f_005a", filename: "cotton-economy-overview.mp3", size: 6100000, url: "#", type: "audio" }
    ],
    videoFiles: [
      { fileId: "f_005b", filename: "cotton-gin-operation.mp4", size: 42000000, url: "#", type: "video" }
    ],
    textFiles: [
      { fileId: "f_005c", filename: "cotton-trade-timeline.pdf", size: 1200000, url: "#", type: "text" },
      { fileId: "f_005d", filename: "enslaved-labor-history.pdf", size: 2400000, url: "#", type: "text" }
    ],
    createdAt: "2025-02-15T11:00:00Z"
  },
  {
    locationId: "loc_oat_006",
    beaconId: "BLE-SCHOOL-006",
    name: "Pioneer Schoolhouse",
    description: "This one-room schoolhouse is a faithful recreation of early Alabama education. Complete with slate boards, wooden desks, and a pot-bellied stove, it illustrates how children of all ages were taught together by a single teacher. Visitors can sit at the desks and experience what a lesson might have been like in the 1830s Alabama frontier.",
    audioFiles: [
      { fileId: "f_006a", filename: "schoolhouse-lesson.mp3", size: 4500000, url: "#", type: "audio" }
    ],
    videoFiles: [],
    textFiles: [
      { fileId: "f_006b", filename: "frontier-education.txt", size: 15600, url: "#", type: "text" }
    ],
    createdAt: "2025-03-01T08:30:00Z"
  },
  {
    locationId: "loc_oat_007",
    beaconId: "BLE-GRIST-007",
    name: "Grist Mill",
    description: "The grist mill demonstrates how corn and wheat were ground into meal and flour using water-powered stone grinding wheels. This essential piece of frontier infrastructure served entire communities, and millers were among the most important tradespeople in early Alabama settlements. Seasonal grinding demonstrations bring the machinery to life.",
    audioFiles: [
      { fileId: "f_007a", filename: "grist-mill-sounds.wav", size: 12400000, url: "#", type: "audio" },
      { fileId: "f_007b", filename: "miller-trade-narration.mp3", size: 3800000, url: "#", type: "audio" }
    ],
    videoFiles: [
      { fileId: "f_007c", filename: "grinding-demonstration.mp4", size: 55000000, url: "#", type: "video" }
    ],
    textFiles: [],
    createdAt: "2025-03-05T10:15:00Z"
  },
  {
    locationId: "loc_oat_008",
    beaconId: "BLE-DOCTOR-008",
    name: "Country Doctor's Office",
    description: "Step inside a rural physician's office from the 1850s, complete with medical instruments, apothecary bottles, and a treatment table. This exhibit reveals the challenges of frontier medicine — from herbal remedies and lancets to the early adoption of anesthesia. The doctor's ledger shows patient records and payment in goods rather than cash.",
    audioFiles: [
      { fileId: "f_008a", filename: "frontier-medicine.mp3", size: 5800000, url: "#", type: "audio" }
    ],
    videoFiles: [],
    textFiles: [
      { fileId: "f_008b", filename: "medical-instruments-guide.pdf", size: 1800000, url: "#", type: "text" },
      { fileId: "f_008c", filename: "apothecary-remedies.txt", size: 9200, url: "#", type: "text" }
    ],
    createdAt: "2025-03-10T13:00:00Z"
  },
  {
    locationId: "loc_oat_009",
    beaconId: "BLE-PRINT-009",
    name: "Print Shop",
    description: "Montgomery's early newspapers were critical to the political life of the Alabama capital. This working print shop features a reproduction letterpress where visitors can see how newspapers, handbills, and government documents were produced one sheet at a time. Docents demonstrate the typesetting process using individual lead characters.",
    audioFiles: [
      { fileId: "f_009a", filename: "printing-press-history.mp3", size: 4200000, url: "#", type: "audio" }
    ],
    videoFiles: [
      { fileId: "f_009b", filename: "letterpress-demo.mp4", size: 48000000, url: "#", type: "video" }
    ],
    textFiles: [
      { fileId: "f_009c", filename: "newspaper-history.pdf", size: 3200000, url: "#", type: "text" }
    ],
    createdAt: "2025-03-20T09:45:00Z"
  },
  {
    locationId: "loc_oat_010",
    beaconId: "BLE-GARDEN-010",
    name: "Heritage Garden & Grounds",
    description: "The Heritage Garden showcases plants, herbs, and crops that were commonly grown in 19th-century Alabama homesteads. From medicinal herbs like sassafras and comfrey to staple crops like sweet potatoes and field peas, the garden illustrates how families sustained themselves from the land. Seasonal blooms include heirloom roses, magnolias, and crepe myrtles.",
    audioFiles: [
      { fileId: "f_010a", filename: "garden-walking-tour.mp3", size: 7200000, url: "#", type: "audio" },
      { fileId: "f_010b", filename: "medicinal-herbs-guide.mp3", size: 3100000, url: "#", type: "audio" }
    ],
    videoFiles: [
      { fileId: "f_010c", filename: "seasonal-garden-overview.mp4", size: 35000000, url: "#", type: "video" }
    ],
    textFiles: [
      { fileId: "f_010d", filename: "plant-identification-map.pdf", size: 4500000, url: "#", type: "text" },
      { fileId: "f_010e", filename: "heirloom-varieties.txt", size: 6800, url: "#", type: "text" }
    ],
    createdAt: "2025-04-01T08:00:00Z"
  },
  {
    locationId: "loc_oat_011",
    beaconId: "BLE-BARN-011",
    name: "Pole Barn & Carriage House",
    description: "The pole barn and adjoining carriage house contain an impressive collection of 19th-century agricultural tools, horse-drawn vehicles, and farm implements. From plows and scythes to an elegant two-seat surrey, these artifacts show the range of transportation and farming technology available in frontier and antebellum Alabama.",
    audioFiles: [
      { fileId: "f_011a", filename: "farm-tools-narration.mp3", size: 3400000, url: "#", type: "audio" }
    ],
    videoFiles: [],
    textFiles: [
      { fileId: "f_011b", filename: "carriage-collection.pdf", size: 2100000, url: "#", type: "text" }
    ],
    createdAt: "2025-04-10T11:30:00Z"
  },
  {
    locationId: "loc_oat_012",
    beaconId: "BLE-DAVIS-012",
    name: "Davis-Cook House",
    description: "This stately Greek Revival home was built in the 1850s and represents the upper-class residential life of Montgomery's antebellum elite. With its tall columns, wide central hallway, and finely crafted interior woodwork, the Davis-Cook House is a showcase of Southern architectural ambition. Period furniture and household items fill each room.",
    audioFiles: [
      { fileId: "f_012a", filename: "greek-revival-architecture.mp3", size: 4800000, url: "#", type: "audio" },
      { fileId: "f_012b", filename: "antebellum-daily-life.mp3", size: 5500000, url: "#", type: "audio" }
    ],
    videoFiles: [
      { fileId: "f_012c", filename: "davis-cook-walkthrough.mp4", size: 72000000, url: "#", type: "video" }
    ],
    textFiles: [
      { fileId: "f_012d", filename: "greek-revival-guide.pdf", size: 1600000, url: "#", type: "text" },
      { fileId: "f_012e", filename: "cook-family-genealogy.txt", size: 18500, url: "#", type: "text" }
    ],
    createdAt: "2025-04-15T14:00:00Z"
  }
];

// ══════════════════════════════════════════════════
//  Initialize — seed sample data on first visit
// ══════════════════════════════════════════════════

function _ensureData() {
  const existing = _loadAll();
  if (!existing) {
    _saveAll(SAMPLE_LOCATIONS);
    return SAMPLE_LOCATIONS;
  }
  return existing;
}

// ══════════════════════════════════════════════════
//  Health Check
// ══════════════════════════════════════════════════

async function checkHealth() {
  return { status: "healthy", provider: "localStorage" };
}

// ══════════════════════════════════════════════════
//  Location CRUD
// ══════════════════════════════════════════════════

/** Fetch all tour locations */
async function fetchLocations() {
  const locations = _ensureData();
  return locations;
}

/** Fetch a single location by ID */
async function fetchLocation(locationId) {
  const locations = _ensureData();
  const loc = locations.find((l) => l.locationId === locationId);
  if (!loc) throw new Error("Location not found");
  return loc;
}

/** Create a new tour location */
async function createLocation({ beaconId, name, description }) {
  const locations = _ensureData();
  const newLoc = {
    locationId: _generateId(),
    beaconId,
    name,
    description: description || "",
    audioFiles: [],
    videoFiles: [],
    textFiles: [],
    createdAt: new Date().toISOString(),
  };
  locations.push(newLoc);
  _saveAll(locations);
  return newLoc;
}

/** Update location metadata */
async function updateLocation(locationId, updates) {
  const locations = _ensureData();
  const idx = locations.findIndex((l) => l.locationId === locationId);
  if (idx === -1) throw new Error("Location not found");

  if (updates.beaconId !== undefined) locations[idx].beaconId = updates.beaconId;
  if (updates.name !== undefined) locations[idx].name = updates.name;
  if (updates.description !== undefined) locations[idx].description = updates.description;

  _saveAll(locations);
  return locations[idx];
}

/** Delete a location and all its files */
async function deleteLocation(locationId) {
  let locations = _ensureData();
  const before = locations.length;
  locations = locations.filter((l) => l.locationId !== locationId);
  if (locations.length === before) throw new Error("Location not found");
  _saveAll(locations);
  return { success: true };
}

// ══════════════════════════════════════════════════
//  File Upload / Delete (stored as metadata in LS)
// ══════════════════════════════════════════════════

/**
 * Upload a file to a location.
 * Since we're using localStorage, we store file metadata
 * and a data-URL for small files (or just the name for large ones).
 */
async function uploadFile(locationId, file, onProgress) {
  const locations = _ensureData();
  const loc = locations.find((l) => l.locationId === locationId);
  if (!loc) throw new Error("Location not found");

  // Simulate upload progress
  if (onProgress) {
    for (let p = 0; p <= 80; p += 20) {
      onProgress(p);
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  // Determine file category
  const ext = file.name.split(".").pop().toLowerCase();
  const audioExts = ["mp3", "wav", "ogg", "m4a", "aac"];
  const videoExts = ["mp4", "webm", "mov", "avi"];

  let category;
  if (audioExts.includes(ext)) category = "audio";
  else if (videoExts.includes(ext)) category = "video";
  else category = "text";

  // For small files (< 2MB), store as data URL; otherwise store metadata only
  let fileUrl = "#";
  if (file.size < 2 * 1024 * 1024) {
    try {
      fileUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(file);
      });
    } catch {
      fileUrl = "#";
    }
  }

  const fileRecord = {
    fileId: _generateFileId(),
    filename: file.name,
    size: file.size,
    url: fileUrl,
    type: category,
    uploadedAt: new Date().toISOString(),
  };

  // Add to the correct list
  const listKey = category + "Files";
  if (!loc[listKey]) loc[listKey] = [];
  loc[listKey].push(fileRecord);

  // Try to save — handle quota exceeded
  try {
    _saveAll(locations);
  } catch (e) {
    // If we hit storage quota, store without data URL
    fileRecord.url = "#";
    _saveAll(locations);
  }

  if (onProgress) {
    onProgress(100);
    await new Promise((r) => setTimeout(r, 100));
  }

  return { file: fileRecord, location: loc };
}

/** Delete a specific file from a location */
async function deleteFile(locationId, fileId) {
  const locations = _ensureData();
  const loc = locations.find((l) => l.locationId === locationId);
  if (!loc) throw new Error("Location not found");

  let found = false;
  for (const key of ["audioFiles", "videoFiles", "textFiles"]) {
    if (!loc[key]) continue;
    const before = loc[key].length;
    loc[key] = loc[key].filter((f) => f.fileId !== fileId);
    if (loc[key].length < before) {
      found = true;
      break;
    }
  }

  if (!found) throw new Error("File not found");
  _saveAll(locations);
  return { success: true };
}

// ══════════════════════════════════════════════════
//  File URL Helper
// ══════════════════════════════════════════════════

function getDisplayUrl(url) {
  if (!url || url === "#") return "#";
  return url;
}
