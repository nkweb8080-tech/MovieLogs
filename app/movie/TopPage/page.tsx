import Tab from '../../Common/TabComponents'
import MyPage from '../MyPage/page'
import SeachPage from '../SearchPage/page'
import type { SearchMovieProps } from "../../Types/SearchPageType"

export default async function TopPage({
  searchParams,
}: SearchMovieProps){
  return (
    <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-bold">Movie Logs</h1>
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