import Image from "next/image"
import { cookies } from "next/headers"
import { toggleModal } from "@/app/Common/CookieAction"
import { getMovieDetail } from "@/app/Script/anyApiFunction/tmdbApi"
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

  //詳細情報検索処理
  const result = movieId
    ? await getMovieDetail(movieId)
    : null;

  return (
    <main className="mx-auto max-w-5xl p-6">
        <BackButton/>
        <h1>映画詳細</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              <div className="flex aspect-[2/3] items-center justify-center bg-gray-100">
                画像なし
              </div>
            )}

            <div>
              <form action={toggleModal}>
                <button type="submit">{showFlag ? "閉じる" : "鑑賞記録を追加"}</button>
              </form>
              <p>タイトル：{result?.title}</p>
              {result?.original_title && result?.original_title !== result?.title ? (
                <p>原題　　：{result?.original_title}</p>
              ) : (
                <></>
              )}
              {result?.release_date ? (
                <p>公開日　：{result?.release_date}</p>
              ) : (
                <p>公開日　：不明</p>
              )}
              <p>ジャンル：{result?.genre_ids}</p>
              <p>評価　　：{result?.vote_average} / 10</p>
              {result?.overview ? (
                <p>あらすじ：<br></br>{result?.overview}</p>
              ) : (
                <></>
              )}
            </div>
              {showFlag && (
                <div>
                  <RegistComponent/>
                </div>
              )}
        </div>
    </main>
  )
}