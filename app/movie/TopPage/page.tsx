import Tab from '@/app/Common/Components/TabComponents'
import MyPage from '@/app/movie/MyPage/page'
import SeachPage from '@/app/movie/SearchPage/page'
import GoToButton from '@/app/Common/Components/GoToPageButton'
import LogoutButton from '@/app/Common/Components/LogoutButton'
import DummyLoginButton from '@/app/Common/Components/DummyLoginButton'
import { getUserInfo } from '@/app/Script/Actions/sessionAction'
import type { SearchMovieProps } from "@/app/Types/SearchPageType"

export default async function TopPage({
  searchParams,
}: SearchMovieProps){

  // Refactor: getUserInfo は string を返すため冗長な String() 変換を削除
  const userInfo = await getUserInfo()
  const isDev = process.env.NODE_ENV === "development";

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
            <div>
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
              <LogoutButton/>
            </div>
          ) : (
            // Refactor: 開発環境かどうかで重複していた未ログイン表示を共通化
            <>
              <span className="badge">未ログイン</span>
              <GoToButton label="ログイン" goToPath='/movie/LoginPage'></GoToButton>
              {isDev && <DummyLoginButton/>}
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
