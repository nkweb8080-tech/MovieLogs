//鑑賞記録の表示方法はいくつか候補があるため、コンポーネントで分けておく
import Link from "next/link";
import { cookies } from "next/headers"
import { getUserInfo,setEditMode,setDeleteMode } from '@/app/Script/cookieAction/cookieAction'
import { getMovieLogs } from "@/app/Script/prismaFunction/MypageFunction"
import { updateMovieLog,deleteMovieLog } from "@/app/Script/registFunction/RegistMovieLogs"

type MovieLogsComponentProps = {
  mode : string,
  movieId : string
} 

export default async function MovieLogsComponent({mode,movieId}:MovieLogsComponentProps){
  const cookieStore = await cookies()
  const userId = String(await getUserInfo())
  const logs = (mode=="MyPage")? await getMovieLogs(userId,"") : await getMovieLogs(userId,movieId)
  const editId = cookieStore.get("editId")?.value
  const isEdit = cookieStore.get("isEdit")?.value === "true"
  const isDelete = cookieStore.get("isDelete")?.value === "true"

  if(mode=="MyPage")
  {
    return(
      <main className="mx-auto max-w-5xl p-6">
        <div>
          {logs?.map((log) => (
            <article
              key={log.id}
              className="overflow-hidden rounded border"
            >
              <Link href={`/movie/movieDetailPage/${log.movieId}`}>
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
              </Link>
            </article>
          ))}
        </div>
      </main>
    )
  }

  return(
    <main className="mx-auto max-w-5xl p-6">
      <div>
        {logs?.map((log) => (
          <article
            key={log.id}
            className="overflow-hidden rounded border"
          >
            <div className="p-4">
              {isEdit && editId==log.id ?(
                <div>
                  <form action={updateMovieLog}>
                    <span>鑑賞日：</span>
                    <input type="date" name="watchDate" defaultValue={(log.watchedAt.toISOString().split('T')[0])}/>
                    <p>評価：{log.rating}</p>
                    <input 
                      type="range"
                      name="hyouka"
                      min="1"
                      max="10"
                      id="HyoukaSlider"
                      defaultValue={log.rating}
                      />
                    <p>コメント：</p>
                    <textarea 
                        name="comment"
                        placeholder="コメントを記入"
                        cols={40}
                        rows={4}
                        defaultValue={String(log.review)}/>
                    <br/>
                    <button type="submit">更新</button>
                    <input type="hidden" name="movieLogId" value={log.id} />
                    <input type="hidden" name="movieId" value={log.movieId} />
                  </form>
                  <form action={setDeleteMode}>
                    <button type="submit">削除</button>
                  </form>
                  {isDelete ?(
                    <div>
                      <p>この鑑賞記録を削除しますか？</p>
                      <form action={deleteMovieLog}>
                        <button type="submit">はい</button>
                        <input type="hidden" name="movieLogId" value={log.id} />
                        <input type="hidden" name="movieId" value={log.movieId} />
                      </form>
                      <form action={setDeleteMode}>
                        <button type="submit" >戻る</button>
                      </form>
                    </div>
                  ):(
                  <></>
                  )
                  }
                    <form action={setEditMode}>
                      <button type="submit">取消</button>
                      <input type="hidden" name="editId" value="" />
                    </form>
                </div>
              ) : (
                <div>
                  <div>
                    <p>鑑賞日：{log.watchedAt.toISOString().split('T')[0]}</p>
                    <p>評価：{log.rating}</p>
                    <p>コメント：<br/>{String(log.review)}</p>
                  </div>
                  <div>
                    <form action={setEditMode}>
                      <button type="submit">編集</button>
                      <input type="hidden" name="editId" value={log.id} />
                    </form>
                  </div>
                </div>
              )
              }
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}