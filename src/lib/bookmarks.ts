export interface Bookmark {
  id: string;
  url: string;
  name: string;
  tags: string[];
  favorite: boolean;
  note: string;
  createdAt: number;
  later?: boolean;
}

const STORAGE_KEY = "linkstash.v1";

const warmPalette = [
  "from-amber-400 to-orange-500",
  "from-orange-500 to-rose-500",
  "from-rose-400 to-pink-500",
  "from-yellow-400 to-amber-500",
  "from-red-400 to-rose-500",
];

export function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function avatarGradient(seed: string): string {
  return warmPalette[hashCode(seed.toLowerCase()) % warmPalette.length];
}

export function domainOf(url: string): string {
  try {
    const u = new URL(url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url.trim().split("/")[0] || "link";
  }
}

export function nameFromUrl(url: string): string {
  return domainOf(url).split(".")[0] || "Untitled";
}

export function initialsOf(seed: string): string {
  const cleaned = seed.trim().split(/[\s.]+/).filter(Boolean);
  if (cleaned.length >= 2) {
    return (cleaned[0][0] + cleaned[1][0]).toUpperCase();
  }
  return (cleaned[0]?.slice(0, 2) ?? seed.slice(0, 2)).toUpperCase();
}

export function faviconUrl(url: string, size = 64): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domainOf(url))}&sz=${size}`;
}

const CATEGORY_RULES: { tag: string; match: RegExp }[] = [
  { tag: "ai", match: /openai|chatgpt|claude|anthropic|gemini|deepseek|cohere|midjourney|perplexity|huggingface|bard/ },
  { tag: "video", match: /youtube|twitch|vimeo|dailymotion|tiktok/ },
  { tag: "dev", match: /github|gitlab|bitbucket|stackoverflow|stackexchange|dev\.to|sourceforge|npm|docker|vercel|netlify|w3schools|mdn/ },
  { tag: "social", match: /facebook|instagram|twitter|\.x\.com|linkedin|reddit|snapchat|threads|mastodon|whatsapp|telegram|discord|pinterest/ },
  { tag: "email", match: /gmail|outlook|proton|zoho|yandex\.com\/mail|icloud\.com\/mail|mailq|email/ },
  { tag: "shopping", match: /amazon|ebay|aliexpress|daraz|flipkart|snapdeal|shopify|etsy|walmart|alibaba|olx/ },
  { tag: "finance", match: /paypal|wise|bank|nbp|hbl|mcb|ubl|easypaisa|jazzcash|crypto|bitcoin|binance|coinbase|stripe|finance/ },
  { tag: "entertainment", match: /netflix|hbo|disney|primevideo|hulu|spotify|soundcloud|crunchyroll|appletv/ },
  { tag: "education", match: /university|college|school|academy|udemy|coursera|edx|khanacademy|exam|test|admission|board|bise|fpsc|nts|gre/ },
  { tag: "documents", match: /gov|govt|nic\.in|passport|nadra|cnic|tax|fbr|court|registr/ },
  { tag: "jobs", match: /freelancer|upwork|fiverr|indeed|glassdoor|job|career|rozee|employee/ },
  { tag: "news", match: /news|cnn|bbc|aljazeera|dawn|geo|tribune|reuters|apnews|nytimes|guardian/ },
  { tag: "design", match: /dribbble|behance|figma|canva|unsplash|deviantart|pixabay/ },
  { tag: "productivity", match: /docs|sheets|slides|drive|notion|clickup|asana|trello|slack|teams|microsoft365|office|calendar|todo|evernote/ },
  { tag: "reading", match: /medium|substack|blog|wikipedia|archive|kindle|gutenberg|buymeacoffee/ },
  { tag: "travel", match: /maps|waze|booking|airbnb|skyscanner|expedia|makemytrip|transport|airline|pakrail/ },
];

export function suggestTags(b: { url: string; name?: string }): string[] {
  const hay = `${b.name ?? ""} ${b.url}`.toLowerCase();
  const found: string[] = [];
  for (const rule of CATEGORY_RULES) {
    if (rule.match.test(hay)) found.push(rule.tag);
  }
  return [...new Set(found)].slice(0, 3);
}

export function autoTagAll(items: Bookmark[]): Bookmark[] {
  return items.map((b) => {
    const existing = new Set(b.tags ?? []);
    const toAdd = suggestTags(b).filter((t) => !existing.has(t));
    if (toAdd.length === 0) return b;
    return { ...b, tags: [...existing, ...toAdd] };
  });
}

export function createBookmark(input: {
  url: string;
  name?: string;
  tags?: string[];
  favorite?: boolean;
  note?: string;
  later?: boolean;
}): Bookmark {
  const url = input.url.trim();
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    url,
    name: (input.name ?? "").trim() || nameFromUrl(url),
    tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean),
    favorite: Boolean(input.favorite),
    note: (input.note ?? "").trim(),
    createdAt: Date.now(),
    later: Boolean(input.later),
  };
}

export function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Bookmark[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (b) => b && typeof b.url === "string" && typeof b.name === "string"
    );
  } catch {
    return [];
  }
}

export function saveBookmarks(items: Bookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or unavailable — silent, tool stays usable in-memory
  }
}

export function sortBookmarks(items: Bookmark[], mode: string): Bookmark[] {
  const arr = [...items];
  if (mode === "alpha") arr.sort((a, b) => a.name.localeCompare(b.name));
  else arr.sort((a, b) => b.createdAt - a.createdAt);
  return arr;
}

export function dedupeByUrl(items: Bookmark[]): Bookmark[] {
  const seen = new Set<string>();
  return items.filter((b, i) => {
    const key = b.url.trim().toLowerCase();
    const ownedByNewer = seen.has(key) ? false : true;
    seen.add(key);
    return ownedByNewer || items.findIndex((x) => x.url.trim().toLowerCase() === key) === i;
  });
}

export const sampleBookmarks: Bookmark[] = [
  {
    id: "ex-1",
    url: "https://openai.com/chatgpt",
    name: "ChatGPT",
    tags: ["ai", "tools"],
    favorite: true,
    note: "My daily assistant for writing and coding.",
    createdAt: Date.now() - 60000 * 60 * 24 * 30,
  },
  {
    id: "ex-2",
    url: "https://www.youtube.com",
    name: "YouTube",
    tags: ["learning", "video"],
    favorite: true,
    note: "",
    createdAt: Date.now() - 60000 * 60 * 24 * 26,
  },
  {
    id: "ex-3",
    url: "https://dribbble.com",
    name: "Dribbble",
    tags: ["design", "inspiration"],
    favorite: false,
    note: "Design inspiration for projects.",
    createdAt: Date.now() - 60000 * 60 * 24 * 12,
  },
  {
    id: "ex-4",
    url: "https://www.freelancer.com",
    name: "Freelancer",
    tags: ["work", "freelancing"],
    favorite: false,
    note: "Gig ideas and freelancing tips.",
    createdAt: Date.now() - 60000 * 60 * 9,
  },
  {
    id: "ex-5",
    url: "https://www.nadra.gov.pk",
    name: "NADRA Documents",
    tags: ["important", "documents"],
    favorite: true,
    note: "Keep this handy for form requirements.",
    createdAt: Date.now() - 60000 * 30,
  },
];

export function exportAsJson(items: Bookmark[]): void {
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `linkstash-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAsHtml(items: Bookmark[]): void {
  const rows = items
    .map(
      (b) =>
        `<tr><td>${escapeHtml(b.name)}</td><td><a href="${escapeHtml(b.url)}">${escapeHtml(domainOf(b.url))}</a></td><td>${escapeHtml((b.tags ?? []).join(", "))}</td><td>${escapeHtml(b.note)}</td></tr>`
    )
    .join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>My Bookmarks</title><style>body{font-family:system-ui;max-width:900px;margin:40px auto;padding:0 16px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #e5e5e5;padding:8px 10px;text-align:left;font-size:14px}</style></head><body><h1>My Bookmarks</h1><table><thead><tr><th>Name</th><th>Link</th><th>Tags</th><th>Note</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-bookmarks.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeTag(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export function parseBrowserHtml(html: string): Bookmark[] {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const rootDl = doc.querySelector("dl");
    if (!rootDl) return [];
    const results: Bookmark[] = [];
    const walk = (dl: Element, tags: string[]) => {
      dl.querySelectorAll(":scope > dt").forEach((dt) => {
        const a = dt.querySelector(":scope > a");
        if (a) {
          const raw = a.getAttribute("href") ?? "";
          if (raw && !raw.startsWith("place:") && !raw.startsWith("javascript:")) {
            const dd = dt.querySelector(":scope > dd");
            results.push(
              createBookmark({
                url: raw,
                name: a.textContent?.trim() ?? "",
                tags,
                note: dd?.textContent?.trim() ?? "",
              })
            );
          }
        }
        const sub = dt.querySelector(":scope > dl");
        if (sub) {
          const h3 = dt.querySelector(":scope > h3");
          const subTags = h3 ? [...tags, normalizeTag(h3.textContent ?? "")].filter(Boolean) : tags;
          walk(sub, subTags);
        }
      });
    };
    walk(rootDl, []);
    return results;
  } catch {
    return [];
  }
}

