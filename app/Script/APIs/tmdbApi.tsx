import { Message } from "@/app/Common/Message"
import type { TmdbMovie, TmdbSearchResponse } from "@/app/Types/tmdbType";

//認証確認
function checkAuthorization(): string {
    //トークン
    const tmdbApiToken = process.env.TMDB_ACCESS_TOKEN

    if(!tmdbApiToken) throw new Error(Message.SEARCH.API_TOKEN_ERROR)

    return `Bearer ${tmdbApiToken}`
}

//検索処理
export async function searchMovies(
    query: string,
    page : number,
): Promise<TmdbSearchResponse>
{
    const TMDB_API_BASE_URL = process.env.TMDB_API_BASE_URL
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

    //検索パラメータ
    const searchParams = new URLSearchParams({
        query: normalizedQuery,
        language: "ja-JP",
        include_adult: "false",
        page: String(page),    
    })

    //映画情報取得
    const response = await fetch(
        `${TMDB_API_BASE_URL}/search/movie?${searchParams.toString()}`,
        {
            headers: {
                Authorization: checkAuthorization(),
                Accept: "application/json",
            },
            next: {
                revalidate: 300,
            },
        },
    );

    if (!response.ok) throw new Error (`${Message.SEARCH.FAIL_SEARCH_MOVIE} status=${response.status}`)

    return (await response.json()) as TmdbSearchResponse;
}

//映画詳細
export async function getMovieDetail(
  tmdbMovieId: number,
): Promise<TmdbMovie> {
  const response = await fetch(
    `${process.env.TMDB_API_BASE_URL}/movie/${tmdbMovieId}?language=ja-JP`,
    {
      headers: {
        Authorization: checkAuthorization(),
        Accept: "application/json",
      },
      next: {
        revalidate: 86400,
      },
    },
  );
  
  if (response.status === 404) {
    throw new Error(Message.SEARCH.NOT_FOUND_MOVIE);
  }

  if (!response.ok) {
    throw new Error(Message.SEARCH.FAIL_GET_MOVIEINFO);
  }

  return (await response.json()) as TmdbMovie;
}