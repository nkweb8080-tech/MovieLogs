import Tab from '@/app/Common/TabComponents'
import MyPage from '@/app/movie/MyPage/page'
import SeachPage from '@/app/movie/SearchPage/page'
import GoToButton from '@/app/Common/GoToPageButton'
import { getUserInfo } from '@/app/Script/cookieAction/cookieAction'
import type { SearchMovieProps } from "@/app/Types/SearchPageType"

export default async function TopPage({
  searchParams,
}: SearchMovieProps){

  const userInfo = String(await getUserInfo())

  /* ------------------------------------------------------------------
     [編集] 見た目のみ変更（取得処理・タブ構成は従来どおり）
     - 素の h1 / h3 の羅列だった導入部をヒーローカードに整理
     - ログイン状態をバッジで表示し、未ログイン時のみログイン導線を強調
     ------------------------------------------------------------------ */
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <section className="card p-6 sm:p-8">
        <span className="badge badge-primary">Movie Logs</span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          観た映画を、きちんと残す。
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          気になる作品を検索して、鑑賞日・評価・感想をまとめて記録できます。
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {userInfo ? (
            <span className="badge">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {userInfo}
            </span>
          ) : (
            <>
              <span className="badge">未ログイン</span>
              <GoToButton label="ログイン" goToPath='/movie/LoginPage'></GoToButton>
            </>
          )}
        </div>
      </section>

      <div className="mt-8">
        <Tab tabs={[
          {
            label: "検索",
            content: <SeachPage searchParams={searchParams}/>,
          },
          {
            label: "マイページ",
            content: <MyPage />,
          }
        ]}/>
      </div>
    </main>
  )
}
