import MovieLogsComponent from "@/app/Common/MovieLogsComponents"

export default async function MyPage(){

  return (
    <section className="w-full">
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">マイページ</h1>
      <p className="mt-1 text-sm text-muted">これまでに登録した鑑賞記録の一覧です。</p>

      <div className="mt-6">
        <MovieLogsComponent mode="MyPage" movieId=""/>
      </div>
    </section>
  );
}
