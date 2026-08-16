import Image from "next/image"
import Link from "next/link"
import { searchMovies } from "../../Script/anyApiFunction/tmdbApi"
import type { SearchMovieProps } from "../../Types/SearchPageType"

export default async function MovieSearchPage({
  searchParams,
}: SearchMovieProps) {
  //検索処理用パラメータ
  const params = await searchParams;
  const query = params.query?.trim() ?? "";
  const page = Number(params.page ?? "1");

  //検索処理
  const result = query
    ? await searchMovies(query, page)
    : null;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">映画を検索</h1>

      <form method="get" className="mt-6 flex gap-2">
        <label htmlFor="query" className="sr-only">
          映画タイトル
        </label>

        <input
          id="query"
          name="query"
          defaultValue={query}
          placeholder="映画タイトルを入力"
          className="flex-1 rounded border p-3"
        />

        <button
          type="submit"
          className="rounded bg-black px-5 py-3 text-white"
        >
          検索
        </button>
      </form>

      {!query && (
        <p className="mt-6">
          映画タイトルを入力してください。
        </p>
      )}

      {query && result?.results.length === 0 && (
        <p className="mt-6">
          該当する映画が見つかりませんでした。
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {result?.results.map((movie) => (
          <article
            key={movie.id}
            className="overflow-hidden rounded border"
          >
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title}のポスター`}
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

            <div className="p-4">
              <h2 className="font-bold">{movie.title}</h2>

              <p className="mt-1 text-sm text-gray-600">
                {movie.release_date
                  ? movie.release_date.slice(0, 4)
                  : "公開年不明"}
              </p>

              <Link href={`/movie/movieDetailPage/${movie.id}`}>詳細を見る</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}