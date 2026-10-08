import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "@/app/Common/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ==========================================================================
   [編集] メタデータを create-next-app の既定値から本アプリの内容へ変更
   ========================================================================== */
export const metadata: Metadata = {
  title: "Movie Logs",
  description: "観た映画の記録を残しておくためのアプリケーション",
};

/* ==========================================================================
   [新規追加] テーマ初期化スクリプト
   - React の描画前に localStorage / OS 設定から .dark を付与し、
     ダークモード利用時に白い画面が一瞬見える現象（FOUC）を防ぐ
   ========================================================================== */
const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var d=s==="dark"||(!s&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* ------------------------------------------------------------------
       [編集] lang を ja に変更し、テーマ用クラスをスクリプトで書き換える
       ため suppressHydrationWarning を付与
       ------------------------------------------------------------------ */
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* [新規追加] 初期テーマ適用 */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

        {/* ------------------------------------------------------------------
            [新規追加] 全ページ共通ヘッダー（ブランド表示＋テーマ切替）
            ------------------------------------------------------------------ */}
        <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6">
            <Link
              href="/movie/TopPage"
              className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                  aria-hidden="true"
                >
                  <rect x="2.5" y="4" width="19" height="16" rx="3" />
                  <path d="M7 4v16M17 4v16M2.5 9h19M2.5 15h19" />
                </svg>
              </span>
              <span className="text-base font-bold tracking-tight">
                Movie Logs
              </span>
            </Link>

            <ThemeToggle />
          </div>
        </header>

        {/* [編集] ページ本体を伸縮領域として包む */}
        <div className="flex-1">{children}</div>

        {/* ------------------------------------------------------------------
            [新規追加] 共通フッター（TMDB のクレジット表記を含む）
            ------------------------------------------------------------------ */}
        <footer className="mt-12 border-t border-line">
          <div className="mx-auto w-full max-w-5xl px-6 py-8 text-center text-xs leading-relaxed text-muted">
            <p className="font-semibold text-foreground">Movie Logs</p>
            <p className="mt-2">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
