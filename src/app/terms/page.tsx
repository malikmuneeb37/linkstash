import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "LinkStash terms of service. A free, private, in-browser bookmark manager.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: September 10, 2026
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. Agreement</h2>
          <p className="mt-3">
            By using LinkStash, you agree to these terms. If you do not agree, please
            do not use the tool.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. What LinkStash is</h2>
          <p className="mt-3">
            LinkStash is a free, in-browser bookmark manager. It stores your data
            locally on your device and provides no cloud service or sync.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. Your responsibility</h2>
          <p className="mt-3">
            You are responsible for the links you save and for keeping your own
            backups. Local data can be lost if you clear your browser storage.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. No warranty</h2>
          <p className="mt-3">
            LinkStash is provided &quot;as is&quot; without warranties of any kind,
            including availability or data durability.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">5. Limitation of liability</h2>
          <p className="mt-3">
            To the maximum extent permitted by law, LinkStash shall not be liable for
            any damages arising from its use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6. No cost, no accounts</h2>
          <p className="mt-3">
            LinkStash is free and requires no account. We do not sell, rent, or share
            any data (we collect none).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">7. Changes</h2>
          <p className="mt-3">
            We may update these terms from time to time. Continued use after changes
            means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">8. Contact</h2>
          <p className="mt-3">
            Questions? Contact us through the website owner for LinkStash.
          </p>
        </section>
      </div>
    </div>
  );
}