export type SearchParams = {
  query?: string;
  page?: string;
};

export type SearchMovieProps = {
  searchParams: Promise<SearchParams>;
};