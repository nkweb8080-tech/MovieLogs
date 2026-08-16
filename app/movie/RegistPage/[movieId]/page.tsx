import BackButton from "@/app/Common/PageBackButton";

type ResistProps = {
  params: Promise<{
    movieId: number;
  }>;
}


export default async function RegistPage({
    params,
}:ResistProps){
  const { movieId } = await params
  return(
    <main className="mx-auto max-w-5xl p-6">
        <h1>鑑賞記録</h1>
        <BackButton/>
    </main>
  )
}