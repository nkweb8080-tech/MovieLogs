/* ==========================================================================
   [新規追加] ダークモード切替ボタン
   - html 要素の .dark クラスを付け外しし、選択内容を localStorage に保存する
   - アイコンの出し分けは CSS（dark: バリアント）で行うため、
     初回描画時に state を持たず hydration の不一致が起きない
   - 外部ライブラリは使用していない（React と Tailwind のみ）
   ========================================================================== */
"use client"

export default function ThemeToggle() {
  //テーマを反転させて html.dark を更新し、localStorage に保存する
  const toggleTheme = () => {
    const root = document.documentElement
    const nextIsDark = !root.classList.contains("dark")

    root.classList.toggle("dark", nextIsDark)

    try {
      localStorage.setItem("theme", nextIsDark ? "dark" : "light")
    } catch {
      //プライベートモード等で保存できない場合は無視する
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="ライトモードとダークモードを切り替える"
      title="テーマを切り替える"
      className="btn btn-outline size-10 px-0"
    >
      {/* ライトテーマ表示中：月アイコン（押すとダークへ） */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[1.125rem] dark:hidden"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>

      {/* ダークテーマ表示中：太陽アイコン（押すとライトへ） */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden size-[1.125rem] dark:block"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  )
}
