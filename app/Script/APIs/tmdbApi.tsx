// Security: APIトークンを扱うためサーバ専用モジュールとして明示（クライアントへの混入防止）
import "server-only"
import { Message } from "@/app/Common/Message"
import type { TmdbMovie, TmdbSearchResponse } from "@/app/Types/tmdbType";

//TMDBの検索APIが受け付けるページ番号の上限
export const TMDB_MAX_PAGE = 500

//認証確認
function checkAuthorization(): string {
    //トークン
    const tmdbApiToken = process.env.TMDB_ACCESS_TOKEN

    if(!tmdbApiToken) throw new Error(Message.SEARCH.API_TOKEN_ERROR)

    return `Bearer ${tmdbApiToken}`
}

// Refactor: 検索・詳細で重複していたリクエスト処理を共通化し、Security: ベースURL未設定時は明示的にエラー
async function fetchTmdb(
    path: string,
    params: Record<string, string>,
    revalidate: number,
): Promise<Response> {
    const baseUrl = process.env.TMDB_API_BASE_URL
    if (!baseUrl) throw new Error(Message.COMMON.SYSTEM_ERROR)

    return fetch(
        `${baseUrl}${path}?${new URLSearchParams(params).toString()}`,
        {
            headers: {
                Authorization: checkAuthorization(),
                Accept: "application/json",
            },
            next: {
                revalidate,
            },
        },
    );
}

//検索処理
export async function searchMovies(
    query: string,
    page : number,
): Promise<TmdbSearchResponse>
{
    const normalizedQuery = query.trim();

    //正規化できなかった場合の設定
    if (!normalizedQuery) {
        return {
            page: 1,
            results: [],
            total_pages: 0,
            total_results: 0,
        };
    }

    // Security: 不正なページ番号（NaN・範囲外）は1ページ目として扱う
    const safePage = Number.isInteger(page) && page >= 1 && page <= TMDB_MAX_PAGE ? page : 1

    //映画情報取得
    const response = await fetchTmdb(
        "/search/movie",
        {
            query: normalizedQuery,
            language: "ja-JP",
            include_adult: "false",
            page: String(safePage),
        },
        300,
    );

    if (!response.ok) throw new Error (`${Message.SEARCH.FAIL_SEARCH_MOVIE} status=${response.status}`)

    return (await response.json()) as TmdbSearchResponse;
}

//映画詳細
export async function getMovieDetail(
  tmdbMovieId: number,
): Promise<TmdbMovie> {
  // Security: URLパスに埋め込む値のため正の整数のみ許可
  if (!Number.isSafeInteger(tmdbMovieId) || tmdbMovieId <= 0) {
    throw new Error(Message.SEARCH.NOT_FOUND_MOVIE);
  }

  const response = await fetchTmdb(
    `/movie/${tmdbMovieId}`,
    { language: "ja-JP" },
    86400,
  );

  if (response.status === 404) {
    throw new Error(Message.SEARCH.NOT_FOUND_MOVIE);
  }

  if (!response.ok) {
    throw new Error(Message.SEARCH.FAIL_GET_MOVIEINFO);
  }

  return (await response.json()) as TmdbMovie;
}
