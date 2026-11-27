import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "LinkStash privacy policy. Your bookmarks are stored only in your browser. No cookies, no tracking, no data collection.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: September 10, 2026
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">The short version</h2>
          <p className="mt-3">
            LinkStash stores your bookmarks exclusively in your browser&apos;s local
            storage on your own device. We do not collect any personal data, we do
            not use cookies, and we cannot see your bookmarks.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">What we collect</h2>
          <p className="mt-3">
            <strong className="text-gray-800 dark:text-gray-200">Nothing.</strong> LinkStash is a
            static website with no server, no database, and no analytics. The links,
            tags, notes, and favorites you add are written to your browser&apos;s local
            storage and never transmitted anywhere.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Local storage</h2>
          <p className="mt-3">
            Your bookmarks live in <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">localStorage</code> on
            your device. You can clear them at any time by clearing your browser
            data, or take them with you using the Export and Import features. We
            recommend exporting a backup regularly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cookies &amp; third parties</h2>
          <p className="mt-3">
            LinkStash uses no cookies, fingerprinting, or tracking. The only
            third-party request is to Google&apos;s public favicon service for the
            small icon tiles; your bookmarks and notes are never sent there. The
            links you open are opened directly in your own browser.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Legal compliance</h2>
          <p className="mt-3">
            Because we collect no personal data, there is nothing to comply with for
            GDPR, CCPA, or similar regulations — there are no data requests to answer
            and no data to delete.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h2>
          <p className="mt-3">
            Questions? Contact us through the website owner for LinkStash.
          </p>
        </section>
      </div>
    </div>
  );
}