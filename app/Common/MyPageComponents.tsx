//鑑賞記録の表示方法はいくつか候補があるため、コンポーネントで分けておく
import { getMovieLogs } from "@/app/Script/prismaFunction/MypageFunction"

export default async function MyPageComponent(){
  const logs = await getMovieLogs();
  return(
    <main className="mx-auto max-w-5xl p-6">
      <div>
        {logs?.map((log) => (
          <article
            key={log.id}
            className="overflow-hidden rounded border"
          >
            <div className="p-4" >
                <p className="mt-1 text-sm text-white">
                  タイトル：{log.title}
                </p>
                <p className="mt-1 text-sm text-white">
                  鑑賞日：{log.watchedAt.toISOString().split('T')[0]}
                </p>
                <p className="mt-1 text-sm text-white">
                  評価：{log.rating}
                </p>
                <input type="hidden" name="movieId" value={log.movieId} />  
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}