export default async function RegistPage(){

  return(
    <main className="mx-auto max-w-5xl p-6">
        <div>
            <h1>鑑賞記録</h1>
            <form>
                <p>鑑賞日</p>
                <input type="date" name="watchDate"/>
                <p>評価</p>
                <input type="range" name="Hyouka"/>
                <p>コメント</p>
                <input type="text" name="comment" placeholder="コメントを記入"/>
            </form>
        </div>
    </main>
  )
}