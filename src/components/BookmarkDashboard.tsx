"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bookmark,
  avatarGradient,
  domainOf,
  initialsOf,
  faviconUrl,
  suggestTags,
  autoTagAll,
  createBookmark,
  loadBookmarks,
  saveBookmarks,
  sortBookmarks,
  exportAsJson,
  exportAsCsv,
  downloadAsHtml,
  parseBrowserHtml,
  parseCsv,
  findDuplicateGroups,
  dedupeKeepNewest,
  sampleBookmarks,
} from "@/lib/bookmarks";

type SortMode = "newest" | "alpha";

export default function BookmarkDashboard() {
  const [items, setItems] = useState<Bookmark[]>([]);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("All");
  const [later, setLater] = useState(false);
  const [sort, setSort] = useState<SortMode>("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Bookmark | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [favFailed, setFavFailed] = useState<Record<string, boolean>>({});

  const [formUrl, setFormUrl] = useState("");
  const [formName, setFormName] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formFav, setFormFav] = useState(false);
  const [formLater, setFormLater] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setItems(loadBookmarks());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveBookmarks(items);
  }, [items, ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((b) => (b.tags ?? []).forEach((t) => set.add(t)));
    return [...set].sort();
  }, [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (tag !== "All") list = list.filter((b) => (b.tags ?? []).includes(tag));
    if (later) list = list.filter((b) => b.later);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          b.note.toLowerCase().includes(q) ||
          domainOf(b.url).toLowerCase().includes(q) ||
          (b.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return sortBookmarks(list, sort);
  }, [items, tag, later, search, sort]);

  const favCount = items.filter((b) => b.favorite).length;
  const laterCount = items.filter((b) => b.later).length;
  const untaggedCount = items.filter((b) => (b.tags ?? []).length === 0).length;
  const dupGroups = useMemo(() => findDuplicateGroups(items), [items]);
  const dupCount = dupGroups.reduce((n, g) => n + (g.length - 1), 0);

  const suggestedTags = useMemo(() => {
    if (editing || !formUrl.trim()) return [];
    return suggestTags({ url: formUrl, name: formName });
  }, [formUrl, formName, editing]);

  const openAdd = () => {
    setEditing(null);
    setFormUrl("");
    setFormName("");
    setFormTags("");
    setFormNote("");
    setFormFav(false);
    setFormLater(false);
    setModalOpen(true);
  };

  const openEdit = (b: Bookmark) => {
    setEditing(b);
    setFormUrl(b.url);
    setFormName(b.name);
    setFormTags((b.tags ?? []).join(", "));
    setFormNote(b.note);
    setFormFav(b.favorite);
    setFormLater(Boolean(b.later));
    setModalOpen(true);
  };

  const saveForm = () => {
    if (!formUrl.trim()) {
      setToast("Please enter a URL");
      return;
    }
    const duplicate = items.some(
      (b) => b.url.trim().toLowerCase() === formUrl.trim().toLowerCase() && b.id !== editing?.id
    );
    if (duplicate) {
      setToast("Already saved — edit that one instead");
      return;
    }
    if (editing) {
      setItems((prev) =>
        prev.map((b) =>
          b.id === editing.id
            ? {
                ...b,
                url: formUrl.trim(),
                name: formName.trim() || domainOf(formUrl),
                tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
                note: formNote.trim(),
                favorite: formFav,
                later: formLater,
              }
            : b
        )
      );
      setToast("Bookmark updated");
    } else {
      setItems((prev) => [
        createBookmark({
          url: formUrl,
          name: formName,
          tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
          note: formNote,
          favorite: formFav,
          later: formLater,
        }),
        ...prev,
      ]);
      setToast("Bookmark saved");
    }
    setModalOpen(false);
  };

  const toggleFavorite = (id: string) => {
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
  };

  const toggleLater = (id: string) => {
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, later: !b.later } : b)));
  };

  const removeDuplicates = () => {
    setItems((prev) => {
      const next = dedupeKeepNewest(prev);
      const removed = prev.length - next.length;
      if (removed > 0) setToast(`${removed} duplicate(s) removed`);
      return next;
    });
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((b) => b.id !== id));
    setToast("Bookmark removed");
  };

  const copyUrl = async (b: Bookmark) => {
    try {
      await navigator.clipboard.writeText(b.url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = b.url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setToast("Link copied");
  };

  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isHtml = /\.(html?|htm)$/i.test(file.name);
    const isCsv = /\.csv$/i.test(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result);
        let clean: Bookmark[] = [];
        if (isCsv) {
          clean = parseCsv(text);
        } else if (isHtml) {
          clean = parseBrowserHtml(text);
        } else {
          const parsed = JSON.parse(text) as Bookmark[];
          if (!Array.isArray(parsed)) throw new Error("bad");
          clean = parsed.filter((b) => b && typeof b.url === "string");
        }
        setItems((prev) => {
          const existing = new Set(prev.map((b) => b.url.trim().toLowerCase()));
          const fresh = clean
            .filter((b) => !existing.has(b.url.trim().toLowerCase()))
            .map((b) => ({ ...b, tags: b.tags ?? [], later: Boolean(b.later) }));
          return [...fresh, ...prev];
        });
        setToast(`${clean.length} bookmark(s) imported${isHtml ? " (browser export)" : ""}`);
      } catch {
        setToast("Could not read that file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const inputCls =
    "w-full rounded-xl border-2 border-amber-200 bg-white p-3 text-sm text-gray-900 outline-none transition focus:border-orange-400 dark:border-gray-700 dark:bg-gray-950 dark:text-white";

  const labelCls = "mb-1 block text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400";

  return (
    <div>
      {/* Toolbar */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl shadow-orange-500/5 dark:border-gray-700 dark:bg-gray-900 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAdd}
            className="rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
          >
            ➕ Add Bookmark
          </button>

          <div className="relative min-w-[220px] flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, URL, tag..."
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-orange-400 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="rounded-xl border-2 border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-orange-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
          >
            <option value="newest">Newest first</option>
            <option value="alpha">A → Z</option>
          </select>

          <button
            onClick={() => exportAsJson(items)}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            title="Download JSON backup"
          >
            ⬇ Export
          </button>
          <button
            onClick={() => exportAsCsv(items)}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            title="Download CSV for Excel / Sheets"
          >
            ⬇ CSV
          </button>
          <button
            onClick={() => downloadAsHtml(items)}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            title="Download readable HTML list"
          >
            🖨 Print list
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            title="Import JSON, browser HTML export, or CSV"
          >
            ⬆ Import
          </button>
          <input ref={fileInputRef} type="file" accept=".json,.html,.htm,.csv" className="hidden" onChange={onImportFile} />
          <button
            onClick={() => {
              setItems((prev) => {
                const next = autoTagAll(prev);
                const added = next.reduce((n, b, i) => {
                  return n + (b.tags ?? []).length - (prev[i]?.tags?.length ?? 0);
                }, 0);
                if (added > 0) setToast(`${added} auto-tag${added > 1 ? "s" : ""} applied`);
                else setToast("Nothing to tag — every link already has suggested tags");
                return next;
              });
            }}
            disabled={untaggedCount === 0}
            className="rounded-xl border-2 border-orange-300 px-4 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/40"
            title="Auto-categorize every untagged link (works offline, keyword rules)"
          >
            🧠 Auto-tag
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Saved links", value: items.length, icon: "🔖" },
            { label: "Favorites", value: favCount, icon: "⭐" },
            { label: "Read later", value: laterCount, icon: "📌" },
            { label: "Untagged", value: untaggedCount, icon: "🧠" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 dark:border-amber-900/50 dark:from-amber-950/40 dark:to-orange-950/40">
              <p className="text-lg font-extrabold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {s.icon} {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tag chips */}
        <div className="mt-4 flex flex-wrap gap-2 pb-1">
          <button
            onClick={() => setLater(false)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              !later
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-orange-500/25"
                : "border border-gray-200 text-gray-600 hover:border-orange-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-orange-600"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setLater(true)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              later
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-orange-500/25"
                : "border border-gray-200 text-gray-600 hover:border-orange-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-orange-600"
            }`}
          >
            📌 Read later ({laterCount})
          </button>
          {["All", ...allTags].map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                tag === t
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-orange-500/25"
                  : "border border-gray-200 text-gray-600 hover:border-orange-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-orange-600"
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Duplicate links banner */}
      {dupCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-purple-300 bg-purple-50 px-5 py-3.5 dark:border-purple-800 dark:bg-purple-950/40">
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
            ♻️ {dupCount} duplicate link{dupCount > 1 ? "s" : ""} detected
          </span>
          <button
            onClick={removeDuplicates}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-purple-500/25 transition hover:brightness-110"
          >
            Remove all but newest
          </button>
        </div>
      )}

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-orange-200 bg-white/60 p-14 text-center dark:border-orange-900 dark:bg-gray-900/40">
          <div className="text-5xl">{items.length === 0 ? "🔖" : "🔍"}</div>
          <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
            {items.length === 0 ? "No bookmarks yet" : "Nothing matches your search"}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            {items.length === 0
              ? "Save your first link and organize it with tags — everything stays on this device."
              : "Try a different word, or clear the tag filter."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={openAdd}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
            >
              ➕ Add your first bookmark
            </button>
            {items.length === 0 && (
              <button
                onClick={() => setItems(sampleBookmarks)}
                className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Load examples
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-orange-600"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${avatarGradient(b.url)} text-sm font-extrabold text-white shadow-md`}
                >
                  {favFailed[b.id] ? (
                    <span>{initialsOf(b.name || b.url)}</span>
                  ) : (
                    <img
                      src={faviconUrl(b.url)}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={() => setFavFailed((p) => ({ ...p, [b.id]: true }))}
                      className="h-full w-full rounded-xl bg-white object-cover"
                    />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white">
                    {b.name}
                  </h3>
                  <p className="truncate text-xs text-gray-400">{domainOf(b.url)}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(b.id)}
                  className={`text-lg transition hover:scale-110 ${b.favorite ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
                  title={b.favorite ? "Remove favorite" : "Mark favorite"}
                >
                  ★
                </button>
                <button
                  onClick={() => toggleLater(b.id)}
                  className={`text-lg transition hover:scale-110 ${b.later ? "text-orange-500" : "text-gray-300 dark:text-gray-600"}`}
                  title={b.later ? "Remove from read later" : "Read later"}
                >
                  📌
                </button>
              </div>

              {b.note && (
                <p className="mt-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{b.note}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {(b.tags ?? []).map((t) => (
                  <span
                    key={t}
                    onClick={() => setTag(t)}
                    className="cursor-pointer rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-600 transition hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110"
                >
                  Open ↗
                </a>
                <button
                  onClick={() => openEdit(b)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => copyUrl(b)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  title="Copy link"
                >
                  🔗
                </button>
                <button
                  onClick={() => deleteItem(b.id)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 dark:border-gray-700 dark:hover:bg-red-950/50"
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-center text-[11px] text-gray-400">
        🔒 Private by design — no account, nothing uploaded. Take your library with you: import a browser/bookmark JSON, CSV or HTML export, and export anytime. Your backup file is the product — keep it in your Drive folder and open it on any device.
      </p>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editing ? "Edit bookmark" : "Add a bookmark"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className={labelCls}>URL *</span>
                <input value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://example.com" className={inputCls} />
              </label>
              <label className="block">
                <span className={labelCls}>Name</span>
                <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Auto from URL if empty" className={inputCls} />
              </label>
              <label className="block">
                <span className={labelCls}>Tags</span>
                <input value={formTags} onChange={(e) => setFormTags(e.target.value)} placeholder="work, design, ai" className={inputCls} />
              </label>
              {suggestedTags.length > 0 && (
                <div>
                  <span className={labelCls}>Auto-categorized (click to add)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedTags.map((t) => (
                      <button
                        key={t}
                        onClick={() =>
                          setFormTags((prev) => {
                            const set = new Set(
                              (prev ?? "")
                                .split(",")
                                .map((x) => x.trim().toLowerCase())
                                .filter(Boolean)
                            );
                            set.add(t);
                            return [...set].join(", ");
                          })
                        }
                        className="rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 transition hover:bg-orange-100 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-300"
                      >
                        + #{t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <label className="block">
                <span className={labelCls}>Note</span>
                <textarea value={formNote} onChange={(e) => setFormNote(e.target.value)} rows={2} placeholder="Optional note..." className={inputCls} />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={formFav}
                  onChange={(e) => setFormFav(e.target.checked)}
                  className="h-4 w-4 accent-orange-500"
                />
                Mark as favorite
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={formLater}
                  onChange={(e) => setFormLater(e.target.checked)}
                  className="h-4 w-4 accent-orange-500"
                />
                Read later
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveForm}
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
              >
                {editing ? "Save changes" : "Add bookmark"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xl dark:bg-white dark:text-gray-900">
          {toast}
        </div>
      )}
    </div>
  );
}