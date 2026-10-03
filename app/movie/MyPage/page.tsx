import MovieLogsComponent from "@/app/Common/MovieLogsComponents"

export default async function MyPage(){
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">マイページ</h1>
      <MovieLogsComponent mode="MyPage" movieId=""/>
    </main>
  );
}