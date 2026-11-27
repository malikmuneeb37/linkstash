import BookmarkDashboard from "@/components/BookmarkDashboard";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Slim warm hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-rose-400/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-amber-500/5 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-10 text-center sm:px-6 sm:py-12">
          <span className="inline-block rounded-full border border-amber-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-orange-700 shadow-sm backdrop-blur dark:border-orange-800 dark:bg-gray-900/70 dark:text-orange-300">
            100% Free · No Account · Private · Works Offline
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Your internet,{" "}
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              organized.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            Save any link, tag it, favorite it, and find it in seconds. Import your
            Chrome/Firefox bookmarks, auto-categorize the pile with one click, pin
            read-later — and export the whole library as a file you keep anywhere.
            No extension, no account — your bookmarks and notes never leave your
            device.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#dashboard"
              className="rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-orange-500/30 transition hover:brightness-110"
            >
              Open the Dashboard
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border-2 border-orange-200 bg-white/60 px-7 py-3 text-sm font-bold text-orange-700 backdrop-blur transition hover:border-orange-400 hover:bg-white dark:border-orange-800 dark:bg-gray-900/60 dark:text-orange-300"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* The Dashboard — centerpiece */}
      <section id="dashboard" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-16 sm:px-6">
        <BookmarkDashboard />
      </section>

      {/* How it works — horizontal timeline */}
      <section id="how-it-works" className="scroll-mt-20 border-t border-gray-100 bg-gray-50/80 py-16 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              How It Works
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              Three steps. No sign-up, no extension, no cloud.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mt-14">
              <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 dark:from-amber-800 dark:via-orange-800 dark:to-rose-800 md:block" />
              <div className="grid gap-10 md:grid-cols-3 md:gap-8">
                {[
                  { step: "01", icon: "➕", title: "Add a Link", desc: "Paste a URL or type a name — LinkStash saves it locally on your device in one click.", grad: "from-amber-500 to-orange-500" },
                  { step: "02", icon: "🏷️", title: "Organize It", desc: "One click auto-tags every link from its domain — then fine-tune with your own tags, notes, or favorites.", grad: "from-orange-500 to-rose-500" },
                  { step: "03", icon: "⚡", title: "Find It Instantly", desc: "Search across names, URLs, notes, and tags — results appear as you type.", grad: "from-rose-500 to-pink-500" },
                ].map((item) => (
                  <div key={item.step} className="relative text-center">
                    <div className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.grad} text-2xl text-white shadow-lg ring-4 ring-gray-50 dark:ring-gray-900`}>
                      {item.icon}
                    </div>
                    <span className="mt-4 block text-xs font-extrabold tracking-widest bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                      STEP {item.step}
                    </span>
                    <h3 className="mt-1.5 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              LinkStash vs. Browser Bookmarks
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              Your browser keeps bookmarks. LinkStash makes them useful.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-200 shadow-xl shadow-orange-500/5 dark:border-gray-700">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                    <th className="px-5 py-3.5 font-semibold">Feature</th>
                    <th className="px-5 py-3.5 font-semibold text-orange-700 dark:text-orange-300">LinkStash</th>
                    <th className="px-5 py-3.5 font-medium">Browser bookmarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {[
                    ["Find a link you saved years ago", "✅ Search + tags in one box", "❌ Scroll folders forever"],
                    ["Organize with custom tags", "✅ Unlimited tags, one-click filter", "❌ Fixed folder hierarchy"],
                    ["Organize a huge import", "✅ Auto-categorize + visual thumbnails", "❌ Manual folders, plain text list"],
                    ["Notes & descriptions on links", "✅ Add a note to every bookmark", "❌ Name only"],
                    ["Bring your browser's bookmarks over", "✅ Import Chrome/Firefox/Edge HTML export, JSON, or CSV", "❌ Locked inside one browser"],
                    ["Privacy", "✅ 100% local, no tracking", "❌ Your list lives in the browser cloud"],
                    ["Works on any device the same", "✅ Any browser, any OS, even offline", "❌ Fragmented per browser"],
                  ].map((row) => (
                    <tr key={row[0]} className="bg-white transition hover:bg-orange-50/50 dark:bg-gray-950 dark:hover:bg-orange-950/30">
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{row[0]}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{row[1]}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-500">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 bg-gray-50/80 py-16 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Why LinkStash?
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                A bookmark manager that respects your data by never seeing it.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: "🧠", title: "Auto-categorize", desc: "One click auto-tags the whole pile from domain + keyword rules (ai, dev, shopping, education…). Bring in a two-year bookmark dump and organize it in seconds." },
                { icon: "🖼️", title: "Visual thumbnails", desc: "Each link shows its site's real favicon tile, so you spot a site by eye instead of squinting at text. Offline or no icon? It falls back to a clean colored initial." },
                { icon: "🔒", title: "Truly private", desc: "Your links, tags, and notes live only in your browser's local storage. There is no database to hack, no account, nothing uploaded." },
                { icon: "🏷️", title: "Tag everything", desc: "Unlimited tags, filter by one click, favorites pinned. As you add a link, LinkStash suggests the categories for you." },
                { icon: "⚡", title: "Instant search", desc: "Search across names, URLs, notes, and tags. Results appear while you type." },
                { icon: "💾", title: "Your library is a file you own", desc: "Export JSON, CSV, or HTML anytime and keep the file in your Drive folder. Import works from JSON, CSV — or even a Chrome/Firefox bookmarks export — so you can bring a whole browser's history over and open your library on any device." },
                { icon: "♻️", title: "Dedup & clean up", desc: "Found 40 duplicates after importing your browser? LinkStash detects them in one click and keeps the newest copy." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 dark:border-gray-700 dark:bg-gray-950 dark:hover:border-orange-600"
                >
                  <div className="text-3xl">{item.icon}</div>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              People Who Ditched the Extension
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { quote: "I had 3 years of bookmarks thrown in the browser pile. LinkStash found every tutorial I saved, in seconds, with tags.", name: "Samira K.", role: "Freelance designer" },
                { quote: "No extension, no account, no tracking — and it works on my phone and laptop exactly the same. Exactly what I wanted.", name: "Daniyal M.", role: "Civil engineer" },
                { quote: "The export/import saved me when I changed laptops. Full list, tags and all, back in under a minute.", name: "Priya S.", role: "Researcher" },
              ].map((t) => (
                <figure key={t.name} className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 dark:border-gray-700 dark:bg-gray-950 dark:hover:border-orange-600">
                  <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400">“{t.quote}”</p>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-rose-500 text-xs font-bold text-white">
                      {t.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Privacy banner */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 p-8 text-center text-white shadow-2xl shadow-orange-500/30 sm:p-12">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="text-4xl">🔒</div>
                <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                  Your links never leave your browser.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-amber-100 sm:text-base">
                  LinkStash stores everything in your device&apos;s local storage. No
                  server, no cloud, no analytics, no account. Clear your data any time
                  — or take it with you via export.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-gray-100 bg-gray-50/80 py-16 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="rounded-3xl border border-dashed border-orange-300 bg-gradient-to-br from-amber-50 to-rose-50 p-8 text-center dark:border-orange-700 dark:from-amber-950/40 dark:to-rose-950/40 sm:p-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                Your browser tab has that link. Again.
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600 dark:text-gray-400">
                Stop losing links in open tabs and folders. Save it once in LinkStash
                and find it forever — privately, instantly, offline.
              </p>
              <a
                href="#dashboard"
                className="mt-6 inline-block rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-orange-500/30 transition hover:brightness-110"
              >
                Start Organizing
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50/80 py-16 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8 space-y-4">
              {[
                { q: "Is LinkStash really free?", a: "Yes. No sign-up, no limits, no hidden costs. It's free forever." },
                { q: "Where is my data stored?", a: "In your browser's local storage on your own device, and in the backup files you export. It is never sent to any server." },
                { q: "What happens if I clear my browser data?", a: "Your bookmarks would be cleared too — but your library is a file. Export JSON/CSV/HTML and keep it in your Drive folder; open it on any device, anytime." },
                { q: "Can I move my existing browser bookmarks in?", a: "Yes. Export your bookmarks as HTML in Chrome/Firefox/Edge (Bookmarks manager → Export), or drop a JSON/CSV file, and LinkStash imports them as cards, with folder names turned into tags. Duplicate detection cleans up the result." },
                { q: "Can I move my bookmarks to another device?", a: "Yes. Export a backup on one device, then Import it on the other. Everything — tags, notes, favorites — comes with it." },
                { q: "Does it fetch favicons from the internet?", a: "Only the thumbnail tiles: LinkStash asks Google's public favicon service for each site's icon (cached by your browser). If you're offline or a site has no icon, it falls back to a locally-generated initial. Your bookmarks and notes themselves never leave your device." },
                { q: "Do I need an extension or installation?", a: "No. It's a website that works in any modern browser, including on mobile, and keeps working offline once loaded." },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-300 dark:border-gray-700 dark:bg-gray-950 dark:hover:border-orange-600"
                >
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                    {faq.q}
                    <svg
                      className="ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}