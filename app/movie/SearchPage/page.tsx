import Image from "next/image"
import Link from "next/link"
import { searchMovies, TMDB_MAX_PAGE } from "@/app/Script/APIs/tmdbApi"
import { parseIntInRange } from "@/app/Common/Validation"
import { firstParam, type SearchMovieProps } from "@/app/Types/SearchPageType"

export default async function MovieSearchPage({
  searchParams,
}: SearchMovieProps) {
  //検索処理用パラメータ
  const params = await searchParams;
  // Security: ?query=a&query=b のような配列指定で trim() が例外にならないよう先頭の値のみ使用
  const query = firstParam(params.query)?.trim() ?? "";
  // Security: クエリパラメータのページ番号を検証し、不正値は1ページ目とする
  const page = parseIntInRange(firstParam(params.page) ?? "1", 1, TMDB_MAX_PAGE) ?? 1;

  //検索処理
  const result = query
    ? await searchMovies(query, page)
    : null;

  return (
    <section className="w-full">
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
        映画を検索
      </h1>

      <form
        method="get"
        className="card mt-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
      >
        <label htmlFor="query" className="sr-only">
          映画タイトル
        </label>

        <input
          id="query"
          name="query"
          defaultValue={query}
          placeholder="映画タイトルを入力"
          className="input sm:flex-1"
        />

        <button
          type="submit"
          className="btn btn-primary sm:w-32"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          検索
        </button>
      </form>
      {!query && (
        <p className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center text-sm text-muted">
          映画タイトルを入力してください。
        </p>
      )}

      {query && result?.results.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center text-sm text-muted">
          該当する映画が見つかりませんでした。
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {result?.results.map((movie) => (
          <article
            key={movie.id}
            className="card card-hover overflow-hidden"
          >
            <Link href={`/movie/movieDetailPage/${movie.id}`} className="block">
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
                <div className="flex aspect-[2/3] items-center justify-center bg-surface-2 text-sm text-muted">
                  画像なし
                </div>
              )}

              <div className="p-4">
                <h2 className="line-clamp-2 text-sm font-bold leading-snug">
                  {movie.title}
                </h2>

                <p className="mt-1 text-xs text-muted">
                  {movie.release_date
                    ? movie.release_date.slice(0, 4)
                    : "公開年不明"}
                </p>

                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  詳細を見る
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
