import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-xs font-bold text-white">
                🔖
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                LinkStash
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Your internet, organized. Save anything, tag it, find it in seconds — 100% on your device.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/" className="transition hover:text-orange-600">Home</Link></li>
              <li><Link href="/#dashboard" className="transition hover:text-orange-600">Dashboard</Link></li>
              <li><Link href="/#features" className="transition hover:text-orange-600">Features</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/privacy" className="transition hover:text-orange-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition hover:text-orange-600">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Why LinkStash</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>No account, no sign-up</li>
              <li>Works offline</li>
              <li>Full backup &amp; restore</li>
              <li>Free forever</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
          &copy; {new Date().getFullYear()} LinkStash. All rights reserved. Your links stay yours.
        </div>
      </div>
    </footer>
  );
}