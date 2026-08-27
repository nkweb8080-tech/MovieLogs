//日付入力が納得できない
export default async function RegistPage(){
    
  return(
    <main className="mx-auto max-w-5xl p-6">
        <div>
            <h1>鑑賞記録</h1>
            <form>
                <p>鑑賞日</p>
                <input type="date" name="watchDate"/>
                <p>評価</p>
                <input 
                    type="range"
                    name="Hyouka"
                    min="1"
                    max="10"
                    id="HyoukaSlider"/>
                <p>コメント</p>
                <textarea 
                    name="comment"
                    placeholder="コメントを記入"
                    cols={40}
                    rows={4}/>
                <button>登録</button>
            </form>
        </div>
    </main>
  )
}