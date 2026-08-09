import Tab from '../../Common/TabComponents'
import MyPage from '../MyPage/page'
import SeachPage from '../SearchPage/page'

//検索用の型を定義　
//検索ページと重複するため改善の余地あり（TODO）

type SearchParams = {
  query?: string;
  page?: string;
};

type SearchMovieProps = {
  searchParams: Promise<SearchParams>;
};

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