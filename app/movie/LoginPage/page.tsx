import GoToButton from '@/app/Common/GoToPageButton'
import BackButton from "@/app/Common/PageBackButton"
import { Login } from "@/app/Script/prismaFunction/LoginFunction"

export default async function LoginPage(){

    return (
        <main className="mx-auto w-full max-w-md px-6 py-10">
            <div className="card mt-4 p-6 sm:p-8">
                <h1 className="text-2xl font-bold tracking-tight">ログイン</h1>
                <p className="mt-1 text-sm text-muted">
                    登録済みのメールアドレスとパスワードを入力してください。
                </p>

                <form action={ Login } className="mt-6 space-y-4">
                    <div>
                        <label className="field-label" htmlFor="email">ユーザID</label>
                        <input id="email" type="text" name="email" placeholder="sample@gamil.com" className="input"/>
                    </div>

                    <div>
                        <label className="field-label" htmlFor="password">パスワード</label>
                        <input id="password" type="text" name="password" placeholder="パスワード" className="input"/>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">ログイン</button>
                </form>

                <div className="divider my-6" />

                <div className="text-center">
                    <p className="mb-3 text-sm text-muted">アカウントをお持ちでない方</p>
                    <GoToButton label="新規登録" goToPath='/movie/NewUserPage' variant="outline"></GoToButton>
                </div>
                <BackButton/>
            </div>
        </main>
    )
}
