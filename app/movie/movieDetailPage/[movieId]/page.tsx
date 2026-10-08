import Image from "next/image"
import { cookies } from "next/headers"
import { getUserInfo } from '@/app/Script/cookieAction/cookieAction'
import { setToggleModal } from "@/app/Script/cookieAction/cookieAction"
import { getMovieDetail } from "@/app/Script/anyApiFunction/tmdbApi"
import MovieLogsComponent from "@/app/Common/MovieLogsComponents"
import GoToButton from "@/app/Common/GoToPageButton"
import BackButton from "@/app/Common/PageBackButton"
import RegistComponent from "@/app/Common/RagistComponents"

type MovieProps = {
  params: Promise<{
    movieId: number;
  }>;
}

export default async function MovieDetailPage({
    params,
}:MovieProps){
  const cookieStore = await cookies()
  const { movieId } = await params

  const showFlag = cookieStore.get("showModal")?.value === "true"
  const userId = String(await getUserInfo())

  //詳細情報検索処理
  const result = movieId
    ? await getMovieDetail(movieId)
    : null;

  /* ------------------------------------------------------------------
     [編集] 見た目のみ変更（Cookie 制御・詳細取得・登録フォームの開閉は従来どおり）
     - 全要素を 4 カラムグリッドに詰め込んでいたレイアウトを、
       「ポスター＋作品情報」／「鑑賞記録」の2ブロック構成に再編
     - 作品情報を定義リスト（dt/dd）に整理し、評価・ジャンルはバッジ表示
     - 無効な className="width:400px" を削除し、登録フォームの幅を正しく制御
     - 未ログイン時のみログイン導線を表示
     ------------------------------------------------------------------ */
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackButton/>
          {!userId && (
            <GoToButton label="ログイン" goToPath='/movie/LoginPage' variant="outline"></GoToButton>
          )}
        </div>

        <h1 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">映画詳細</h1>

        <section className="card mt-4 overflow-hidden p-5 sm:p-7">
          <div className="grid gap-7 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-xl border border-line">
              {result?.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${result?.poster_path}`}
                  alt={`${result?.title}のポスター`}
                  width={500}
                  height={750}
                  loading="eager"
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center bg-surface-2 text-sm text-muted">
                  画像なし
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight">
                {result?.title}
              </h2>

              {result?.original_title && result?.original_title !== result?.title ? (
                <p className="mt-1 text-sm text-muted">{result?.original_title}</p>
              ) : (
                <></>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="badge badge-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-3.5"
                    aria-hidden="true"
                  >
                    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z" />
                  </svg>
                  {result?.vote_average} / 10
                </span>

                {result?.genre_ids && result.genre_ids.length > 0 ? (
                  result.genre_ids.map((genreId) => (
                    <span key={genreId} className="badge">{genreId}</span>
                  ))
                ) : (
                  <span className="badge">ジャンル不明</span>
                )}
              </div>

              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-xs font-semibold text-muted">公開日</dt>
                  <dd>{result?.release_date ? result?.release_date : "不明"}</dd>
                </div>
              </dl>

              {result?.overview ? (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-muted">あらすじ</p>
                  <p className="mt-1.5 text-sm leading-relaxed">{result?.overview}</p>
                </div>
              ) : (
                <></>
              )}

              <form action={setToggleModal} className="mt-6">
                <button type="submit" className={`btn ${showFlag ? "btn-outline" : "btn-primary"}`}>
                  {showFlag ? "閉じる" : "鑑賞記録を追加"}
                </button>
              </form>

              {showFlag && result &&(
                <div className="mt-4 max-w-md">
                  <RegistComponent userId={userId} movieId={movieId} title={result?.title}/>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <MovieLogsComponent mode="MovieDetailPage" movieId={String(movieId)}/>
        </section>
    </main>
  )
}
