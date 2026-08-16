import Image from "next/image"
import Link from "next/link"
import BackButton from "@/app/Common/PageBackButton";
import { getMovieDetail } from "@/app/Script/anyApiFunction/tmdbApi"

type MovieProps = {
  params: Promise<{
    movieId: number;
  }>;
}

export default async function MovieDetailPage({
    params,
}:MovieProps){
  const { movieId } = await params;

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
              <Link href={`/movie/RegistPage/${movieId}`}>鑑賞記録を追加</Link>
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
        </div>
    </main>
  )
}