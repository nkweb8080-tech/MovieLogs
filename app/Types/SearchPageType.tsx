// Security: 同名パラメータが複数指定された場合は配列で渡されるため、実際の値に合わせて型を修正
export type SearchParams = {
  query?: string | string[];
  page?: string | string[];
};

export type SearchMovieProps = {
  searchParams: Promise<SearchParams>;
};

//クエリパラメータの先頭の値を取得
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
