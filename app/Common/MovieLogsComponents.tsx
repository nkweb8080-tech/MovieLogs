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
    /* ------------------------------------------------------------------
       [編集] 見た目のみ変更（取得処理・遷移先は従来どおり）
       - ページ内に埋め込まれるコンポーネントのため <main> → <div> へ変更
       - 黒背景前提の text-white を廃止し、カラートークン（text-muted 等）へ
       - 1件ずつ縦積みだった表示をカードグリッドに変更
       - 記録が0件のときの空状態を追加
       ------------------------------------------------------------------ */
    return(
      <div className="w-full">
        {!logs || logs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-6 py-10 text-center text-sm text-muted">
            まだ鑑賞記録がありません。映画を検索して記録を追加してみましょう。
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {logs?.map((log) => (
              <article
                key={log.id}
                className="card card-hover overflow-hidden"
              >
                <Link href={`/movie/movieDetailPage/${log.movieId}`} className="block">
                  <div className="p-5" >
                    <p className="line-clamp-2 text-sm font-bold leading-snug">
                      {log.title}
                    </p>

                    <dl className="mt-3 space-y-1.5 text-xs text-muted">
                      <div className="flex items-center gap-2">
                        <dt className="w-12 shrink-0">鑑賞日</dt>
                        <dd className="font-medium text-foreground">
                          {log.watchedAt.toISOString().split('T')[0]}
                        </dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <dt className="w-12 shrink-0">評価</dt>
                        <dd>
                          <span className="badge badge-primary">{log.rating} / 10</span>
                        </dd>
                      </div>
                    </dl>

                    <input type="hidden" name="movieId" value={log.movieId} />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* --------------------------------------------------------------------
     [編集] 見た目のみ変更（編集／削除の各 Server Action 呼び出しは従来どおり）
     - ページ内に埋め込まれるコンポーネントのため <main> → <div> へ変更
     - 入力欄に .input / .field-label、ボタンに .btn 系クラスを適用
     - 削除確認部分を警告色のパネルとして区別できるようにした
     - 記録が0件のときの空状態を追加
     -------------------------------------------------------------------- */
  return(
    <div className="w-full">
      <h2 className="text-sm font-bold tracking-tight">あなたの鑑賞記録</h2>

      {!logs || logs.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-line px-5 py-8 text-center text-sm text-muted">
          この作品の記録はまだありません。
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {logs?.map((log) => (
            <article
              key={log.id}
              className="card overflow-hidden"
            >
              <div className="p-5">
                {isEdit && editId==log.id ?(
                  <div className="space-y-4">
                    <form action={updateMovieLog} className="space-y-4">
                      <div>
                        <label className="field-label" htmlFor={`watchDate-${log.id}`}>鑑賞日</label>
                        <input
                          id={`watchDate-${log.id}`}
                          type="date"
                          name="watchDate"
                          defaultValue={(log.watchedAt.toISOString().split('T')[0])}
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="field-label" htmlFor={`HyoukaSlider-${log.id}`}>
                          評価
                          <span className="ml-2 font-bold text-primary">{log.rating} / 10</span>
                        </label>
                        <input
                          type="range"
                          name="hyouka"
                          min="1"
                          max="10"
                          id={`HyoukaSlider-${log.id}`}
                          defaultValue={log.rating}
                          className="input-range"
                          />
                      </div>

                      <div>
                        <label className="field-label" htmlFor={`comment-${log.id}`}>コメント</label>
                        <textarea
                            id={`comment-${log.id}`}
                            name="comment"
                            placeholder="コメントを記入"
                            rows={4}
                            defaultValue={String(log.review)}
                            className="input resize-y"/>
                      </div>

                      <button type="submit" className="btn btn-primary w-full sm:w-auto">更新</button>
                      <input type="hidden" name="movieLogId" value={log.id} />
                      <input type="hidden" name="movieId" value={log.movieId} />
                    </form>

                    <div className="divider" />

                    <div className="flex flex-wrap gap-2">
                      <form action={setDeleteMode}>
                        <button type="submit" className="btn btn-outline btn-sm text-danger">削除</button>
                      </form>
                      <form action={setEditMode}>
                        <button type="submit" className="btn btn-ghost btn-sm">取消</button>
                        <input type="hidden" name="editId" value="" />
                      </form>
                    </div>

                    {isDelete ?(
                      <div className="rounded-xl border border-danger/40 bg-danger/5 p-4">
                        <p className="text-sm font-semibold text-danger">この鑑賞記録を削除しますか？</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <form action={deleteMovieLog}>
                            <button type="submit" className="btn btn-danger btn-sm">はい</button>
                            <input type="hidden" name="movieLogId" value={log.id} />
                            <input type="hidden" name="movieId" value={log.movieId} />
                          </form>
                          <form action={setDeleteMode}>
                            <button type="submit" className="btn btn-outline btn-sm">戻る</button>
                          </form>
                        </div>
                      </div>
                    ):(
                    <></>
                    )
                    }
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-muted">
                        <span className="w-14 shrink-0 text-xs font-semibold">鑑賞日</span>
                        <span className="font-medium text-foreground">{log.watchedAt.toISOString().split('T')[0]}</span>
                      </p>
                      <p className="flex items-center gap-2 text-muted">
                        <span className="w-14 shrink-0 text-xs font-semibold">評価</span>
                        <span className="badge badge-primary">{log.rating} / 10</span>
                      </p>
                      <div className="text-muted">
                        <span className="text-xs font-semibold">コメント</span>
                        <p className="mt-1 whitespace-pre-wrap leading-relaxed text-foreground">{String(log.review)}</p>
                      </div>
                    </div>
                    <div>
                      <form action={setEditMode}>
                        <button type="submit" className="btn btn-outline btn-sm">編集</button>
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
      )}
    </div>
  )
}