export function exportAsCsv(items: Bookmark[]): void {
  const header = "name,url,tags,note,favorite";
  const lines = items.map((b) => {
    const cell = (s: string | string[]) => {
      const joined = Array.isArray(s) ? s.join("; ") : s;
      return `"${joined.replace(/"/g, '""')}"`;
    };
    return [cell(b.name), cell(b.url), cell(b.tags ?? []), cell(b.note), b.favorite ? "yes" : "no"].join(",");
  });
  const blob = new Blob([["\uFEFF", header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `linkstash-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQ = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export function parseCsv(text: string): Bookmark[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((l, i) => l.trim() && i > 0);
  return lines
    .map((line) => {
      const [name, url, tags, note, favorite] = parseCsvLine(line);
      if (!url || url === "url") return null;
      return createBookmark({
        url,
        name: name || undefined,
        tags: tags ? tags.split(/[;,]/).map((t) => t.trim()).filter(Boolean) : [],
        note: note || undefined,
        favorite: favorite === "yes",
      });
    })
    .filter((b): b is Bookmark => Boolean(b));
}

export function findDuplicateGroups(items: Bookmark[]): Bookmark[][] {
  const map = new Map<string, Bookmark[]>();
  items.forEach((b) => {
    const key = b.url.trim().toLowerCase();
    const group = map.get(key) ?? [];
    group.push(b);
    map.set(key, group);
  });
  return [...map.values()].filter((g) => g.length > 1);
}

export function dedupeKeepNewest(items: Bookmark[]): Bookmark[] {
  const seen = new Map<string, Bookmark>();
  [...items]
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .forEach((b) => {
      const key = b.url.trim().toLowerCase();
      if (!seen.has(key)) seen.set(key, b);
    });
  return [...seen.values()];
}