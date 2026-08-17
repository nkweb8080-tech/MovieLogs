import Tab from '@/app/Common/TabComponents'
import MyPage from '@/app/movie/MyPage/page'
import SeachPage from '@/app/movie/SearchPage/page'
import GoToButton from '@/app/Common/GoToPageButton'
import type { SearchMovieProps } from "@/app/Types/SearchPageType"

export default async function TopPage({
  searchParams,
}: SearchMovieProps){
  return (
    <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-bold">Movie Logs</h1>
        <GoToButton label="ログイン" goToPath='/movie/LoginPage'></GoToButton>
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
    </main>
  )
}