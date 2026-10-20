//日付入力が納得できない
import { registMovieLog } from "@/app/Script/Functions/RegistMovieLogs"

type RegistComponentProps = {
    userId: string
    movieId: number
    title: string
}

export default async function RegistComponent({userId,movieId,title}:RegistComponentProps){

  return(
    <div className="card p-5">
        <h2 className="text-sm font-bold tracking-tight">鑑賞記録を登録</h2>

        <form action={registMovieLog} className="mt-4 space-y-4">
            <div>
                <label className="field-label" htmlFor="watchDate">鑑賞日</label>
                <input id="watchDate" type="date" name="watchDate" className="input"/>
            </div>

            <div>
                <label className="field-label" htmlFor="HyoukaSlider">評価（1〜10）</label>
                <input
                    type="range"
                    name="hyouka"
                    min="1"
                    max="10"
                    id="HyoukaSlider"
                    className="input-range"/>
            </div>

            <div>
                <label className="field-label" htmlFor="comment">コメント</label>
                <textarea
                    id="comment"
                    name="comment"
                    placeholder="コメントを記入"
                    rows={4}
                    className="input resize-y"/>
            </div>

            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="movieId" value={movieId} />
            <input type="hidden" name="title" value={title} />

            <button type="submit" className="btn btn-primary w-full">登録</button>
        </form>
    </div>
  )
}
