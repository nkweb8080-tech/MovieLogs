import BackButton from "@/app/Common/PageBackButton"
import { registUser } from "@/app/Script/registFunction/RegistNewUser"

export default async function WelcomePage(){
    /* ------------------------------------------------------------------
       [編集] 見た目のみ変更（registUser アクション・input の name は従来どおり）
       - ログインページと同じ認証カードのデザインに統一
       - label / .input / .btn を適用し、パスワード条件を補助文として追記
       ------------------------------------------------------------------ */
    return (
        <main className="mx-auto w-full max-w-md px-6 py-10">
            <BackButton/>

            <div className="card mt-4 p-6 sm:p-8">
                <h1 className="text-2xl font-bold tracking-tight">新規登録</h1>
                <p className="mt-1 text-sm text-muted">
                    メールアドレスとパスワードを登録すると、鑑賞記録を保存できます。
                </p>

                <form action={ registUser } className="mt-6 space-y-4">
                    <div>
                        <label className="field-label" htmlFor="email">Eメール</label>
                        <input id="email" type="text" name="email" placeholder="sample@.com" className="input"/>
                    </div>

                    <div>
                        <label className="field-label" htmlFor="password">パスワード</label>
                        <input id="password" type="text" name="password" placeholder="パスワード" className="input"/>
                        <p className="mt-1.5 text-xs text-muted">8文字以上で入力してください。</p>
                    </div>

                    <div>
                        <label className="field-label" htmlFor="checkPassword">確認用</label>
                        <input id="checkPassword" type="text" name="checkPassword" placeholder="もう一度入力してください" className="input"/>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">新規登録</button>
                </form>
            </div>
        </main>
    )
}
